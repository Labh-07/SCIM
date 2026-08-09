import uuid
from io import BytesIO

from PIL import Image, ImageOps  

import boto3
from app.config.config import settings
from starlette.concurrency import run_in_threadpool

def _get_s3_client():
    return boto3.client(
        "s3",
        region_name=settings.s3_region,
        aws_access_key_id=(
            settings.s3_access_key_id.get_secret_value()
            if settings.s3_access_key_id
            else None
        ),
        aws_secret_access_key=(
            settings.s3_secret_access_key.get_secret_value()
            if settings.s3_secret_access_key
            else None
        ),
        endpoint_url=settings.s3_endpoint_url,
    )
def process_post_image(content: bytes) -> tuple[bytes, str]:

    with Image.open(BytesIO(content)) as original:

        # Fix EXIF orientation from mobile cameras
        img = ImageOps.exif_transpose(original)

        # Convert to RGB
        if img.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", img.size, "white")

            if img.mode == "P":
                img = img.convert("RGBA")

            background.paste(
                img,
                mask=img.getchannel("A")
                if img.mode == "RGBA"
                else None,
            )

            img = background

        else:
            img = img.convert("RGB")

        # Landscape post format
        img = ImageOps.fit(
            img,
            (1200, 800),
            method=Image.Resampling.LANCZOS,
        )

        # Unique filename
        filename = f"{uuid.uuid4().hex}.jpg"

        # High-quality JPEG
        output = BytesIO()

        img.save(
            output,
            format="JPEG",
            quality=90,
            optimize=True,
        )

        output.seek(0)

        return output.read(), filename
def _upload_to_s3(file_bytes: bytes, key: str) -> None:
    s3 = _get_s3_client()
    s3.upload_fileobj(
        BytesIO(file_bytes),
        settings.s3_bucket_name,
        key,
        ExtraArgs={"ContentType": "image/jpeg"},
    )


def _delete_from_s3(key: str) -> None:
    s3 = _get_s3_client()
    s3.delete_object(Bucket=settings.s3_bucket_name, Key=key)


async def upload_post_image(file_bytes: bytes, filename: str) -> None:
    key = f"post_pics/{filename}"
    await run_in_threadpool(_upload_to_s3, file_bytes, key)


async def delete_post_image(filename: str | None) -> None:
    if filename is None:
        return
    key = f"post_pics/{filename}"
    await run_in_threadpool(_delete_from_s3, key)
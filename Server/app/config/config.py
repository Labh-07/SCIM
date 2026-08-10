from pydantic_settings import BaseSettings , SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env",".env.prod"),
        env_file_encoding="utf-8",
    )

    database_url:str

    secret_key:SecretStr
    token_expiration_time:int = 360
    algorithm:str ='HS256'

    # S3 Configuration
    s3_bucket_name: str
    s3_region: str = "us-east-1"
    s3_access_key_id: SecretStr | None = None
    s3_secret_access_key: SecretStr | None = None
    s3_endpoint_url: str | None = None
    
    max_upload_size_bytes:int = 5*1024*1024


settings = Settings()
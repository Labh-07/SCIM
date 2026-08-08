from pydantic_settings import BaseSettings , SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env",".env.prod"),
        env_file_encoding="utf-8",
    )

    database_url:str

    secret_key:SecretStr
    token_expiration_time:int = 30
    algorithm:str ='HS256'



settings = Settings()
from pathlib import Path
from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = Field(...)
    secret_key: str = Field(...)
    access_token_expire_minutes: int = Field(default=60)
    cors_origins: list[str] = Field(default_factory=list)
    upload_dir: Path = Field(default=Path("./uploads"))
    max_upload_size: int = Field(default=10 * 1024 * 1024)
    allowed_upload_mime_types: list[str] = Field(
        default_factory=lambda: [
            "image/jpeg",
            "image/png",
            "application/pdf",
        ]
    )
    environment: str = Field(default="development")

    project_name: str = "MediKiosk"
    api_v1_prefix: str = "/api/v1"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
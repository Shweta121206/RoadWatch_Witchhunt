from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    app_name: str = "RoadWatch API"
    database_url: str = f"sqlite:///{BASE_DIR / 'roadwatch.db'}"
    upload_dir: Path = BASE_DIR / "uploads"
    model_path: Path = BASE_DIR / "model" / "best.pt"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(
        env_prefix="ROADWATCH_",
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
    )


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.model_path.parent.mkdir(parents=True, exist_ok=True)
    return settings


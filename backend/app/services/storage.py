import uuid
from pathlib import Path

from app.core.config import settings


class FileStorage:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or settings.upload_dir
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def save(self, case_id: uuid.UUID, original_name: str, content: bytes) -> str:
        case_dir = self.base_dir / str(case_id)
        case_dir.mkdir(parents=True, exist_ok=True)

        suffix = Path(original_name).suffix
        stored_name = f"{uuid.uuid4().hex}{suffix}"
        target = case_dir / stored_name
        target.write_bytes(content)
        return str(target)

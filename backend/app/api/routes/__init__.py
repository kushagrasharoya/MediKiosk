from fastapi import APIRouter

from app.api.routes import cases

api_router = APIRouter()
api_router.include_router(cases.router)

__all__ = ["api_router"]

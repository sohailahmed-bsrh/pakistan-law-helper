from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import logging
from .rag import process_question

logger = logging.getLogger(__name__)
router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    province: str = "Federal" # Optional, frontend might still send it

@router.post("/ask")
def ask_question(request: QuestionRequest):
    """
    Receives a legal question and province from the frontend,
    and returns the processed RAG answer.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Invalid/empty question")

    try:
        result = process_question(request.question, request.province)
        return result
    except ValueError as e:
        # For known validation/configuration errors (e.g. missing API key)
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except RuntimeError as e:
        # For known operational errors (e.g. ChromaDB unavailable)
        logger.error(f"Operational error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Unexpected server error")

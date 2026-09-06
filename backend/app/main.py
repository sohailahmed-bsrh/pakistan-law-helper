from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router

app = FastAPI(title="Pakistan Law Helper", description="API for retrieving Pakistani legal information.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import chromadb
from .config import Config

app.include_router(api_router, prefix="/api/legal")

@app.get("/")
def root():
    return {"status": "ok", "message": "Pakistan Law Helper API is running."}

from .rag import chroma_client

@app.get("/health")
def health_check():
    """
    Check backend status and ChromaDB availability.
    """
    health_status = {
        "backend": "ok",
        "chromadb": "unknown",
        "message": ""
    }
    try:
        if chroma_client:
            chroma_client.heartbeat()
            health_status["chromadb"] = "ok"
        else:
            health_status["chromadb"] = "error"
            health_status["message"] = "ChromaDB client is not initialized globally."
    except Exception as e:
        health_status["chromadb"] = "error"
        health_status["message"] = str(e)
        
    return health_status

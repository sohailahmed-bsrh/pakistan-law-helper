import os
from dotenv import load_dotenv

# Load env variables if .env exists
load_dotenv()

class Config:
    """
    Central configuration for backend services.
    Loads settings from environment variables.
    """
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./data/chroma_db")
    CHROMA_COLLECTION_NAME = "pakistan_laws"
    
    # Retrieval configuration
    TOP_K_RESULTS = 3

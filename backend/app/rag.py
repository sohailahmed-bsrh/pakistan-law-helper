import os
import chromadb
from .answer import generate_answer

from .config import Config
import logging

logger = logging.getLogger(__name__)

# Initialize client globally
try:
    absolute_db_path = os.path.abspath(Config.CHROMA_DB_PATH)
    logger.info(f"Initializing ChromaDB client at {absolute_db_path}")
    chroma_client = chromadb.PersistentClient(path=absolute_db_path)
    # Check if collection exists by getting or creating
    chroma_collection = chroma_client.get_collection(name=Config.CHROMA_COLLECTION_NAME)
except Exception as e:
    logger.error(f"Failed to initialize ChromaDB globally: {e}")
    chroma_client = None
    chroma_collection = None

def get_chroma_collection():
    if chroma_collection is None:
        raise RuntimeError(f"ChromaDB collection '{Config.CHROMA_COLLECTION_NAME}' is missing or could not be loaded.")
    return chroma_collection

def normalize_jurisdiction(province: str) -> str:
    """Normalize frontend province names to match ChromaDB jurisdiction metadata."""
    if not province:
        return "federal"
    # Example: "Khyber Pakhtunkhwa" -> "khyber_pakhtunkhwa"
    return province.lower().replace(" ", "_").replace("-", "_")

def process_question(question: str, province: str) -> dict:
    """
    Orchestrates the Retrieval-Augmented Generation (RAG) pipeline.
    Retrieves legal text from ChromaDB and passes it to Groq LLM.
    """
    collection = get_chroma_collection()
    
    # Normalize jurisdiction to match the metadata format stored in ChromaDB
    jurisdiction = normalize_jurisdiction(province)
    
    # 1. Retrieve relevant legal text
    # Filter by jurisdiction exactly matching the selected province
    results = collection.query(
        query_texts=[question],
        n_results=Config.TOP_K_RESULTS,
        where={"jurisdiction": jurisdiction}
    )
    
    sources = []
    context_parts = []
    
    # Check if we found matching documents for the specific province
    if not results['documents'] or not results['documents'][0]:
        return {
            "question": question,
            "province": province,
            "searchId": "PLH-0000-01",
            "answer": f"No relevant law found for {province}.",
            "sources": [],
            "keyPoints": [],
            "lawName": "Unknown",
            "year": "Unknown",
            "sectionNumber": "Unknown",
            "originalLegalText": "Unknown",
            "verificationStatus": "Pending",
            "sourceInformation": {}
        }
    
    if results['documents'] and results['documents'][0]:
        docs = results['documents'][0]
        metas = results['metadatas'][0]
        
        for doc, meta in zip(docs, metas):
            context_parts.append(doc)
            sources.append({
                "law_name": meta.get("law_name", "Unknown"),
                "jurisdiction": meta.get("jurisdiction", "Unknown"),
                "source_file": meta.get("source_file", "Unknown"),
                "page_number": meta.get("page_number", "Unknown"),
                "chunk_id": meta.get("chunk_id", "Unknown")
            })
            
    mock_context = "\n\n".join(context_parts) if context_parts else ""
    
    # 2. Generate Answer
    try:
        answer_data = generate_answer(question, province, mock_context)
        if not isinstance(answer_data, dict):
            answer_data = {"answer": str(answer_data)}
    except Exception as e:
        logger.error(f"Failed to generate answer: {e}")
        answer_data = {"answer": "Error: Could not process legal answer at this time. Please try again."}
    
    # 3. Verify Answer (Merge LLM flag with verification logic)
    # Extract fields with safe fallbacks
    is_verified_llm = answer_data.get("isVerified", True)
    ans_text = answer_data.get("answer", "")
    
    if ans_text.startswith("I don't know") or not is_verified_llm:
        is_verified_llm = False
        
    verification_status = "Verified" if is_verified_llm else "Unverified"
    
    law_name = answer_data.get("lawName", "Unknown") if is_verified_llm else "Unknown"
    year = answer_data.get("year", "Unknown") if is_verified_llm else "Unknown"
    section_number = answer_data.get("sectionNumber", "Unknown") if is_verified_llm else "Unknown"
    key_points = answer_data.get("keyPoints", []) if is_verified_llm else []
    
    if not isinstance(key_points, list):
        key_points = [str(key_points)]
    
    # If the LLM failed to identify the source law name, we leave it as "Unknown" 
    # instead of falling back to internal encoded PDF filenames.
    
    # Return structured data matching frontend expectations
    return {
        "question": question,
        "province": province,
        "searchId": "PLH-0000-01",
        "answer": ans_text or "This is a placeholder answer pending backend integration.",
        "sources": sources,
        "keyPoints": key_points,
        "lawName": law_name,
        "year": year,
        "sectionNumber": section_number,
        "originalLegalText": mock_context,
        "verificationStatus": verification_status,
        "sourceInformation": {
            "officialSource": law_name if is_verified_llm else "Not available",
            "publisher": (sources[0]["jurisdiction"] if sources else province) if is_verified_llm else "Not available",
            "reference": (sources[0]["source_file"] if sources else "Unknown") if is_verified_llm else "Not available"
        }
    }

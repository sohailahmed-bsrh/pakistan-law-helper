import os
import sys
import chromadb
from pypdf import PdfReader
from app.config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = r"C:\Users\BILAL.COM\Desktop\pakistan_law_helper\backend\data\law"

def chunk_text(text, chunk_size=1000, overlap=100):
    """Simple character-level chunking"""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def ingest():
    client = chromadb.PersistentClient(path=Config.CHROMA_DB_PATH)
    # Using the production collection
    collection = client.get_or_create_collection(name=Config.CHROMA_COLLECTION_NAME)
    
    total_chunks = 0
    total_pdfs = 0
    
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if file.lower().endswith(".pdf"):
                pdf_path = os.path.join(root, file)
                jurisdiction = os.path.basename(root)
                logger.info(f"Processing {jurisdiction}/{file}...")
                
                try:
                    reader = PdfReader(pdf_path)
                    pdf_chunks = []
                    pdf_meta = []
                    
                    for i, page in enumerate(reader.pages):
                        text = page.extract_text()
                        if text and text.strip():
                            page_chunks = chunk_text(text.strip())
                            for j, chunk in enumerate(page_chunks):
                                pdf_chunks.append(chunk)
                                pdf_meta.append({
                                    "law_name": file.replace(".pdf", "").replace("_", " "),
                                    "jurisdiction": jurisdiction,
                                    "source_file": file,
                                    "page_number": str(i + 1),
                                    "chunk_id": f"{file}-p{i+1}-c{j}",
                                    "document_type": "PDF"
                                })
                    
                    if pdf_chunks:
                        # Upsert in batches of 100 to avoid limits
                        batch_size = 100
                        for i in range(0, len(pdf_chunks), batch_size):
                            batch_docs = pdf_chunks[i:i+batch_size]
                            batch_meta = pdf_meta[i:i+batch_size]
                            batch_ids = [m["chunk_id"] for m in batch_meta]
                            
                            collection.upsert(
                                ids=batch_ids,
                                documents=batch_docs,
                                metadatas=batch_meta
                            )
                        
                        total_chunks += len(pdf_chunks)
                        total_pdfs += 1
                        logger.info(f"  Inserted {len(pdf_chunks)} chunks from {file}")
                    
                except Exception as e:
                    logger.error(f"Failed to process {file}: {e}")
                    
    logger.info(f"Ingestion complete! Successfully processed {total_pdfs} PDFs into {total_chunks} chunks.")
    
if __name__ == "__main__":
    ingest()

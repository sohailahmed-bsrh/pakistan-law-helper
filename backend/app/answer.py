from groq import Groq
from .config import Config
import logging
import json

logger = logging.getLogger(__name__)

LAW_ANSWER_PROMPT = """
You are a legal assistant specializing in Pakistani law.
Answer the user's question using ONLY the provided law documents context.
Do NOT guess legal facts.
If the provided context does not contain the answer, or if the requested law is completely unknown or not present in the context, you MUST output your answer starting exactly with: "I don't know. The available legal documents do not contain reliable information about" and then mention the requested topic/law.
Always append this disclaimer at the end of your response: "Disclaimer: This is an AI-generated response based on available documents and does not constitute formal legal advice."

You MUST output your response in valid JSON format.
Example structure:
{
  "answer": "Your detailed legal answer here...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "lawName": "Name of the relevant law",
  "year": "Year of the law",
  "sectionNumber": "Relevant section number(s)",
  "isVerified": true
}
IMPORTANT: Set `isVerified` to `true` ONLY if the answer is directly supported by the context. If you output "I don't know..." or if the context is irrelevant, you MUST set `isVerified` to `false` and set `lawName`, `year`, and `sectionNumber` to "Unknown".
"""

def generate_answer(question: str, province: str, context: str) -> dict:
    """
    Interfaces with the Groq API to generate a legal answer based on context.
    """
    if not Config.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing from configuration.")
        
    client = Groq(api_key=Config.GROQ_API_KEY)
    
    messages = [
        {"role": "system", "content": LAW_ANSWER_PROMPT},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
    ]
    
    try:
        completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=messages,
            temperature=0.0,
            max_tokens=900,
            response_format={"type": "json_object"}
        )
        answer_text = completion.choices[0].message.content
        return json.loads(answer_text)
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        raise RuntimeError("Failed to generate answer from LLM.")

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=wave&color=1D4ED8&height=150&section=header&text=Pakistan%20Law%20Helper&fontSize=50&fontAlignY=35&fontColor=ffffff" alt="Top Wave" />
  
  <br>
  
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=24&pause=1000&color=1D4ED8&center=true&vCenter=true&width=600&lines=AI-Powered+Legal+Assistant;Built+for+Students+%26+Researchers;Transparent+%26+Verified+Answers" alt="Typing SVG" />
  
  <p align="center">
    <strong>A modern Retrieval-Augmented Generation (RAG) platform delivering accurate, verified, and transparent Pakistani legal information.</strong>
  </p>

  <p align="center">
    <a href="#-project-overview">Overview</a> •
    <a href="#-core-features">Features</a> •
    <a href="#-how-it-works">How it Works</a> •
    <a href="#-installation--setup">Setup</a> •
    <a href="#-api-documentation">API</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white" alt="Groq" />
    <img src="https://img.shields.io/badge/ChromaDB-FF6B6B?style=for-the-badge" alt="ChromaDB" />
  </p>
</div>

<br>

# 📖 **Project Overview**

**Pakistan Law Helper** is an educational AI assistant designed specifically for law students, researchers, and citizens seeking structured access to Pakistani legal texts. By leveraging a custom **Retrieval-Augmented Generation (RAG)** pipeline, the system parses millions of tokens of official provincial and federal legal PDFs to provide highly accurate answers. 

Unlike generic LLMs that may hallucinate laws, this application cross-verifies every generated answer against the embedded legal text, ensuring that users receive the exact law name, section number, and original context.

> [!WARNING]
> **Educational Use Only:** This application is built for research and educational purposes. It is **not** a replacement for professional legal advice. Always consult a qualified lawyer and refer to official government gazettes for legal actions.

---

# ✨ **Core Features**

- **🧠 RAG-Powered Legal Answering:** Retrieves context from embedded PDF laws instead of relying on generic pre-trained LLM weights.
- **📍 Jurisdiction-Aware Filtering:** Filters vector searches by province (Federal, Punjab, Sindh, KPK, Balochistan, AJK, GB).
- **✅ Automated Verification System:** Cross-checks the LLM's answer with the retrieved chunks. If evidence is insufficient, it strictly defaults to *"I don't know"*.
- **📄 Transparent Source Citation:** Displays the original retrieved legal text, document name, and metadata right alongside the AI answer.
- **⚡ Ultra-Fast Inference:** Powered by the **Groq API** for near-instantaneous token generation.
- **🎨 Premium UI/UX:** Responsive, card-based interface with micro-animations and verified/unverified visual states.

---

# 📸 **Workflow & Screenshots**

<div align="center">
  
### 1. Ask a Legal Question
*Select your jurisdiction and input a specific legal query.*
<br>
<img src="frontend/src/screenshots/1.jpeg" width="800" alt="Landing Page" style="border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />

<br><br>

### 2. Loading State
*The system queries ChromaDB and generates the response via Groq.*
<br>
<img src="frontend/src/screenshots/2.jpg" width="800" alt="Loading State" style="border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />

<br><br>

### 3. AI Answer & Original Text
*The LLM processes the retrieved text and provides the exact law references.*
<br>
<img src="frontend/src/screenshots/3.jpg" width="800" alt="AI Legal Answer" style="border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />

<br><br>

### 4. Source Information & Verification
*Strict metadata mapping ensures you know exactly where the answer came from.*
<br>
<img src="frontend/src/screenshots/4.jpg" width="800" alt="Source and Verification" style="border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />

<br><br>

### 5. Unknown/Empty State Safety
*If the law doesn't exist, the system safely declines rather than hallucinating.*
<br>
<img src="frontend/src/screenshots/5.jpg" width="800" alt="Unknown State" style="border-radius: 8px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />

</div>

---

# ⚙️ **How it Works**

```mermaid
graph LR
    A[User Request] -->|Province & Query| B(React Frontend)
    B -->|POST /ask| C{FastAPI Backend}
    C -->|Vector Search| D[(ChromaDB)]
    D -->|Retrieved Chunks| E[RAG Pipeline]
    E -->|Context + Prompt| F[Groq API LLM]
    F -->|Generated JSON| G[Verification Logic]
    G -->|Final Payload| B
```

---

# 🚀 **Installation & Setup**

### Requirements
- Node.js (v16+)
- Python 3.9+
- Groq API Key

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
CHROMA_DB_PATH=./data/chroma_db
```

Run the FastAPI server:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

*(Note: Ensure you have run `python ingest_laws.py` to process PDFs into ChromaDB if you are starting with a fresh database).*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The application will now be available at `http://localhost:5173`.

---

# 📡 **API Documentation**

### 1. Ask a Legal Question
**`POST /api/legal/ask`**

Retrieves legal context from the vector database and generates a verified answer.

**Request Body:**
```json
{
  "question": "What is the punishment for dishonestly receiving stolen property?",
  "province": "Federal"
}
```

**Success Response (200 OK):**
```json
{
  "question": "What is the punishment for dishonestly receiving stolen property?",
  "province": "Federal",
  "searchId": "PLH-0000-01",
  "answer": "Whoever dishonestly receives or retains any stolen property...",
  "keyPoints": [
    "Requires dishonest receipt or retention.",
    "Requires knowledge that it is stolen."
  ],
  "lawName": "Pakistan Penal Code",
  "year": "1860",
  "sectionNumber": "411",
  "originalLegalText": "...[Raw context from ChromaDB]...",
  "verificationStatus": "Verified",
  "sourceInformation": {
    "officialSource": "Pakistan Penal Code",
    "publisher": "federal",
    "reference": "federal.pdf"
  }
}
```

### 2. Health Check
**`GET /api/legal/health`** (or `/health`)

**Success Response (200 OK):**
```json
{
  "backend": "ok",
  "chromadb": "ok",
  "message": ""
}
```

---

# 👨‍💻 **About the Author**

<div align="center">
  <img src="https://github.com/sohail-ahmed-26.png" width="120" style="border-radius: 50%; border: 3px solid #1D4ED8; margin-bottom: 10px;" alt="Sohail Ahmed" />
  
  ### Sohail Ahmed
  **AI Engineer | Data Scientist**
  
  Building intelligent AI systems that solve real-world problems through data, automation, and innovation. Specialized in Machine Learning, Generative AI (LLMs/RAG), and intelligent automation.
  
  <br>

  [![Portfolio](https://img.shields.io/badge/Portfolio-sohail.devsil.com-0B1327?style=for-the-badge&logo=vercel)](https://sohail.devsil.com)
  [![GitHub](https://img.shields.io/badge/GitHub-sohail--ahmed--26-181717?style=for-the-badge&logo=github)](https://github.com/sohail-ahmed-26)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Sohail_Ahmed-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sohail-ahmed-devsil)
</div>

<br>

<div align="center">
  <i>Empowering legal research through accessible and transparent Artificial Intelligence.</i>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=wave&color=1D4ED8&height=120&section=footer" alt="Bottom Wave" />
</div>

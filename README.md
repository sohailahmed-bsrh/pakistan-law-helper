# Pakistan Legal Code Information Retrieval System

## Description
Information retrieval and legal question-answering system configured with foundational statutes of Pakistan to assist researchers and citizens in navigating statutory provisions.

## Live Demo
Access the live demonstration and portfolio showcase at: [https://sohail.devsil.com/projects.html](https://sohail.devsil.com/projects.html)

## Tech Stack
- Python 3.10+
- LangChain
- Streamlit / FastAPI
- ChromaDB / Vector Search
- Python-dotenv

## Getting Started

### Prerequisites
- Python 3.10 or higher
- Git version control

### Installation and Setup
1. Clone the repository:
```bash
git clone https://github.com/sohailahmed-bsrh/pakistan-law-helper.git
cd pakistan-law-helper
```

2. Configure environment and dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
streamlit run app.py
```

## Environment Variables
Configure the following environment variables in a `.env` file at the root directory:
```env
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
```

## Architecture and Project Structure
The repository is structured according to modular engineering standards:

```text
pakistan-law-helper/
|-- src/
|-- backend/
|-- .gitignore
|-- README.md
`-- requirements.txt
```

## Interface and Verification
The system produces verifiable execution logs and interactive interfaces. Validate operation by running the test suite or local entrypoint.

## Author
Developed by Sohail Ahmed ([Portfolio](https://sohail.devsil.com) | [GitHub](https://github.com/sohailahmed-bsrh)).

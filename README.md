# PDF RAG Chat

A modern web application that lets you upload PDF documents and chat with them using AI-powered Retrieval-Augmented Generation (RAG). Ask questions about your PDFs and get accurate, context-aware answers instantly.

---

## Features

- **PDF Upload:** Easily upload research papers, contracts, manuals, or any PDF document.
- **AI Chat:** Ask natural questions about your documents and get answers powered by Gemini AI.
- **Contextual Responses:** Answers are strictly based on the content of your uploaded PDFs.
- **Authentication:** Secure sign-in/sign-up using Clerk.
- **Scalable Processing:** PDF processing is handled asynchronously via a job queue.
- **Modern UI:** Built with Next.js, React, and Tailwind CSS for a clean, responsive experience.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Clerk (authentication)
- **Backend:** Express.js, BullMQ (queue), LangChain, Gemini AI, Qdrant (vector DB), Valkey (Redis-compatible)
- **PDF Processing:** LangChain PDF loader and text splitter
- **AI Embeddings & Chat:** Google Gemini API

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker (for Qdrant & Valkey)
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Its-bhanu/RAG-BASED-QNA.git

```

### 2. Start Vector DB & Queue

```bash
docker-compose up -d
```

This will start Qdrant (vector database) and Valkey (Redis-compatible queue).

### 3. Backend Setup

```bash
cd server
npm install
# Add your API keys to .env
npm run dev:worker   # Start the PDF processing worker
node index.js    # Start the Express server
```

### 4. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 5. Usage

- Sign up or sign in using Clerk.
- Upload a PDF document.
- Ask questions about your document in the chat interface.
- Get instant, context-aware answers!

---

## Environment Variables

Create a `.env` file in the `server` directory:

```
GOOGLE_API_KEY=your_google_gemini_api_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Folder Structure

```
client/
  app/
    components/
      chat.tsx         # Chat UI
      file-upload.tsx  # PDF upload UI
    layout.tsx         # App layout with Clerk
    page.tsx           # Main landing page
  components/
    ui/
      button.tsx
      input.tsx
  lib/
    utils.ts
  public/
    ...svg assets
  middleware.ts        # Clerk authentication middleware
  globals.css          # Tailwind styles

server/
  index.js             # Express API server
  worker.js            # BullMQ PDF processing worker
  .env                 # API keys
  uploads/             # Uploaded PDF files

docker-compose.yml     # Qdrant & Valkey services
```

---

## License

MIT

---

## Credits

- [LangChain](https://js.langchain.com/)
- [Qdrant](https://qdrant.tech/)
- [Google Gemini](https://ai.google.dev/)
-


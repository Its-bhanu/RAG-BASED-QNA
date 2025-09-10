import express from "express";
import cors from "cors";
import { log } from "console";
import multer from "multer";
import path from "path";
import { Queue } from "bullmq";
import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

dotenv.config();
const app = express();
app.use(cors());

// Redis Queue
const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

// File storage in "uploads" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads/")); // ensure uploads directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

/**
 * Upload PDF → enqueue to worker
 */
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Send absolute path to the queue
    await queue.add("file-ready", {
      filename: req.file.originalname,
      path: path.resolve(req.file.path),
    });

    return res.json({ message: "uploaded", file: req.file });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Chat endpoint → query Qdrant + Gemini
 */
app.get("/chat", async (req, res) => {
  const userQuery = req.query.message;

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: "http://localhost:6333",
    collectionName: "langchainjs-test",
  });

  const retriever = vectorStore.asRetriever({ k: 2 });
  const result = await retriever.invoke(userQuery);

  const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer the user query based only on the following PDF content.
If the answer is not in the PDF, respond with:
"bhai me nhi janta, me bss PDF se hi related questions ke answer de skta hu"

Context:
${JSON.stringify(result)}
`;

  const chat = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash",
    maxOutputTokens: 300, // control answer length
  });

  const response = await chat.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userQuery },
  ]);

  return res.json({
    content: response.content,
    // docs: result,
  });
});

app.listen(8000, () => {
  log(`🚀 Server running on port 8000`);
});

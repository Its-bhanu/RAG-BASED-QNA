import { Worker } from "bullmq";
import { log } from "console";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

dotenv.config();

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const data = job.data;
    console.log("📂 Processing job:", data);

    // Ensure file exists
    if (!fs.existsSync(data.path)) {
      console.error("❌ File not found:", data.path);
      return;
    }

    // Load PDF
    const loader = new PDFLoader(path.resolve(data.path));
    const docs = await loader.load();
    console.log(`✅ Loaded ${docs.length} pages from PDF`);

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`✂️ Split into ${splitDocs.length} chunks`);

    // Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });

    let vectorStore;
    try {
      // Try using existing collection
      vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-test",
      });
      console.log("📡 Using existing Qdrant collection");
    } catch (e) {
      console.log("⚠️ Collection not found, creating new one...");
      vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-test",
      });
      console.log("✅ Created new Qdrant collection and added docs");
      return;
    }

    // Add chunks into Qdrant
    await vectorStore.addDocuments(splitDocs);
    console.log(`✅ All chunks added to vector store`);
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

console.log("🚀 Worker started and listening for jobs...");

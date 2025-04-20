import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { vectorStore } from "./langchain-utils.js";
import * as constants from "./constants.js";
import "dotenv/config";

const worker = new Worker(
  constants.QUEUE_NAME,
  async (job) => {
    const data = JSON.parse(job.data);

    /**
     * Path: data.path
     * Read the pdf from the Path
     * Divide the pdf into chunks,
     * Use OpenAI embedding model to create vector embeddings of each chunk
     * Store the vector embeddings in Qdrant DB(Vector DB)
     */

    // Load the PDF
    const loader = new PDFLoader(data.path);

    // Create the document from the loaded PDF
    const docs = await loader.load();

    // Add the docs to the vector store
    await vectorStore.addDocuments(docs);
    console.log("## All docs are added to vector store");
  },
  {
    concurrency: 50,
    connection: {
      host: "localhost",
      port: "6379",
    },
  }
);

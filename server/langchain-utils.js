import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "openai";
import "dotenv/config";

export const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});

export const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    url: process.env.QDRANT_URL,
    collectionName: "pdf-docs",
  }
);

export const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (systemPrompt, userQuery) => {
  const response = await openAIClient.responses.create({
    model: "gpt-4o",
    instructions: systemPrompt,
    input: userQuery,
  });

  return response.output_text;
};

import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import * as constants from "./constants.js";
import "dotenv/config";
import { getOpenAIResponse, vectorStore } from "./langchain-utils.js";
import { getSystemPrompt } from "./utils.js";

const queue = new Queue(constants.QUEUE_NAME, {
  connection: {
    host: "localhost",
    port: "6379",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "All good!" });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  // Add the file to the queue.
  // Job name is "file-ready"
  await queue.add(
    constants.JOB_FILE_READY,
    JSON.stringify({
      filename: req.file.originalname,
      source: req.file.destination,
      path: req.file.path,
    })
  );
  return res.json({ message: "file uploaded successfully!" });
});

app.post("/chat", async (req, res) => {
  // Retrieve the user query from the request
  const { userQuery } = req.body;

  console.log("##userQuery", userQuery);

  //   Create the vector store retriever
  const retriever = vectorStore.asRetriever({
    k: 4,
  });

  // Retrieve the langchain docs from the vector store
  const docs = await retriever.invoke(userQuery);

  // Create a list to store the filtered document data for the system prompt
  const docList = [];

  for (let doc of docs) {
    const metadata = doc.metadata;
    const pageContent = doc.pageContent;
    const pageNumber = metadata.loc.pageNumber;
    const dict = { page_number: pageNumber, page_content: pageContent };
    docList.push(dict);
  }

  // Create the system prompt based on the retrieved vector store data based on the user query
  const SYSTEM_PROMPT = getSystemPrompt(JSON.stringify(docList));

  const openAIResponse = await getOpenAIResponse(SYSTEM_PROMPT, userQuery);
  const openAIResponseJSON = JSON.parse(openAIResponse);

  return res.json({
    result: openAIResponseJSON.result,
    content: openAIResponseJSON.content,
    pages: openAIResponseJSON?.pages || [],
    userQuery,
  });

//   return res.json({
//     result: "",
//     content: "",
//     pages: [],
//     userQuery,
//   });

});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

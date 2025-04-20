"use client";

type LLMResponse = {
  result: "success" | "fail";
  content: string;
  pages: string[];
  userQuery: string;
};

import { ChangeEvent, useRef, useState } from "react";

function ChatComponent() {
  const [userQuery, setUserQuery] = useState("");
  const [llmResponse, setLLMResponse] = useState<LLMResponse>({
    result: "fail",
    content: "",
    pages: [],
    userQuery: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeHadler = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    console.log("##query", query);
    setUserQuery(query);
  };

  const onResetHandler = () => {
    setUserQuery("");

    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmitHandler = async () => {
    console.log("##submit", userQuery);
    const llmResponse = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuery }),
    });

    const data = (await llmResponse.json()) as LLMResponse;

    setLLMResponse(data);

    console.log("##data", data);
  };

  return (
    <div className="chat-container flex flex-col">
      <div className="chat-response-container h-[55vh] max-w-[85%]">
        <div className="user-query mb-2 font-bold">{llmResponse.userQuery}</div>
        <div className="llm-response">{llmResponse.content}</div>
      </div>
      <div className="chat-query-container flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your query"
          ref={inputRef}
          onChange={onChangeHadler}
          className="h-[100px] border-white border-2 rounded-2xl p-2.5 w-[500px]"
        />
        <div className="btn-container flex gap-2 justify-end">
          <button
            onClick={() => onResetHandler()}
            disabled={!Boolean(userQuery)}
            className="border-amber-50 border-2 w-[150px] rounded-2xl p-2 cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onSubmitHandler}
            disabled={!Boolean(userQuery)}
            className="border-amber-50 border-2 w-[150px] rounded-2xl p-2 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;

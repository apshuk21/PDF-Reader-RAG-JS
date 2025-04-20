"use client";

import { Upload } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";

function FileUploadComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChangeHadler = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files || [];
      if (files.length) {
        const fileList = Array.from(files);
        const file = fileList[0];

        const formData = new FormData();
        formData.append("pdf", file);

        await fetch("http://localhost:8000/upload/pdf", {
          method: "POST",
          body: formData,
        });

        console.log("##file uploaded");
      }
      console.log("##file upload event fired", files);
    },
    []
  );

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 border-white rounded-xl w-full">
      <div
        role="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex justify-center items-center flex-col cursor-pointer"
      >
        <h3>Upload PDF file</h3>
        <Upload />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="application/pdf"
        onChange={onChangeHadler}
      />
    </div>
  );
}

export default FileUploadComponent;

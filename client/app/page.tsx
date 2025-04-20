import ChatComponent from "./components/chat";
import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-screen flex">
        <div className="w-[30vw] flex justify-center items-center">
          <FileUploadComponent />
        </div>
        <div className="w-[70vw] flex flex-col justify-center items-center border-l-0">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}

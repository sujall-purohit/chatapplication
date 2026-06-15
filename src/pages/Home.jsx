import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Details from "../components/Details";
import useChatStore from "../lib/chatStore";

const Home = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { chatId } = useChatStore();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 lg:p-4">
      <div className="w-full lg:w-[95%] xl:w-[90%] h-screen lg:h-[92vh] mx-auto flex overflow-hidden lg:rounded-2xl border border-white/20 shadow-2xl">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Chat — show placeholder if no chat selected */}
        {chatId ? (
          <Chat setShowDetails={setShowDetails} showDetails={showDetails} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md gap-4">
            <div className="w-20 h-20 rounded-full bg-[#0F766E]/20 flex items-center justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937]">Welcome to ChatApp</h2>
            <p className="text-sm text-[#6B7280]">Select a conversation to start chatting</p>
          </div>
        )}

        {/* Details panel */}
        {chatId && showDetails && <Details />}
      </div>
    </div>
  );
};

export default Home;
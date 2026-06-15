import Top from "./chat/Top";
import Middle from "./chat/Middle";
import Bottom from "./chat/Bottom";

const Chat = ({ setShowDetails, showDetails }) => {
  return (
    <div className="flex-1 flex flex-col bg-white/20 backdrop-blur-md min-w-0">
      <Top setShowDetails={setShowDetails} showDetails={showDetails} />
      <Middle />
      <Bottom />
    </div>
  );
};

export default Chat;
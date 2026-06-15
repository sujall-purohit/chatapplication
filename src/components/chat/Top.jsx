import { Phone, Video, Info, X } from "lucide-react";
import useChatStore from "../../lib/chatStore";
import Avatar from "../../assets/Image/avatar.png";

const Top = ({ setShowDetails, showDetails }) => {
  const { user } = useChatStore();

  return (
    <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/20 bg-white/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            className="h-10 w-10 rounded-full object-cover border-2 border-white/50"
            src={user?.avatar || Avatar}
            alt=""
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <span className="text-[#1F2937] font-bold text-sm">
            {user?.username || "Select a chat"}
          </span>
          <p className="text-[#6B7280] text-xs">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl bg-[#0F766E]/20 hover:bg-[#0F766E]/30 transition">
          <Phone color="#0F766E" size={18} />
        </button>
        <button className="p-2 rounded-xl bg-[#0F766E]/20 hover:bg-[#0F766E]/30 transition">
          <Video color="#0F766E" size={18} />
        </button>
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className={`p-2 rounded-xl transition ${
            showDetails
              ? "bg-[#0F766E] text-white"
              : "bg-[#0F766E]/20 hover:bg-[#0F766E]/30"
          }`}
        >
          {showDetails ? <X color="white" size={18} /> : <Info color="#0F766E" size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Top;
import useChatStore from "../../lib/chatStore";
import Avatar from "../../assets/Image/avatar.png";

const User = () => {
  const { user } = useChatStore();

  if (!user) return null;

  return (
    <div className="shrink-0 flex flex-col items-center py-6 px-4 border-b border-white/20 bg-white/10">
      <div className="relative mb-3">
        <img
          src={user?.avatar || Avatar}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <span className="text-lg font-bold text-[#1F2937]">{user?.username}</span>
      <p className="text-xs text-[#6B7280] mt-0.5">{user?.email}</p>
      <div className="flex gap-2 mt-3">
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">Online</span>
        <span className="px-3 py-1 text-xs rounded-full bg-white/50 text-[#6B7280] font-medium">Friend</span>
      </div>
    </div>
  );
};

export default User;
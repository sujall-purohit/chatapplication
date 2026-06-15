import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import useUserStore from "../../lib/userStore";
import useChatStore from "../../lib/chatStore";
import Avatar from "../../assets/Image/avatar.png";

const Chats = ({ searchQuery }) => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (snapshot) => {
        const data = snapshot.data();
        if (!data?.chats) return;

        const promises = data.chats.map(async (chat) => {
          const userDocSnap = await getDoc(doc(db, "users", chat.receiverId));
          return { ...chat, user: userDocSnap.data() };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unsub();
  }, [currentUser]);

  // ✅ filter chats by search query
  const filteredChats = chats.filter((chat) =>
    chat.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto pb-4 mt-1">
      {filteredChats.length === 0 && searchQuery && (
        <p className="text-center text-sm text-[#6B7280] mt-6">No chats found</p>
      )}
      {filteredChats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => changeChat(chat.chatId, chat.user, currentUser)}
          className="flex gap-4 items-center px-3 py-3 cursor-pointer hover:bg-white/20 rounded-xl mx-2 transition"
        >
          <img
            className="h-10 w-10 rounded-full object-cover shrink-0"
            src={chat.user?.avatar || Avatar}
          />
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#1F2937] truncate">
              {chat.user?.username}
            </h2>
            <p className="text-xs text-[#6B7280] truncate">
              {chat.lastMessage || "No messages yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
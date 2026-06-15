import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/userStore";
import Avatar from "../../assets/Image/avatar.png";

const Middle = () => {
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
      if (snapshot.exists()) {
        setMessages(snapshot.data().messages || []);
      }
    });

    return () => unsub();
  }, [chatId]);

  return (
    <div className="py-4 px-3 sm:px-6 flex-1 overflow-y-auto flex flex-col gap-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex w-full gap-3 items-end ${
            msg.senderId === currentUser?.id ? "justify-end" : ""
          }`}
        >
          {msg.senderId !== currentUser?.id && (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user?.avatar || Avatar}
            />
          )}
          <div
            className={`max-w-[80%] md:max-w-[70%] ${
              msg.senderId === currentUser?.id ? "flex flex-col items-end" : ""
            }`}
          >
            {msg.img && (
              <img
                src={msg.img}
                className="w-full h-40 sm:h-48 object-cover rounded-2xl mb-1"
              />
            )}
            {msg.text && (
              <p
                className={`px-5 py-2 rounded-2xl text-[#1F2937] shadow-[1px_1px_1px_black] ${
                  msg.senderId === currentUser?.id
                    ? "bg-[#525252]/30"
                    : "bg-[#FDFBF7]/50"
                }`}
              >
                {msg.text}
              </p>
            )}
            <span className="text-xs p-1 text-[#6B7280]">
              {msg.createdAt?.toDate
                ? new Date(msg.createdAt.toDate()).toLocaleTimeString()
                : "Just now"}
            </span>
          </div>
        </div>
      ))}
      <div ref={endRef}></div>
    </div>
  );
};

export default Middle;
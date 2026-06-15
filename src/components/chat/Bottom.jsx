import { useState } from "react";
import { Smile, Send, Image, Camera, Mic } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/userStore";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { toast } from "react-toastify";

const Bottom = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const handleEmoji = (e) => setText((prev) => prev + e.emoji);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !img.file) return;
    if (!chatId) return toast.error("Select a chat first!");

    let imgUrl = "";
    try {
      if (img.file) {
        imgUrl = await uploadToCloudinary(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: text.trim(),
          img: imgUrl,
          createdAt: new Date(),
        }),
      });

      const userIds = [currentUser.id, user.id];
      for (const id of userIds) {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnap = await getDoc(userChatsRef);
        const userChatsData = userChatsSnap.data();
        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );
        userChatsData.chats[chatIndex].lastMessage = text.trim() || "📷 Image";
        userChatsData.chats[chatIndex].updatedAt = Date.now();
        await updateDoc(userChatsRef, { chats: userChatsData.chats });
      }

      setText("");
      setImg({ file: null, url: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ show blocked message instead of input
  if (isCurrentUserBlocked || isReceiverBlocked) {
    return (
      <div className="py-5 px-6 text-center text-sm font-medium text-red-400 bg-white/10 shrink-0">
        {isCurrentUserBlocked
          ? "You are blocked by this user."
          : "You blocked this user. Unblock to send messages."}
      </div>
    );
  }

  return (
    <>
      {img.url && (
        <div className="px-3 pb-2">
          <div className="relative inline-block">
            <img src={img.url} className="h-20 w-20 object-cover rounded-xl" />
            <button
              onClick={() => setImg({ file: null, url: "" })}
              className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-5 h-5 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 py-3 px-3 sm:px-6 shrink-0">
        <div className="flex gap-2 shrink-0">
          <label htmlFor="imgInput">
            <Image color="#0F766E" size={32} className="sm:size-10 bg-[#0F766E]/30 p-2 rounded-2xl cursor-pointer" />
          </label>
          <input type="file" id="imgInput" className="hidden" onChange={handleImg} accept="image/*" />
          <Camera color="#0F766E" size={32} className="sm:size-10 bg-[#0F766E]/30 p-2 rounded-2xl cursor-pointer" />
          <Mic color="#0F766E" size={32} className="sm:size-10 bg-[#0F766E]/30 p-2 rounded-2xl cursor-pointer" />
        </div>

        <div className="flex-1 bg-[#0F766E]/30 rounded-xl px-3">
          <input
            className="w-full bg-transparent py-2 sm:py-3 outline-none text-[#1F2937] placeholder:text-[#6B7280]/60"
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <Smile
            color="#0F766E"
            size={32}
            className="sm:size-10 bg-[#0F766E]/30 p-2 rounded-2xl cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
          <button onClick={handleSend}>
            <Send color="#0F766E" size={32} className="sm:size-10 bg-[#0F766E]/30 p-2 rounded-2xl cursor-pointer" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-50">
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        </div>
      )}
    </>
  );
};

export default Bottom;
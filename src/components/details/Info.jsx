import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ArrowDownToLine, LogOut, ShieldOff, Shield } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import useUserStore from "../../lib/userStore";
import useChatStore from "../../lib/chatStore";
import { toast } from "react-toastify";

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-white/30">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center px-4 py-3 bg-white/30 hover:bg-white/40 transition text-sm font-medium text-[#1F2937]"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="px-4 py-3 bg-white/20 text-sm text-[#6B7280]">
          {children}
        </div>
      )}
    </div>
  );
};

const Info = () => {
  const { currentUser } = useUserStore();
  const { user, chatId, isReceiverBlocked, changeBlock } = useChatStore();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    const unsub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
      if (!snapshot.exists()) return;
      const msgs = snapshot.data().messages || [];
      setImages(msgs.filter((m) => m.img).map((m) => m.img).reverse());
    });
    return () => unsub();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
      toast.success(isReceiverBlocked ? "User unblocked" : "User blocked");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">

      <Section title="Chat Settings">
        <p>Mute notifications, change wallpaper, clear chat history.</p>
      </Section>

      <Section title="Privacy & Help">
        <p>Report user, manage privacy settings, get help.</p>
      </Section>

      <Section title={`Shared Images (${images.length})`}>
        {images.length === 0 ? (
          <p>No shared images yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-1">
            {images.map((img, i) => (
              <a key={i} href={img} download target="_blank" rel="noreferrer" className="relative group">
                <img src={img} className="w-full h-16 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                  <ArrowDownToLine size={14} color="white" />
                </div>
              </a>
            ))}
          </div>
        )}
      </Section>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        {/* ✅ only show block button if a user is selected */}
        {user && (
          <button
            onClick={handleBlock}
            className={`w-full h-10 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition ${
              isReceiverBlocked
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-red-400 hover:bg-red-500"
            }`}
          >
            {isReceiverBlocked ? <ShieldOff size={15} /> : <Shield size={15} />}
            {isReceiverBlocked ? "Unblock User" : "Block User"}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/80 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Info;
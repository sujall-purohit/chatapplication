import { useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection, query, where, getDocs,
  doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc,
} from "firebase/firestore";
import useUserStore from "../../lib/userStore";
import { toast } from "react-toastify";
import Avatar from "../../assets/Image/avatar.png";
import { X } from "lucide-react";

const AddUser = ({ onClose }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();
    if (!username) return;

    try {
      setLoading(true);
      setSearchResult(null);
      const q = query(collection(db, "users"), where("username", "==", username));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("User not found!");
        return;
      }

      const found = snapshot.docs[0].data();

      if (found.id === currentUser.id) {
        toast.error("You can't add yourself!");
        return;
      }

      const userChatsSnap = await getDoc(doc(db, "userchats", currentUser.id));
      const existingChats = userChatsSnap.data()?.chats || [];
      const alreadyAdded = existingChats.some((c) => c.receiverId === found.id);
      if (alreadyAdded) {
        toast.error("User already in your chats!");
        return;
      }

      setSearchResult(found);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!searchResult) return;
    setAdding(true);
    try {
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(db, "userchats", searchResult.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: searchResult.id,
          updatedAt: Date.now(),
        }),
      });

      toast.success(`${searchResult.username} added!`);
      setSearchResult(null);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    // ✅ w-full keeps it inside sidebar, no mx-3 overflow
    <div className="w-full px-3 pb-3">
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg p-3 rounded-2xl">
        
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-[#1F2937] text-sm">Add new contact</span>
          <X size={16} className="cursor-pointer text-[#6B7280] hover:text-red-400 transition" onClick={onClose} />
        </div>

        <form className="flex gap-2 mb-2" onSubmit={handleSearch}>
          <input
            type="text"
            name="username"
            placeholder="Search username..."
            className="flex-1 min-w-0 bg-white/60 h-9 rounded-xl px-3 outline-none text-sm border border-white/30"
          />
          <button
            disabled={loading}
            className="bg-[#0F766E] text-white px-3 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-[#0F766E]/80 transition shrink-0"
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        {searchResult && (
          <div className="flex items-center justify-between bg-white/40 rounded-xl px-3 py-2 mt-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={searchResult.avatar || Avatar}
                className="h-8 w-8 rounded-full object-cover border-2 border-white shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F2937] truncate">{searchResult.username}</p>
                <p className="text-xs text-[#6B7280] truncate">{searchResult.email}</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-[#0F766E] text-white px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-50 shrink-0 ml-2"
            >
              {adding ? "..." : "Add"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
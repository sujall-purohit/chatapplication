import { useState, useRef } from "react";
import { Ellipsis, Video, UserPen, X, Check } from "lucide-react";
import useUserStore from "../../lib/userStore";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { toast } from "react-toastify";
import Avatar from "../../assets/Image/avatar.png";

const Navbar = () => {
  const { currentUser, updateUser } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState({ file: null, url: "" });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const openEdit = () => {
    setNewUsername(currentUser?.username || "");
    setNewAvatar({ file: null, url: "" });
    setEditMode(true);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setNewAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSave = async () => {
    if (!newUsername.trim()) return toast.error("Username can't be empty!");
    setSaving(true);
    try {
      let avatarURL = currentUser?.avatar || "";
      if (newAvatar.file) {
        avatarURL = await uploadToCloudinary(newAvatar.file);
      }

      await updateDoc(doc(db, "users", currentUser.id), {
        username: newUsername.trim(),
        avatar: avatarURL,
      });

      // ✅ update local store instantly — no reload needed
      updateUser({ username: newUsername.trim(), avatar: avatarURL });
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between h-14 px-4 mt-2 mb-2 shrink-0">
        <div className="flex gap-3 items-center">
          <img
            className="h-10 w-10 rounded-full object-cover border border-white/30"
            src={currentUser?.avatar || Avatar}
          />
          <h2 className="text-base font-bold text-[#1F2937]">
            {currentUser?.username || "User"}
          </h2>
        </div>
        <div className="flex gap-3 items-center">
          <Ellipsis size={20} color="#0F766E" className="cursor-pointer" />
          <Video size={20} color="#0F766E" className="cursor-pointer" />
          {/* ✅ Edit button opens modal */}
          <UserPen
            size={20}
            color="#0F766E"
            className="cursor-pointer"
            onClick={openEdit}
          />
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 w-80 shadow-2xl border border-white/30 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[#1F2937] text-lg">Edit Profile</h2>
              <X
                size={20}
                className="cursor-pointer text-[#6B7280]"
                onClick={() => setEditMode(false)}
              />
            </div>

            {/* Avatar preview + upload */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={newAvatar.url || currentUser?.avatar || Avatar}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="text-sm text-[#0F766E] font-medium underline"
              >
                Change Photo
              </button>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Username input */}
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border-b border-[#0F766E] py-2 px-1 bg-transparent outline-none text-[#1F2937]"
              placeholder="Username"
            />

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-11 rounded-xl bg-[#0F766E] text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../assets/Image/avatar.png";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { uploadToCloudinary } from "../lib/cloudinary";

const Register = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      let avatarURL = "";
      if (avatar.file) {
        avatarURL = await uploadToCloudinary(avatar.file);
      }

      // 1. Create the account (Firebase automatically signs in)
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save info to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username, email, avatar: avatarURL, id: res.user.uid, blocked: []
      });
      await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

      // 3. THE CRITICAL STEP: Immediately sign out so App.jsx doesn't jump to Home
      await signOut(auth);

      // 4. Success notification
      toast.success("Account created successfully!");
      
      // Clear the inputs so the form is ready for a new user if needed
      e.target.reset();
      setAvatar({ file: null, url: "" });

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4">
      <div className="w-full max-w-md border border-white/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm bg-white/10">
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <h1 className="text-3xl font-bold text-[#0F766E] text-center">Create Account</h1>
          
          <input className="border-b py-3 px-2 bg-transparent outline-none" type="text" placeholder="Username" name="username" required />
          <input className="border-b py-3 px-2 bg-transparent outline-none" type="email" placeholder="Email" name="email" required />
          <input className="border-b py-3 px-2 bg-transparent outline-none" type="password" placeholder="Password" name="password" required />

          <input className="hidden" type="file" id="file" onChange={(e) => setAvatar({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })} />
          <label className="flex items-center gap-4 cursor-pointer" htmlFor="file">
            <img src={avatar.url || Avatar} className="h-12 w-12 object-cover rounded-full border border-white/20" alt="avatar" />
            <span className="text-sm">Upload Profile Image</span>
          </label>

          <button className="w-full h-12 rounded-xl text-white bg-[#0F766E] font-bold disabled:bg-gray-400" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <p className="text-sm text-center">
            Already have an account? <Link to="/login" className="text-[#0F766E] font-bold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
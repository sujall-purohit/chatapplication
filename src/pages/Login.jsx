import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4">
      <div className="w-full max-w-md border border-white/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl bg-white/10">
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <h1 className="text-4xl font-bold text-[#0F766E] text-center">Login</h1>
          <input className="border-b py-3 px-2 bg-transparent outline-none" type="email" placeholder="Email" name="email" required />
          <input className="border-b py-3 px-2 bg-transparent outline-none" type="password" placeholder="Password" name="password" required />
          <button className="w-full h-12 rounded-xl text-white bg-[#0F766E] font-bold disabled:bg-gray-400" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-sm text-center">
            Need an account? <Link to="/register" className="text-[#0F766E] font-bold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
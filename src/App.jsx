import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import useUserStore from "./lib/userStore";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notification from "./components/notification/Notification";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => unsub();
  }, [fetchUserInfo]);

  
  if (isLoading) return null;

  return (
    <div>
      <Notification />

      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!currentUser ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
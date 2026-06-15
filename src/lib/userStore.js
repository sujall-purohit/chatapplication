import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      set({
        currentUser: docSnap.exists() ? docSnap.data() : null,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
      set({ currentUser: null, isLoading: false });
    }
  },

  // ✅ update local state after edit — no need to refetch
  updateUser: (data) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...data },
    })),
}));

export default useUserStore;
import { create } from "zustand";

const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user, currentUser) => {
    const isReceiverBlocked = currentUser?.blocked?.includes(user?.id) || false;
    const isCurrentUserBlocked = user?.blocked?.includes(currentUser?.id) || false;
    set({ chatId, user, isCurrentUserBlocked, isReceiverBlocked });
  },

  changeBlock: () =>
    set((state) => ({ isReceiverBlocked: !state.isReceiverBlocked })),

  toggleDetails: () =>
    set((state) => ({ isDetailOpen: !state.isDetailOpen })),
}));

export default useChatStore;
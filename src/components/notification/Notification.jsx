import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}          // Closes a bit faster (3s instead of 5s)
      hideProgressBar={true}    // Hides the chunky progress bar for a cleaner look
      newestOnTop={true}        // New messages pop up on top
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      // This injects Tailwind directly into the toast cards to match your app's theme!
      toastClassName="!bg-white/60 !backdrop-blur-xl !text-[#1F2937] !font-medium !rounded-2xl !shadow-[0_8px_30px_rgb(0,0,0,0.12)] !border !border-white/40"
    />
  );
};

export default Notification;
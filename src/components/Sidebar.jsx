import { useState } from "react";
import Navbar from "./sidebar/Navbar";
import Search from "./sidebar/Search";
import Chats from "./sidebar/Chats";
import AddUser from "./addUser/AddUser";

const Sidebar = () => {
  const [addMode, setAddMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-72 shrink-0 border-r border-white/20 flex flex-col bg-white/30 backdrop-blur-lg overflow-hidden">
      
      {/* Fixed top section */}
      <Navbar />
      <Search
        addMode={addMode}
        setAddMode={setAddMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ✅ Scrollable middle — AddUser + Chats scroll together */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        {addMode && <AddUser onClose={() => setAddMode(false)} />}
        <Chats searchQuery={searchQuery} />
      </div>

    </div>
  );
};

export default Sidebar;
import { UserSearch, Plus, Minus } from "lucide-react";

const Search = ({ addMode, setAddMode, searchQuery, setSearchQuery }) => {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 bg-[#0F766E]/30 rounded-xl px-3">
          <UserSearch size={18} color="#0F766E" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent py-2 outline-none px-2 text-sm"
          />
        </div>
        <button
          onClick={() => setAddMode(!addMode)}
          className="bg-[#0F766E]/30 p-2 rounded-xl hover:bg-[#0F766E]/50 transition"
        >
          {addMode ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Search;
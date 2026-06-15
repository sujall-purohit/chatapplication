import User from "./details/User";
import Info from "./details/Info";

const Details = () => {
  return (
    <div className="w-72 shrink-0 flex flex-col bg-white/40 backdrop-blur-lg border-l border-white/20 overflow-hidden">
      <User />
      <Info />
    </div>
  );
};

export default Details;
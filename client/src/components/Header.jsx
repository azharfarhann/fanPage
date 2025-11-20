import React from "react";

const Header = () => {
  return (
    <header className="header-glass w-full py-3 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-yellow-400 via-red-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
            VK
          </div>
          <div className="text-white text-lg font-semibold">Virat Kohli Fan Page</div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm px-3 py-1 rounded-full bg-white/90 text-slate-700 hover:opacity-95">Follow</button>
          <button className="text-sm px-3 py-1 rounded-full border border-white/10 text-white hover:bg-white/5">Share</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

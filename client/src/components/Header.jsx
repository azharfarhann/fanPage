import React from "react";

const Header = () => {
  return (
    <header className="header-strip sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-semibold text-white">
            Virat Kohli
          </div>
          <div className="text-sm text-slate-300 mt-1">The Run Machine</div>
          <div className="h-1 w-28 bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full mt-3 mx-auto opacity-90" />
        </div>
      </div>
    </header>
  );
};

export default Header;

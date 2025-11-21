import React from "react";

const Fact = ({ text }) => {
  if (!text) return null;

  return (
    <div className="fact-hover glass-dark h-38 rounded-lg p-4 flex items-start gap-3 shadow-md animate-fade">

      <div className="w-2 h-12 bg-linear-to-b from-cyan-400 to-blue-600 rounded-sm" />

      <div>
        <div className="text-xs text-gray-300">Fact of the day</div>
        <div className="text-sm text-white mt-1">{text}</div>
      </div>

    </div>
  );
};

export default Fact;

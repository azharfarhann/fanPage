import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="card-hover bg-black/70 backdrop-blur-md border border-white/10 text-white p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
      <p className="text-xs tracking-wide text-gray-300">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;

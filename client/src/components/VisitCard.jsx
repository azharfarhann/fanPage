import React from "react";

const VisitCard = ({ visits }) => {
  return (
<div className="card-hover bg-gray-600/60 backdrop-blur-sm p-5 rounded-xl shadow-md text-center animate-fade">
      <p className="text-xs uppercase tracking-wider text-slate-300">Profile visits</p>
      <div className="text-3xl font-bold mt-2 text-white">{visits ?? 0}</div>
    </div>
  );
};

export default VisitCard;

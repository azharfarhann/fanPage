import React from "react";

const VisitCard = ({ visits }) => {
  return (
    <div className="glass-card visit-gradient p-4 rounded-lg">
      <p className="text-xs uppercase tracking-wider">Profile visits</p>
      <div className="text-3xl font-bold mt-2">{visits ?? 0}</div>
    </div>
  );
};

export default VisitCard;

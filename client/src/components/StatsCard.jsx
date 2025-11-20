import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="glass-card">
      <p className="stat-title">{title}</p>
      <div className="stat-value mt-2">{value ?? "-"}</div>
    </div>
  );
};

export default StatsCard;

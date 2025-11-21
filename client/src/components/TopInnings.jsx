import React from "react";

const TopInnings = ({ innings }) => {
  return (
    <div className="mt-10 animate-fade">
      <h2 className="text-2xl font-bold text-gray-400 text-center mb-4">
        Top Innings Highlights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {innings.map((inn, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow card-hover border border-blue-200"
          >
            <h3 className="font-bold text-gray-800">{inn.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{inn.match}</p>
            <p className="text-sm font-semibold text-blue-600 mt-2">
              Runs: {inn.runs}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopInnings;

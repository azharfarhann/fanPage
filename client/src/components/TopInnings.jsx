import React from "react";

const TopInnings = ({ innings }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Top Innings</h2>
      <ul className="space-y-3">
        {innings.map((inn, i) => (
          <li key={i} className="p-3 border rounded-md">
            <p className="font-bold">{inn.title}</p>
            <p className="text-sm text-gray-600">{inn.match}</p>
            <p className="text-blue-600 font-medium">{inn.runs} runs</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopInnings;

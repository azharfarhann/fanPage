import React from "react";

const Facts = ({ facts }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
      <ul className="list-disc ml-6 space-y-2">
        {facts.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
};

export default Facts;

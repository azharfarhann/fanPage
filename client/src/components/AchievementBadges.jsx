import React from "react";

const AchievementBadges = ({ badges }) => {
  return (
    <div className="mt-10 px-4 animate-fade text-center">
      <h2 className="text-2xl font-bold text-gray-200 mb-3">
        Major Career Achievements
      </h2>

      <div className="flex flex-wrap justify-center gap-3">
        {badges.map((item, index) => (
          <span
            key={index}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow card-hover text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;

import React, { useEffect, useState } from "react";
import VisitCard from "../components/VisitCard";
import StatsCard from "../components/StatsCard";
import Fact from "../components/Facts";
import ChartYear from "../components/ChartYear";
import Description from "../components/Description";
import Footer from "../components/Footer";
import TopInnings from "../components/TopInnings";
import AchievementBadges from "../components/AchievementBadges";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/kohli/stats");
        const json = await res.json();
        console.log("API:", json);
        setData(json);
      } catch (err) {
        console.log("Fetch error:", err);
        setData(null);
      }
    };
    getData();
  }, []);

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="loader" />
        <p className="text-slate-200 mt-4">Loading Kohli stats…</p>
      </div>
    );
  }

  const { stats, visits } = data;
  const fact = stats?.facts?.length ? stats.facts[0] : "";

  return (
    <div className="main-content max-w-5xl mx-auto px-4 py-8 space-y-10">

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <VisitCard visits={visits} />

        <div className="md:col-span-3 card-hover rounded-xl p-4 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 backdrop-blur-sm">
          <StatsCard title="ODI Runs" value={stats.odi.runs} />
          <StatsCard title="T20 Runs" value={stats.t20.runs} />
          <StatsCard title="ODI 100s" value={stats.odi.centuries} />
        </div>
      </div>

      {/* PERFORMANCE + FACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-dark rounded-lg p-4 space-y-6">
          <h3 className="text-white font-semibold mb-2">Performance by Year</h3>
          <ChartYear yearly={stats.performanceByYear} />
          <TopInnings innings={stats.topInnings} />
          <Description />
        </div>

        <Fact text={fact} />
      </div>

      {/* ACHIEVEMENTS */}
      <AchievementBadges
        badges={[
          "100+ International Centuries",
          "ICC Cricketer of the Decade",
          "Fastest to 8000, 9000, 10000 ODI runs",
          "Most Player of the Match Awards",
        ]}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;

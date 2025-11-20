import React, { useEffect, useState } from "react";
import { getKohliStats } from "../api/KohliAPI.js";
import StatsCard from "../components/StatsCard";
import ChartYear from "../components/ChartYear";
import TopInnings from "../components/TopInnings";
import Facts from "../components/Facts";
import VisitCard from "../components/VisitCard";


const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getKohliStats();
      console.log("API response:", res); 
      setData(res);
    };
    load();
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader mb-3 mx-auto" />
          <p className="text-gray-600">Loading Kohli stats…</p>

          <style>{`
            .loader{
              width:40px;height:40px;border-radius:50%;
              border:4px solid rgba(0,0,0,0.08);
              border-top-color: rgba(99,102,241,0.9);
              animation:spin 1s linear infinite;
              margin:0 auto;
            }
            @keyframes spin{100%{transform:rotate(360deg)}}
          `}</style>
        </div>
      </div>
    );

  const { stats, visits } = data;
  const randomFact = stats?.facts?.length
    ? stats.facts[Math.floor(Math.random() * stats.facts.length)]
    : null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">Virat Kohli : The Run Machine</h1>
        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Stats grid: VisitCard + 3 StatsCard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <VisitCard visits={visits} />
        <StatsCard title="ODI Runs" value={stats.odi?.runs} />
        <StatsCard title="T20 Runs" value={stats.t20?.runs} />
        <StatsCard title="ODI 100s" value={stats.odi?.centuries} />
      </div>

      {/* Fact of the day */}
      {randomFact && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm animate-fade">
          <strong className="mr-2">Fact of the day:</strong>
          <span>{randomFact}</span>
        </div>
      )}

      {/* Chart and lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ChartYear yearly={stats.performanceByYear || []} />
        </div>

        <div className="space-y-6">
          <TopInnings innings={stats.topInnings || []} />
          <Facts facts={stats.facts || []} />
        </div>
      </div>
    </div>
  );
};

export default Home;

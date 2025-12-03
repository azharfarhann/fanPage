// import React, { useState, useEffect } from "react";

// const PollSection = () => {
//   const [poll, setPoll] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch poll
//   useEffect(() => {
//     const fetchPoll = async () => {
//       try {
//         const res = await fetch("/api/kohli/poll");
//         const data = await res.json();
//         setPoll(data.poll);
//       } catch (err) {
//         console.log("Poll fetch error:", err);
//       }
//     };
//     fetchPoll();
//   }, []);

//   // Vote
//   const handleVote = async () => {
//     if (selected === null) return;

//     setLoading(true);

//     try {
//       const res = await fetch(`/api/kohli/poll/${poll._id}/vote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ optionIndex: selected }),
//       });

//       const data = await res.json();
//       setPoll(data);
//     } catch (err) {
//       console.log("Vote error:", err);
//     }

//     setLoading(false);
//   };

//   if (!poll) return null;

//   return (
//     <div className="glass-dark p-4 rounded-lg mt-10 animate-fade">
//       <h2 className="text-xl font-bold text-white mb-3 text-center">
//         Fan Poll
//       </h2>

//       <p className="text-slate-300 mb-4 text-center">{poll.question}</p>

//       {poll.options.map((opt, index) => (
//         <label
//           key={index}
//           className="block bg-white/10 hover:bg-white/20 p-3 rounded-lg mb-3 cursor-pointer"
//         >
//           <input
//             type="radio"
//             name="pollOption"
//             className="mr-2"
//             onChange={() => setSelected(index)}
//           />
//           <span className="text-slate-200">{opt.text}</span>

//           <span className="float-right text-cyan-300 font-semibold">
//             {opt.votes} votes
//           </span>
//         </label>
//       ))}

//       <button
//         onClick={handleVote}
//         disabled={loading}
//         className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//       >
//         {loading ? "Submitting..." : "Submit Vote"}
//       </button>
//     </div>
//   );
// };

// export default PollSection;

// ************************************************************************************************* //

import React, { useEffect, useState } from "react";
import axios from "axios";

const PollSection = () => {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pieHover, setPieHover] = useState(false);
  const [voterId, setVoterId] = useState("");

  // Generate or fetch voterId
  useEffect(() => {
    let id = localStorage.getItem("voterId");

    if (!id) {
      id = crypto.randomUUID(); //  strong unique ID
      localStorage.setItem("voterId", id);
    }
    setVoterId(id);
  }, []);

  // Fetch poll
  useEffect(() => {
    const loadPoll = async () => {
      try {
        // const voterId = localStorage.getItem("voterId");
        const res = await axios.get("/api/kohli/poll", {
          params: { voterId },
        });
        console.log("poll API raw response:", res.data);

        const p = res.data.responsePoll ?? null;
        // const p = res.data.poll || null;
        if (!p) {
          console.log("No poll found");
          // setPoll(null)
          // setHasVoted(false)
          return;
        }
        setPoll(p);

        // If user already voted
        // if (localStorage.getItem(`voted-${p._id}`) === "1") {
        //   setHasVoted(true);
        // }
        if (localStorage.getItem(`voted-${p._id}`) === "1") {
          setHasVoted(true);
        }
      } catch (err) {
        console.log("Poll fetch error:", err);
      }
    };
    if (voterId && voterId.length > 0) loadPoll();
  }, [voterId]);

  // Total votes
  const totalVotes = poll
    ? poll.options.reduce((sum, opt) => sum + opt.votes, 0)
    : 0;

  // Build Pie Chart (simple & readable)
  const getPieStyle = () => {
    if (!poll || totalVotes === 0) return {};

    let start = 0;
    const segments = poll.options.map((opt, index) => {
      const percent = (opt.votes / totalVotes) * 100;
      const color = ["#38bdf8", "#4ade80", "#f472b6", "#facc15"][index];
      const end = start + percent;
      const seg = `${color} ${start}% ${end}%`;
      start = end;
      return seg;
    });

    return {
      background: `conic-gradient(${segments.join(", ")})`,
    };
  };

  // Submit Vote
  const handleVote = async () => {
    if (!poll || selected === null || !voterId) {
      console.log("Missing poll, selected, or voterId");
      return;
    }

    try {
      // const voterId = localStorage.getItem("voterId");

      const res = await axios.post(
        `/api/kohli/poll/${poll._id}/vote`,
        {
          optionIndex: selected,
          voterId: voterId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("vote body:", {
        optionIndex: selected,
        voterId,
      });

      const updated = res.data.updatedPoll;
      setPoll(updated);
      setHasVoted(true);
      // mark locally
      localStorage.setItem(`voted-${poll._id}`, "1");

      alert("Your vote has been recorded.");
    } catch (err) {
      console.log("Vote error:", err);
    }
  };

  if (!poll) return null;

  return (
    <div className="glass-dark p-4 rounded-lg mt-10 animate-fade">
      <h2 className="text-xl font-bold text-white mb-3 text-center">
        Fan Poll
      </h2>

      <p className="text-slate-300 mb-5 text-center">{poll.question}</p>

      {/* Pie chart preview only after voting */}
      {hasVoted && (
        <div
          className="mx-auto mb-6 w-32 h-32 rounded-full shadow-lg cursor-pointer"
          style={getPieStyle()}
          onMouseEnter={() => setPieHover(true)}
          onMouseLeave={() => setPieHover(false)}
        >
          {pieHover && (
            <div className="text-sm text-white bg-black/70 rounded p-2 text-center mt-12">
              {totalVotes} total votes
            </div>
          )}
        </div>
      )}

      {/* Options */}
      {poll.options.map((opt, idx) => (
        <label
          key={idx}
          className="block bg-white/10 hover:bg-white/20 p-3 rounded-lg mb-3 cursor-pointer"
        >
          <input
            type="radio"
            name="pollOption"
            className="mr-2"
            onChange={() => setSelected(idx)}
            checked={selected === idx}
          />
          <span className="text-slate-200">{opt.text}</span>

          {/* show votes only after voting */}
          {hasVoted && (
            <span className="float-right text-cyan-300 font-semibold">
              {opt.votes} votes
            </span>
          )}
        </label>
      ))}

      <button
        onClick={handleVote}
        disabled={hasVoted}
        className={`w-full mt-4 py-2 rounded-lg text-white ${
          hasVoted
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {hasVoted ? "You Already Voted" : "Submit Vote"}
      </button>
    </div>
  );
};

export default PollSection;

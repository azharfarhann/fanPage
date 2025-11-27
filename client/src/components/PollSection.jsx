import React, { useState, useEffect } from "react";

const PollSection = () => {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch("/api/kohli/poll");
        const data = await res.json();
        setPoll(data.poll);
      } catch (err) {
        console.log("Poll fetch error:", err);
      }
    };
    fetchPoll();
  }, []);

  // Vote
  const handleVote = async () => {
    if (selected === null) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/kohli/poll/${poll._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: selected }),
      });

      const data = await res.json();
      setPoll(data);
    } catch (err) {
      console.log("Vote error:", err);
    }

    setLoading(false);
  };

  if (!poll) return null;

  return (
    <div className="glass-dark p-4 rounded-lg mt-10 animate-fade">
      <h2 className="text-xl font-bold text-white mb-3 text-center">
        Fan Poll
      </h2>

      <p className="text-slate-300 mb-4 text-center">{poll.question}</p>

      {poll.options.map((opt, index) => (
        <label
          key={index}
          className="block bg-white/10 hover:bg-white/20 p-3 rounded-lg mb-3 cursor-pointer"
        >
          <input
            type="radio"
            name="pollOption"
            className="mr-2"
            onChange={() => setSelected(index)}
          />
          <span className="text-slate-200">{opt.text}</span>

          <span className="float-right text-cyan-300 font-semibold">
            {opt.votes} votes
          </span>
        </label>
      ))}

      <button
        onClick={handleVote}
        disabled={loading}
        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Vote"}
      </button>
    </div>
  );
};

export default PollSection;

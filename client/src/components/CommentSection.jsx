// import React, { useEffect, useState } from "react";

// const CommentSection = () => {
//   const [comments, setComments] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [text, setText] = useState("");
//   const [name, setName] = useState("");

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const res = await fetch("/api/kohli/comments");
//         const data = await res.json();

//         setComments(data.latestComments);
//         setTotal(data.total);
//       } catch (err) {
//         console.log("Comment fetch error:", err);
//       }
//     };
//     fetchComments();
//   }, []);

//   // Add comment
//   const handleAdd = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await fetch("/api/kohli/comments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, text }),
//       });

//       const data = await res.json();

//       // Add new comment to the top list
//       setComments(data.latestComments);
//       setTotal(data.total);
//       setText("");
//       setName("");
//     } catch (err) {
//       console.log("Add comment error:", err);
//     }
//   };

//   return (
//     <div className="glass-dark p-4 rounded-lg mt-10 animate-fade">
//       <h2 className="text-xl text-white font-bold mb-3 text-center">
//         Guest Comments ({total})
//       </h2>

//       {/* Input fields */}
//       <div className="space-y-3 mb-5">
//         <input
//           type="text"
//           placeholder="Your Name"
//           className="w-full p-2 rounded bg-white/20 text-white"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <textarea
//           placeholder="Write a comment..."
//           className="w-full p-2 rounded bg-white/20 text-white"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//       </div>

//       <button
//         onClick={handleAdd}
//         className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//       >
//         Add Comment
//       </button>

//       {/* Latest 5 comments */}
//       <div className="mt-6 space-y-3">
//         {comments.map((c, index) => (
//           <div
//             key={index}
//             className="bg-white/10 p-3 rounded-lg border border-white/10"
//           >
//             <p className="text-cyan-300 font-semibold">{c.name}</p>
//             <p className="text-slate-200 mt-1">{c.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentSection;

// ****************************************************************************************** //

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Simple comment UI:
 * - shows latest comments (from backend)
 * - add comment (POST)
 * - button to go to "View All Comments" page
 *
 * Expects backend GET /api/kohli/comments -> { latestComments: [...], total: N }
 * Expects backend POST /api/kohli/comments -> same shape in response
 */

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch latest comments (top 5)
    const fetchComments = async () => {
      try {
        const res = await axios.get("/api/kohli/comments");
        // backend should return { latestComments, total }
        setComments(res.data.latestComments || []);
        setTotal(res.data.total ?? 0);
      } catch (err) {
        console.log("Comment fetch error:", err);
      }
    };
    fetchComments();
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/kohli/comments", {
       name,
       text,
      });
      const latest = res.data.latestComments || [];
      const tot = res.data.total ?? total + 1;
      // const data = await res.json();
      // backend should respond with latestComments and total for simplicity
      // setComments(res.data.latestComments || []);
            // setComments(res.data.comments || []); // this line is showing latest comments 
            setComments(latest)
      // setTotal(res.data.total || total + 1);
            // setTotal(res.data.total || total + 1 || 0); // this line also working
            setTotal(tot)

      setText("");
      setName("");
    } catch (err) {
      console.log("Add comment error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="glass-dark p-4 rounded-lg mt-10 animate-fade">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-white font-bold">
          Guest Comments <span className="text-cyan-300">({total})</span>
        </h2>
        <button
          onClick={() => navigate("/view-comments")}
          className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20"
        >
          View all
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-2 rounded bg-white/10 text-white placeholder:text-white/60"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Write a comment..."
          className="w-full p-2 rounded bg-white/10 text-white placeholder:text-white/60"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        {loading ? "Adding..." : "Add comment"}
      </button>

      <div className="mt-6 space-y-3">
        {comments.map((c, idx) => (
          <div
            key={idx}
            className="bg-white/6 p-3 rounded-lg border border-white/8"
          >
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 font-semibold">{c.name || "Guest"}</p>
              <small className="text-xs text-white/60">
                {new Date(c.createdAt || c.created_at || Date.now()).toLocaleString()}
              </small>
            </div>
            <p className="text-slate-200 mt-1">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

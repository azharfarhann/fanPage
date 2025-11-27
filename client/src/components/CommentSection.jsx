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

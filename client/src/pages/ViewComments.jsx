import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * View all comments page:
 * - fetches all comments
 * - admin can delete a comment by entering admin token (simple prompt)
 *
 * Backend expectations:
 * - GET /api/kohli/comments/all -> { comments: [...], total: N }
 * - DELETE /api/kohli/comments/:id  with header 'x-admin-token'
 */

const ViewComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("/api/kohli/comments/all")
        // backend might return { comments } or { latestComments, total }
        setComments(res.data.comments || res.data.latestComments || []);
      } catch (err) {
        console.log("Fetch all comments error:", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

//   const handleDelete = async (id) => {
//     const token = prompt("Enter admin token to delete (demo):");
//     if (!token) return alert("Admin token required");

//     try {
//       const res = await fetch(`/api/kohli/comments/${id}`, {
//         method: "DELETE",
//         headers: { "x-admin-token": token },
//       });
//       if (!res.ok) {
//         const json = await res.json().catch(() => ({}));
//         return alert(json.message || "Delete failed");
//       }
//       // remove locally
//       setComments((prev) => prev.filter((c) => c._id !== id && c.id !== id));
//     } catch (err) {
//       console.log("Delete error:", err);
//       alert("Delete failed");
//     }
//   };

const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/kohli/comments/${id}`, {
        headers: {
          "x-admin-token": import.meta.env.VITE_ADMIN_TOKEN
        },
    });

      // simpler filtering (beginner friendly)
      const updated = comments.filter(c => c._id !== id);
      setComments(updated);

    } catch (err) {
      console.log("Delete failed", err);
}
}
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-white/80">
          ← Back
        </button>
        <h1 className="text-2xl text-white font-semibold">All Comments</h1>
        <div />
      </div>

      <div className="space-y-4">
        {loading && <div className="text-white/60">Loading comments...</div>}
        {!loading && comments.length === 0 && (
          <div className="text-white/60">No comments yet.</div>
        )}

        {comments.map((c) => (
          <div
            key={c._id || c.id || Math.random()}
            className="bg-white/6 p-4 rounded-lg flex justify-between items-start"
          >
            <div>
              <div className="flex gap-3 items-center">
                <div className="text-cyan-300 font-semibold">{c.name || "Guest"}</div>
                <div className="text-xs text-white/60">
                  {new Date(c.createdAt || c.created_at || Date.now()).toLocaleString()}
                </div>
              </div>
              <p className="text-slate-200 mt-2">{c.text}</p>
            </div>

            <div>
              <button
                onClick={() => handleDelete(c._id || c.id)}
                className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewComments;

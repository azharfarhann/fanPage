import axios from "axios";



export const getKohliStats = async () => {
      const baseUrl = "http://localhost:5000/api/kohli/stats"

  try {
    const res = await fetch(baseUrl);
    const data = await res.json()
    return data
  } catch (err) {
    console.log("API Error:", err);
  }
};

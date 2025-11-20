import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="page-bg min-h-screen">
      <div className="main-content">
        <Header />
        <Home />
      </div>

      {/* faint vignette and optional silhouette */}
      <div className="vignette" />
      <div className="bat-silhouette" />
    </div>
  );
};

export default App;

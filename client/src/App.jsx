import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./index.css";

const App = () => {
  return (
    <div className="page-bg">
      <div className="main-content min-h-screen">
        <Header />
        <Home />
      </div>
    </div>
  );
};

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ViewComments from "./pages/ViewComments";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="page-bg">
        <div className="main-content min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/view-comments" element={<ViewComments />} />
            {/* future: admin routes can be added here */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Bulletin from "./pages/Bulletin.js";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="relative">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="bulletin" element={<Bulletin />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

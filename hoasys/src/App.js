import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from './pages/Home.js';
import About from './pages/About.js';
import Bulletin from './pages/Bulletin.js';

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="bulletin" element={<Bulletin />} />
      </Routes>
    </div>
  );
}

export default App;




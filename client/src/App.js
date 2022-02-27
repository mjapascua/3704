import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Bulletin from "./pages/Bulletin.js";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Contact } from "./pages/Contact";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <div className="relative w-full">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="dashboard/*" element={<Dashboard />} />
        <Route path="user/*" element={<UserHome />} />
        <Route
          path="bulletin"
          element={
            <>
              <Navbar />
              <Bulletin />
            </>
          }
        />
        <Route
          path="login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="signup"
          element={
            <>
              <Signup />
            </>
          }
        />
      </Routes>
      <ToastContainer theme="colored" hideProgressBar />
    </div>
  );
}

export default App;

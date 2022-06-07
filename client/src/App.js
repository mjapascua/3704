import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import About from "./pages/About";
import Bulletin from "./pages/Bulletin";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import VisitorForm from "./pages/VistorForm";
import Article from "./pages/Article";

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
          path="bulletin/post/:id"
          element={
            <>
              <Navbar />
              <Article />
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
        <Route
          path="account/*"
          element={
            <div className="w-full flex h-screen flex-col box-border">
              <Navbar />
              <Account />
            </div>
          }
        />
        <Route
          path="bulletin"
          element={
            <>
              <Navbar />
              <Bulletin />
              <Footer />
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
        <Route
          path="visitor_form/:uIds"
          element={
            <>
              <VisitorForm />
            </>
          }
        />
      </Routes>
      <ToastContainer theme="colored" hideProgressBar />
    </div>
  );
}

export default App;

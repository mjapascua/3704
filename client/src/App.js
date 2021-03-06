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
import CompleteVerification from "./pages/CompleteVerification";
import Loading from "./components/Loading/Loading";
import Article from "./pages/Article";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPass from "./pages/ForgotPass";

function App() {
  return (
    <React.Suspense fallback={<Loading />}>
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
            <>
              <Navbar />
              <Account />
            </>
          }
        />
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
        <Route
          path="visitor_form/:uIds"
          element={
            <>
              <VisitorForm />
            </>
          }
        />
        <Route
          path="verification/:id"
          element={
            <>
              <CompleteVerification />
            </>
          }
        />
        <Route
          path="login/forgot_password"
          element={
            <>
              <ForgotPass />
            </>
          }
        />
        <Route
          path="password_update/:uniq/:id"
          element={
            <>
              <UpdatePassword />
            </>
          }
        />
      </Routes>
      <ToastContainer theme="colored" hideProgressBar />
    </React.Suspense>
  );
}

export default App;

import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { motion } from "framer-motion";

// ⬇️ არსებული გვერდები
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Movies = lazy(() => import("./pages/Movies"));
const Contact = lazy(() => import("./pages/Contact"));

// ⬇️ ახალი გვერდები Login და Register
const Login = lazy(() => import("./pages/Login"));     // ⬅️ ახალი იმპორტი
const Register = lazy(() => import("./pages/Register")); // ⬅️ ახალი იმპორტი

const LoadingSpinner = () => (
  <div className="flex flex-col sm:flex-row justify-center items-center min-h-[50vh]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-t-4 border-t-indigo-500 border-gray-200 rounded-full"
    ></motion.div>
    <p className="mt-4 sm:mt-0 sm:ml-4 text-xl text-gray-400">Loading...</p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full fade-in">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* ⬇️ ახალი როუტები Login და Register გვერდებისთვის */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
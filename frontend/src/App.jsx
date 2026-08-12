import React, { useState, createContext, useEffect } from "react"; // Added useEffect
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Register from "./pages/Signup";
import Courses from "./pages/Courses";
import RegisterStudent from "./pages/StudentReg";
import ManageCourses from "./pages/ManageCourses";
import ManageVideos from "./pages/ManageVideos";
import StudentsList from "./pages/StudentsList";
import UpdatePassword from "./pages/UpdatePassword";

export const LoginContext = createContext();

const App = () => {
  const [loginStatus, setLoginStatus] = useState(false);

  // This function runs every time the page is refreshed
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    
    // If a token exists, the user is still technically logged in
    if (token && email) {
      setLoginStatus(true);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <div>
        <ToastContainer position="top-right" autoClose={800} />
        
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path ="/register-student" element={<RegisterStudent />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/manage-videos" element={<ManageVideos />} />
          <Route path="/students-list" element={<StudentsList />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
      </div>
    </LoginContext.Provider>
  );
};

export default App;
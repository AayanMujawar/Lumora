import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
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

// eslint-disable-next-line react-refresh/only-export-components
export const LoginContext = createContext();

const App = () => {
  const [loginStatus, setLoginStatus] = useState(() => {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    return !!(token && email);
  });

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
          <Route path="/register-student" element={<RegisterStudent />} />
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
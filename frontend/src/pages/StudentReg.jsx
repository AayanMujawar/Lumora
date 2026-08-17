import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { studentregister } from '../services/userservice';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar";

function StudentReg() {
    const navigate = useNavigate();
    const location = useLocation();

    const [sname, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile_no, setMobile_no] = useState('');
    const [course_name] = useState(location.state?.selectedCourseName || ''); 
    const [course_id] = useState(location.state?.selectedCourseId || '');

    const register = async () => {
        // --- ISSUE 1: FRONTEND VALIDATION TOASTERS ---
        if (sname.trim() === '') return toast.warn('Please enter your Name');
        if (email.trim() === '') return toast.warn('Please enter your Email');
        if (mobile_no.trim() === '') return toast.warn('Please enter your Mobile Number');
        if (course_id === '') return toast.warn('Course selection error. Please go back to Home.');

        try {
            // --- ISSUE 2: SENDING DATA TO BACKEND ---
            // Ensure studentregister uses (sname, email, mobile_no, course_id)
            const result = await studentregister(sname, email, mobile_no, course_id);
            
            if (result.status === 'success') {
                toast.success(result.message || 'Registration successful!');
                // Navigate only AFTER successful database insertion
                navigate('/');
            } else {
                // Catches backend errors (like duplicate email for the same course)
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error("Server error. Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card shadow-lg p-4 border-0" style={{ width: '400px', borderRadius: '15px' }}>
                    <div className="card-body">
                        <h2 className="text-center mb-4 fw-light" style={{ color: '#00c4e8' }}>Course Registration</h2>
                        
                        <div className="mb-3">
                            <label className="form-label text-secondary"><b>Name</b></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your Full Name"
                                value={sname}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary"><b>Email</b></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="example@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary"><b>Mobile Number</b></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="1234567890"
                                value={mobile_no}
                                onChange={e => setMobile_no(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary"><b>Course Name</b></label>
                            <input
                                type="text"
                                className="form-control"
                                value={course_name}
                                readOnly 
                                style={{ backgroundColor: '#f8f9fa', color: '#00c4e8', fontWeight: 'bold' }}
                            />
                        </div>

                        <div className="d-grid">
                            {/* REMOVED <Link> from inside the button to allow the async register function to run */}
                            <button 
                                className="btn text-white fw-bold" 
                                style={{ backgroundColor: '#00c4e8' }} 
                                onClick={register}
                            >
                                Register Now
                            </button>
                        </div>
                                                {/* Informational Blue Box */}
                        <div className="mt-3 p-3 border-0 rounded" style={{ backgroundColor: '#e0f7fa', color: '#006064', fontSize: '0.85rem' }}>
                            After registration, a user will be created with this email and default 
                            password <strong>Student123</strong>. The student can change the password later.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentReg;
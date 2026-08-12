import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Changed to 'react-router-dom'
import { registerUser } from '../services/userservice';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar";

function Register() {
    // Keep your existing state and logic
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const signup = async () => {
        if (!email || email.trim() === '') {
            toast.warn('Please enter an email address');
            return;
        }
        
        try {
            const result = await registerUser(email);
            if (result && result.status === 'success') {
                toast.success('User registered successfully! Default password is Student123');
                navigate('/login');
            } else {
                toast.error(result?.message || result?.error || 'Registration failed');
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Server error during registration');
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                {/* Styled card matching your design */}
                <div className="card shadow-lg p-4 login-card border-0">
                    <div className="card-body">
                        <h2 className="text-center mb-4 fw-light"><b>Signup</b></h2>
                        
                        <div className="mb-3">
                            <label htmlFor="inputEmail" className="form-label text-secondary">
                                <b>Email address</b>
                            </label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                placeholder="example@example.com" 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        {/* Your cyan button logic */}
                        <div className="d-grid mt-4">
                            <button className="btn custom-btn-cyan w-100" onClick={signup}>
                                Register
                            </button>
                        </div>

                        {/* The "Login Here" footer */}
                        <div className="mt-4 text-center">
                            <span className="text-secondary me-1">Already have an Account?</span>
                            <Link to='/login' className="create-account-link">
                                Login Here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
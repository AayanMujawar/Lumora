import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userservice';
import { toast } from 'react-toastify';
import { LoginContext } from '../App';
import Navbar from "../components/Navbar"; // Assuming you want Navbar here too

function Login() {
    // Keep your existing state and logic
    const [email, setEmail] = useState('');
    const [upass, setUpass] = useState('');

    const navigate = useNavigate();
    const { setLoginStatus } = useContext(LoginContext);

    const signin = async () => {
        if (email === '')
            return toast.warn('Email must be entered');

        if (upass === '')
            return toast.warn('Password must be entered');
        


        
        const result = await loginUser(email, upass);
// Inside your login function

        if (result.status === 'success') {
            // Keep your specific session handling
            sessionStorage.setItem('token', result.data.token);
            sessionStorage.setItem('email', result.data.email);
            sessionStorage.setItem('urole', result.data.urole);
            sessionStorage.setItem('reg_no', result.data.reg_no); 
            setLoginStatus(true);
            
            toast.success('Login successful');
            navigate('/home');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                {/* The styled card from your design */}
                <div className="card shadow-lg p-4 login-card border-0">
                    <div className="card-body">
                        <h2 className="text-center mb-4 fw-light">Login</h2>
                        
                        <div className="mb-3">
                            <label className="form-label text-secondary"><b>Email address</b></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary"><b>Password</b></label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="********"
                                value={upass}
                                onChange={e => setUpass(e.target.value)}
                            />
                        </div>

                        {/* Your cyan button logic */}
                        <div className="d-grid">
                            <button className="btn custom-btn-cyan w-100" onClick={signin}>
                                Login
                            </button>
                        </div>

                        {/* The "Create Account" footer we discussed */}
                        <div className="mt-4 text-center">
                            <span className="text-secondary me-1">New to Portal?</span>
                            <Link to='/signup' className="create-account-link">
                                Create an Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
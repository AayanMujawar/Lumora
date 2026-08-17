import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { updateStudentPassword } from '../services/userservice';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        reg_no: '',
        old_upass: '',
        new_upass: '',
        confirm_pass: ''
    });

    const handleInput = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        // Frontend Validation
        if (!passwordData.reg_no || !passwordData.old_upass || !passwordData.new_upass) {
            return toast.warn("All fields are required");
        }

        if (passwordData.new_upass !== passwordData.confirm_pass) {
            return toast.error("New passwords do not match");
        }

        try {
            const result = await updateStudentPassword({
                reg_no: passwordData.reg_no,
                old_upass: passwordData.old_upass,
                new_upass: passwordData.new_upass
            });

            if (result.status === 'success') {
                toast.success(result.message);
                navigate('/'); // Redirect to home after success
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to update password. Check your credentials.");
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">
                                <h3 className="text-center fw-bold mb-4" style={{ color: '#00c4e8' }}>
                                    Update Password
                                </h3>
                                <p className="text-center text-muted small mb-4">
                                    Secure your account by updating your login credentials.
                                </p>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Registration Number</label>
                                    <input 
                                        type="text" 
                                        name="reg_no" 
                                        className="form-control" 
                                        placeholder="Enter your Reg No." 
                                        onChange={handleInput} 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Old Password</label>
                                    <input 
                                        type="password" 
                                        name="old_upass" 
                                        className="form-control" 
                                        onChange={handleInput} 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">New Password</label>
                                    <input 
                                        type="password" 
                                        name="new_upass" 
                                        className="form-control" 
                                        onChange={handleInput} 
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        name="confirm_pass" 
                                        className="form-control" 
                                        onChange={handleInput} 
                                    />
                                </div>

                                <button 
                                    className="btn w-100 py-2 text-white fw-bold" 
                                    style={{ backgroundColor: '#00c4e8' }}
                                    onClick={handleUpdate}
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
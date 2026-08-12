import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';
import { toast } from 'react-toastify';
// Added getProfilePic to the imports
import { updateProfilePic, getProfilePic } from '../services/userservice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  // NEW: State to store the displayable image URL
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const userEmail = sessionStorage.getItem('email');
  const userRole = sessionStorage.getItem('urole');
  const regNo = sessionStorage.getItem('reg_no'); 

  // NEW: Fetch existing profile picture on component load
  useEffect(() => {
    const fetchPic = async () => {
      // Only fetch if logged in, role is Student, and we have a valid regNo
      if (loginStatus && userRole === 'Student' && regNo && regNo !== "0" && regNo !== "undefined") {
        try {
          const data = await getProfilePic(regNo);
          
          // Convert raw binary BLOB to Base64 string for <img> tag
          if (data && data.byteLength > 0) {
            const base64 = btoa(
              new Uint8Array(data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              )
            );
            setProfilePicUrl(`data:image/jpeg;base64,${base64}`);
          }
        } catch (error) {
          console.log("No profile picture found.");
        }
      }
    };
    fetchPic();
  }, [loginStatus, regNo, userRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    setLoginStatus(false);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!regNo || regNo === "0" || regNo === "undefined") {
        console.error("regNo is missing from sessionStorage!");
        toast.error("User ID not found. Please re-login.");
        return;
    }

    if (file) {
        const formData = new FormData();
        formData.append('profile_pic', file);
        formData.append('reg_no', regNo);

        try {
            const result = await updateProfilePic(formData);
            if (result.status === 'success') {
                toast.success("Profile picture updated!");
                // Short delay before reload to allow toast to be seen
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Upload Error:", error.response?.data || error.message);
            toast.error("Failed to upload image");
        }
    }
  };

  const cyanButtonStyle = {
    backgroundColor: '#00c4e8',
    color: 'white',
    border: '1px solid white',
    padding: '4px 18px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.3s'
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sn-navbar-container sticky-top">
        <div className="container-fluid d-flex align-items-center">
          
          <Link className="navbar-brand d-flex align-items-center sn-brand-link" to="/">
            <div className="sn-logo-circle">S</div>
            <span className="sn-brand-text">Sunbeam Online Course Portal</span>
          </Link>

          <button className="navbar-toggler sn-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#snNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="snNav">
            <div className="mx-auto d-flex align-items-center">
              <ul className="navbar-nav d-flex align-items-center mb-0">
                <li className="nav-item"><Link className="nav-link sn-nav-item" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link sn-nav-item" to="/about">About Sunbeam</Link></li>
                {loginStatus && userRole === 'Student' && (
                  <li className="nav-item"><Link className="nav-link sn-nav-item" to="/courses">Courses</Link></li>
                )}
                {loginStatus && userRole === 'Admin' && (
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle sn-nav-item fw-bold" href="#" role="button" data-bs-toggle="dropdown">
                      Admin
                    </a>
                    <ul className="dropdown-menu sn-admin-dropdown border-0 shadow">
                      <li><Link className="dropdown-item" to="/manage-courses">Manage Courses</Link></li>
                      <li><Link className="dropdown-item" to="/manage-videos">Manage videos</Link></li>
                      <li><Link className="dropdown-item" to="/students-list">Students list</Link></li>
                    </ul>
                  </li>
                )}
              </ul>

              <form className="d-flex ms-3">
                <input className="form-control me-2 sn-search-input" type="search" placeholder="Search courses" />
                <button className="btn sn-search-btn" type="submit">Search</button>
              </form>
            </div>

            <div className="d-flex align-items-center">
              {!loginStatus ? (
                <Link className="sn-login-btn text-decoration-none" to="/login">Login</Link>
              ) : (
                <div className="d-flex align-items-center">
                  <div 
                    className="d-flex align-items-center p-1 border rounded-pill bg-light sn-profile-pill me-3" 
                    style={{ cursor: 'pointer' }}
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#profileSidebar"
                  >
                    <div className="sn-avatar-circle text-white d-flex align-items-center justify-content-center me-2" 
                         style={{ backgroundColor: '#00c4e8', width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}>
                      {/* Show profile pic if exists in Navbar pill */}
                      {profilePicUrl ? (
                        <img src={profilePicUrl} alt="p" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      ) : (
                        userRole === 'Admin' ? 'A' : 'S'
                      )}
                    </div>
                    <span className="small fw-bold pe-2 text-dark d-none d-lg-inline">{userEmail}</span>
                  </div>

                  <button style={cyanButtonStyle} className="sn-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Sidebar */}
      <div className="offcanvas offcanvas-end border-0 shadow" tabIndex="-1" id="profileSidebar" style={{ width: '350px' }}>
        <div className="offcanvas-header text-white" style={{ backgroundColor: '#00c4e8' }}>
          <h5 className="offcanvas-title fw-bold">User Profile</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="text-center mb-4">
              <div className="position-relative d-inline-block mb-3">
                <div 
                  className="rounded-circle border d-flex align-items-center justify-content-center bg-light shadow-sm"
                  style={{ width: '120px', height: '120px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('picInput').click();
                  }}
                >
                  {/* Show profile pic if exists in Sidebar circle */}
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <i className="bi bi-camera display-6 text-muted"></i>
                  )}
                </div>
                <input type="file" id="picInput" hidden accept="image/*" onChange={handleFileChange} />
                <div className="position-absolute bottom-0 end-0 bg-info text-white rounded-circle p-1 px-2" style={{ fontSize: '12px' }}>
                   <i className="bi bi-pencil-fill"></i>
                </div>
              </div>

             <h5 className="fw-bold mb-0">{userEmail}</h5>
             <span className="badge bg-info mt-1">{userRole}</span>
          </div>
          <hr />
          <div className="mb-4 text-start">
            <p className="mb-1 text-muted small ms-2">Email Address</p>
            <p className="fw-bold ms-2">{userEmail}</p>
            <p className="mb-1 text-muted small ms-2">Role</p>
            <p className="fw-bold ms-2">{userRole}</p>
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-outline-info fw-bold" onClick={() => navigate('/update-password')}>Update Password</button>
            <button className="btn btn-danger fw-bold" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
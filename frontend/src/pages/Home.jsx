import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { LoginContext } from '../App';
import { allcourses, getAllEnrolledStudents, getVideosByCourse } from '../services/userservice';
import Navbar from "../components/Navbar.jsx";
import "../components/Navbar.css";
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState({}); 
    
    const { loginStatus } = useContext(LoginContext);
    const navigate = useNavigate();
    const urole = sessionStorage.getItem('urole');

    useEffect(() => {
        const loadPageData = async () => {
            try {
                // 1. Fetch the master list of all courses (The 7 courses from your DB)
                const courseResult = await allcourses();
                if (!courseResult || courseResult.status !== 'success') return;
                const masterCourseList = courseResult.data;

                if (loginStatus && urole === 'Admin') {
                    const enrollResult = await getAllEnrolledStudents();
                    
                    if (enrollResult && enrollResult.status === 'success') {
                        // 2. Create a count map from the enrollment data
                        const enrollmentCounts = enrollResult.data.reduce((acc, curr) => {
                            // Only count if reg_no exists (ignore empty rows from LEFT JOIN)
                            if (curr.reg_no) {
                                const id = String(curr.course_id);
                                acc[id] = (acc[id] || 0) + 1;
                            }
                            return acc;
                        }, {});

                        // 3. Map counts back to the 7 master courses
                        const mergedAdminData = masterCourseList.map(course => ({
                            ...course,
                            studentCount: enrollmentCounts[String(course.course_id)] || 0
                        }));

                        setAdminData(mergedAdminData);
                    }
                } else {
                    setCourses(masterCourseList);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        loadPageData();
    }, [loginStatus, urole]);

    const toggleVideos = async (courseId) => {
        if (visibleVideos[courseId]) {
            const updated = { ...visibleVideos };
            delete updated[courseId];
            setVisibleVideos(updated);
        } else {
            const result = await getVideosByCourse(courseId);
            if (result.status === 'success') {
                setVisibleVideos({ ...visibleVideos, [courseId]: result.data });
            } else {
                toast.error("Could not load videos");
            }
        }
    };

    return (
        <div className="home-wrapper" style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5 mt-5">
                <div className="row align-items-center">
                    <div className="col-lg-7 text-start">
                        <h1 className="display-4 fw-bold" style={{ color: '#00c4e8' }}>
                            {urole === 'Admin' ? "Admin Dashboard" : "Welcome to Sunbeam Portal"}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mt-4 pb-5">
                <hr />
                <h2 className="mb-4 mt-5" style={{ color: '#00c4e8' }}>
                    {urole === 'Admin' ? "Registered Courses" : "Available Courses"}
                </h2>
                
                <div className="row">
                    {loginStatus && urole === 'Admin' ? (
                        adminData.map((course) => (
                            <div className="col-md-6 mb-4" key={course.course_id}>
                                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
                                    <div className="card-body p-4">
                                        <h3 className="fw-bold mb-3" style={{ color: '#00c4e8' }}>{course.course_name}</h3>
                                        <p className="text-muted small mb-3">{course.description}</p>
                                        <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }} className="mb-4">
                                            <div className="border-bottom py-1"><strong>Course ID:</strong> {course.course_id}</div>
                                            <div className="border-bottom py-1"><strong>Fees:</strong> ₹{course.fees}</div>
                                            <div className="border-bottom py-1"><strong>Start Date:</strong> {course.start_date}</div>
                                            <div className="border-bottom py-1"><strong>End Date:</strong> {course.end_date}</div>
                                            <div className="border-bottom py-1"><strong>Video Expire Days:</strong> {course.video_expire_days}</div>
                                            <div className="mt-3">
                                                <strong>Registered Students: </strong> 
                                                <span className="badge bg-success rounded-pill px-3 py-2">
                                                    {course.studentCount}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="btn btn-info text-white w-100 fw-bold py-2 shadow-sm" onClick={() => navigate('/students-list', { state: { course_id: course.course_id } })}>
                                            View Registered Students ({course.studentCount})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        courses.map((course) => (
                            <div className="col-md-6 mb-4" key={course.course_id}>
                                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '8px' }}>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-3" style={{ color: '#00c4e8' }}>{course.course_name?.toUpperCase()}</h4>
                                        <p className="text-muted small mb-3">{course.description}</p>
                                        <div className="mb-4 small">
                                            <div><strong>Fees:</strong> ₹{course.fees}</div>
                                            <div><strong>Start:</strong> {course.start_date}</div>
                                            <div><strong>End:</strong> {course.end_date}</div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-info text-white flex-grow-1 fw-bold btn-sm" onClick={() => navigate('/register-student', { state: { selectedCourseName: course.course_name, selectedCourseId: course.course_id } })}>
                                                Register
                                            </button>
                                            {loginStatus ? (
                                                <button className="btn btn-outline-info flex-grow-1 fw-bold btn-sm" onClick={() => toggleVideos(course.course_id)}>
                                                    {visibleVideos[course.course_id] ? "Hide Videos" : "View Videos"}
                                                </button>
                                            ) : (
                                                <Link to="/login" className="btn btn-outline-info flex-grow-1 fw-bold btn-sm text-decoration-none text-info text-center">Login to View Videos</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
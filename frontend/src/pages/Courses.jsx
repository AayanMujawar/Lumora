import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LoginContext } from '../App';
import Navbar from "../components/Navbar";
import { mycourses, getVideosByCourse } from '../services/userservice';

const Courses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [visibleVideos, setVisibleVideos] = useState({}); 
    const { loginStatus } = useContext(LoginContext);

    useEffect(() => {
        const loadCourses = async () => {
            const email = sessionStorage.getItem('email');
            if (!email) return;

            try {
                const result = await mycourses(email);
                if (result && result.status === 'success') {
                    setEnrolledCourses(result.data); 
                }
            } catch (error) {
                toast.error("Session Unauthorized. Please login again.");
            }
        };

        if (loginStatus) {
            loadCourses();
        }
    }, [loginStatus]);

    const toggleVideos = async (courseId) => {
        if (visibleVideos[courseId]) {
            const updated = { ...visibleVideos };
            delete updated[courseId];
            setVisibleVideos(updated);
        } else {
            try {
                const result = await getVideosByCourse(courseId);
                if (result.status === 'success') {
                    setVisibleVideos({ ...visibleVideos, [courseId]: result.data });
                }
            } catch (error) {
                toast.error("Error loading videos");
            }
        }
    };

    // NEW: Logic to validate if course has started
    const handlePlayVideo = (e, startDate, youtubeUrl) => {
        const today = new Date();
        const start = new Date(startDate);

        // If today's date is before the start date
        if (today < start) {
            e.preventDefault(); // Stop the link from opening
            toast.warn("Course is yet to start! Access will be granted on " + startDate);
            return false;
        }
        // Otherwise, the <a> tag will naturally open the youtubeUrl
    };

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4 fw-bold" style={{ color: '#00c4e8' }}>My Enrolled Courses</h2>
                <div className="row">
                    {enrolledCourses.length > 0 ? (
                        enrolledCourses.map((course) => (
                            <div className="col-md-6 mb-4" key={course.course_id}>
                                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-2" style={{ color: '#00c4e8' }}>
                                            {course.course_name ? course.course_name.toUpperCase() : 'COURSE'}
                                        </h4>
                                        <p className="text-muted small mb-3">{course.description}</p>
                                        
                                        <div className="mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                                            <div className="border-bottom py-1 text-primary"><strong>Start Date:</strong> {course.start_date}</div>
                                            <div className="border-bottom py-1"><strong>Course ID:</strong> {course.course_id}</div>
                                            <div className="border-bottom py-1"><strong>Fees:</strong> ₹{course.fees}</div>
                                            <div className="border-bottom py-1"><strong>End:</strong> {course.end_date}</div>
                                            <div className="border-bottom py-1"><strong>Videos Expire in:</strong> {course.video_expire_days} days</div>
                                        </div>

                                        <button 
                                            className="btn w-100 py-2 fw-bold text-white shadow-sm" 
                                            style={{ backgroundColor: '#00c4e8', borderRadius: '8px' }}
                                            onClick={() => toggleVideos(course.course_id)}
                                        >
                                            {visibleVideos[course.course_id] ? "Hide Videos" : "View Videos"}
                                        </button>

                                        {visibleVideos[course.course_id] && (
                                            <div className="mt-3 p-3 border rounded bg-light shadow-inner">
                                                {visibleVideos[course.course_id].length > 0 ? (
                                                    visibleVideos[course.course_id].map((vid, index) => (
                                                        <div key={vid.video_id} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                                                            <div className="pe-2">
                                                                <div className="fw-bold small">{index + 1}. {vid.title}</div>
                                                                <div className="text-muted x-small" style={{ fontSize: '0.75rem' }}>{vid.description}</div>
                                                            </div>
                                                            
                                                            {/* UPDATED: Play button with date check */}
                                                            <a 
                                                                href={vid.youtube_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="btn btn-info btn-sm text-white px-3 fw-bold"
                                                                style={{ fontSize: '0.7rem' }}
                                                                onClick={(e) => handlePlayVideo(e, course.start_date, vid.youtube_url)}
                                                            >
                                                                Play
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="small text-muted italic">No videos available for this course.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-5">
                            <p className="text-muted">No courses found for {sessionStorage.getItem('email')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;
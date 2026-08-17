import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { getAllCourses, addCourse, deleteCourse, updateCourse } from '../services/userservice';
import { toast } from 'react-toastify';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    
    // Initial state for form
    const initialFormState = {
        course_id: '',
        course_name: '',
        description: '',
        fees: '',
        video_expire_days: '',
        start_date: '',
        end_date: ''
    };

    const [courseData, setCourseData] = useState(initialFormState);

    const loadCourses = async () => {
        try {
            const result = await getAllCourses();
            if (result.status === 'success') {
                setCourses(result.data);
            }
        } catch {
            toast.error("Failed to load courses");
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadCourses();
        };
        init();
    }, []);

    const handleInput = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const onSave = async () => {
        if (!courseData.course_name || !courseData.fees) {
            return toast.warn("Course Name and Fees are required");
        }

        try {
            const result = isEdit ? await updateCourse(courseData) : await addCourse(courseData);
            if (result.status === 'success') {
                toast.success(result.message);
                resetForm();
                loadCourses();
            }
        } catch {
            toast.error("Operation failed");
        }
    };

    const onEdit = (course) => {
        setIsEdit(true);
        // Map backend keys to form fields
        setCourseData({
            ...course,
            // Strip GMT strings if needed for HTML date inputs
            start_date: course.start_date ? new Date(course.start_date).toISOString().split('T')[0] : '',
            end_date: course.end_date ? new Date(course.end_date).toISOString().split('T')[0] : ''
        });
    };

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            const result = await deleteCourse(id);
            if (result.status === 'success') {
                toast.success(result.message);
                loadCourses();
            }
        }
    };

    const resetForm = () => {
        setCourseData(initialFormState);
        setIsEdit(false);
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div className="container-fluid py-4 px-5">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: '#00c4e8', fontWeight: '300' }}>Admin – Manage Courses</h2>
                    <small className="text-muted">Add, edit, and delete Sunbeam courses</small>
                </header>

                <div className="row">
                    {/* Left: Course List Table */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Courses</h5>
                                <span className="badge bg-info text-white">{courses.length} total</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                                    <thead className="table-light text-secondary">
                                        <tr>
                                            <th>ID</th>
                                            <th>Name & Description</th>
                                            <th>Fees</th>
                                            <th>Dates</th>
                                            <th className="text-center">Videos Expire (days)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((c) => (
                                            <tr key={c.course_id}>
                                                <td>{c.course_id}</td>
                                                <td>
                                                    <div className="fw-bold">{c.course_name}</div>
                                                    <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                                                        {c.description}
                                                    </div>
                                                </td>
                                                <td className="fw-bold">₹{c.fees}</td>
                                                <td>
                                                    <div className="small text-muted">
                                                        <div>{c.start_date} →</div>
                                                        <div>{c.end_date}</div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge rounded-pill bg-light text-dark border px-3">
                                                        {c.video_expire_days}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(c)}>Edit</button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(c.course_id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Add/Edit Form */}
                    <div className="col-lg-5 mt-4 mt-lg-0">
                        <div className="card shadow-sm border-0 p-4">
                            <h5 className="fw-bold mb-4">{isEdit ? "Update Course" : "Add New Course"}</h5>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small text-muted">Course ID (optional)</label>
                                    <input type="text" className="form-control bg-light" placeholder="Auto-generated if left blank" disabled value={courseData.course_id} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small text-muted">Course Name</label>
                                    <input type="text" name="course_name" className="form-control" value={courseData.course_name} onChange={handleInput} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small text-muted">Description</label>
                                    <textarea name="description" className="form-control" rows="3" value={courseData.description} onChange={handleInput}></textarea>
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted">Fees (₹)</label>
                                    <input type="number" name="fees" className="form-control" value={courseData.fees} onChange={handleInput} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted">Video Expire Days</label>
                                    <input type="number" name="video_expire_days" className="form-control" value={courseData.video_expire_days} onChange={handleInput} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted">Start Date</label>
                                    <input type="date" name="start_date" className="form-control" value={courseData.start_date} onChange={handleInput} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted">End Date</label>
                                    <input type="date" name="end_date" className="form-control" value={courseData.end_date} onChange={handleInput} />
                                </div>
                                <div className="col-12 mt-4">
                                    <button className="btn btn-info w-100 text-white fw-bold py-2" onClick={onSave}>
                                        {isEdit ? "Update Course" : "Add Course"}
                                    </button>
                                    {isEdit && (
                                        <button className="btn btn-link w-100 text-muted mt-2 text-decoration-none" onClick={resetForm}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
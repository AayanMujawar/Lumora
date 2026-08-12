import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { 
    getAllVideos, 
    addVideo, 
    updateVideo, 
    deleteVideo, 
    getAllCourses 
} from "../services/userservice";
import { toast } from "react-toastify";

const ManageVideos = () => {
    // ============================
    // STATE
    // ============================
    const [videos, setVideos] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    
    // NEW: State to track the selected course filter
    const [selectedFilter, setSelectedFilter] = useState("All courses");

    const initialState = {
        video_id: "",
        course_id: "",
        title: "",
        youtube_url: "",
        description: ""
    };

    const [videoData, setVideoData] = useState(initialState);

    // ============================
    // LOAD DATA
    // ============================
    useEffect(() => {
        loadVideos();
        loadCourses();
    }, []);

    const loadVideos = async () => {
        try {
            const res = await getAllVideos(); // Ensure backend SQL joins with 'courses' table
            if (res.status === "success") setVideos(res.data);
        } catch {
            toast.error("Failed to load videos");
        }
    };

    const loadCourses = async () => {
        try {
            const res = await getAllCourses();
            if (res.status === "success") setCourses(res.data);
        } catch {
            toast.error("Failed to load courses");
        }
    };

    // ============================
    // FILTER LOGIC (Client-Side)
    // ============================
    // This logic filters the existing 'videos' array based on the dropdown selection
    const filteredVideos = selectedFilter === "All courses" 
        ? videos 
        : videos.filter(v => v.course_name === selectedFilter);

    // ============================
    // EVENT HANDLERS
    // ============================
    const handleInput = (e) => {
        setVideoData({ ...videoData, [e.target.name]: e.target.value });
    };

    const onSave = async () => {
        if (!videoData.course_id || !videoData.title || !videoData.youtube_url) {
            return toast.warn("All fields except ID are required.");
        }

        try {
            let res = isEdit 
                ? await updateVideo(videoData) 
                : await addVideo(videoData);

            if (res.status === "success") {
                toast.success(res.message);
                resetForm();
                loadVideos();
            }
        } catch {
            toast.error("Operation failed");
        }
    };

    const onEdit = (v) => {
        setIsEdit(true);
        setVideoData({
            video_id: v.video_id,
            course_id: v.course_id,
            title: v.title,
            youtube_url: v.youtube_url,
            description: v.description
        });
    };

    const onDelete = async (id) => {
        if (window.confirm("Delete this video?")) {
            const res = await deleteVideo(id);
            if (res.status === "success") {
                toast.success(res.message);
                loadVideos();
            }
        }
    };

    const resetForm = () => {
        setIsEdit(false);
        setVideoData(initialState);
    };

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />

            <div className="container-fluid py-4 px-5">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: "#00c4e8", fontWeight: "300" }}>Admin – Manage Videos</h2>
                    <small className="text-muted">Attach videos to courses and maintain content library</small>
                </header>

                <div className="row">
                    {/* LEFT: VIDEO TABLE */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">Videos</h5>
                                
                                {/* UPDATED: Filter Dropdown logic */}
                                <div className="d-flex align-items-center gap-2">
                                    <label className="small text-muted mb-0">Filter:</label>
                                    <select 
                                        className="form-select form-select-sm w-auto"
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                    >
                                        <option value="All courses">All courses</option>
                                        {courses.map(c => (
                                            <option key={c.course_id} value={c.course_name}>
                                                {c.course_name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="badge bg-info text-white ms-2">
                                        {filteredVideos.length} total
                                    </span>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ fontSize: ".85rem" }}>
                                    <thead className="table-light text-secondary">
                                        <tr>
                                            <th>ID</th>
                                            <th>Course</th>
                                            <th>Title</th>
                                            <th>Link</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Use 'filteredVideos' instead of 'videos' */}
                                        {filteredVideos.map((v) => (
                                            <tr key={v.video_id}>
                                                <td>{v.video_id}</td>
                                                <td className="fw-bold">{v.course_name}</td>
                                                <td>{v.title}</td>
                                                <td>
                                                    <a href={v.youtube_url} target="_blank" rel="noreferrer" className="text-decoration-none text-info">
                                                        View
                                                    </a>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(v)}>Edit</button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(v.video_id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ADD / EDIT FORM */}
                    <div className="col-lg-5 mt-4 mt-lg-0">
                        <div className="card shadow-sm border-0 p-4">
                            <h5 className="fw-bold mb-4">{isEdit ? "Update Video" : "Add New Video"}</h5>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small text-muted">Course</label>
                                    <select
                                        name="course_id"
                                        className="form-select"
                                        value={videoData.course_id}
                                        onChange={handleInput}
                                    >
                                        <option value="">Select course</option>
                                        {courses.map((c) => (
                                            <option key={c.course_id} value={c.course_id}>
                                                {c.course_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small text-muted">Title</label>
                                    <input type="text" name="title" className="form-control" value={videoData.title} onChange={handleInput} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small text-muted">YouTube URL</label>
                                    <input type="text" name="youtube_url" className="form-control" value={videoData.youtube_url} onChange={handleInput} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small text-muted">Description</label>
                                    <textarea name="description" className="form-control" rows="3" value={videoData.description} onChange={handleInput}></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    <button className="btn btn-info w-100 text-white fw-bold py-2" onClick={onSave}>
                                        {isEdit ? "Update Video" : "Add Video"}
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

export default ManageVideos;
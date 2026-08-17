import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAllEnrolledStudents, getAllCourses } from "../services/userservice";
import { toast } from "react-toastify";

const StudentsList = () => {
    const [allData, setAllData] = useState([]); // Raw data from backend
    const [courses, setCourses] = useState([]);
    
    // Filter States
    const [selectedCourse, setSelectedCourse] = useState("All courses");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Registration date");
    const [sortOrder, setSortOrder] = useState("Asc");

    const loadInitialData = async () => {
        try {
            const studentRes = await getAllEnrolledStudents();
            const courseRes = await getAllCourses();
            
            // Backend returns data in result format
            if (studentRes.status === "success") setAllData(studentRes.data);
            if (courseRes.status === "success") setCourses(courseRes.data);
        } catch {
            toast.error("Failed to fetch students list");
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadInitialData();
        };
        init();
    }, []);

    // ============================
    // FILTER & SEARCH LOGIC
    // ============================
    const filteredAndSortedStudents = allData
        .filter(item => item.reg_no !== null) // Only show students (ignore courses with 0 students from LEFT JOIN)
        .filter(item => {
            const matchesCourse = selectedCourse === "All courses" || item.course_name === selectedCourse;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                item.sname.toLowerCase().includes(searchLower) || 
                item.email.toLowerCase().includes(searchLower) || 
                item.mobile_no.includes(searchLower);
            return matchesCourse && matchesSearch;
        })
        .sort((a, b) => {
            let valA = sortBy === "Registration date" ? a.reg_no : a.sname.toLowerCase();
            let valB = sortBy === "Registration date" ? b.reg_no : b.sname.toLowerCase();
            
            if (sortOrder === "Asc") return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Navbar />
            
            <div className="container-fluid py-4 px-5">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: "#00c4e8", fontWeight: "300" }}>Admin – Registered Students</h2>
                    <small className="text-muted">View and filter students registered per course</small>
                </header>

                {/* Filters Bar */}
                <div className="card shadow-sm border-0 mb-4 p-3">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Course</label>
                            <select 
                                className="form-select" 
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option>All courses</option>
                                {courses.map(c => <option key={c.course_id} value={c.course_name}>{c.course_name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small text-muted">Search</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search by name, email or mobile"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Sort By</label>
                            <select 
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option>Registration date</option>
                                <option>Name</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <button 
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setSortOrder(sortOrder === "Asc" ? "Desc" : "Asc")}
                            >
                                {sortOrder}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="card shadow-sm border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Course</th>
                                    <th className="pe-4 text-end">Reg. No ▲</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedStudents.length > 0 ? (
                                    filteredAndSortedStudents.map((s) => (
                                        <tr key={`${s.reg_no}-${s.course_id}`}>
                                            <td className="ps-4 fw-bold">{s.sname}</td>
                                            <td className="ps-4 fw-bold">{s.email}</td>
                                            <td className="ps-4 fw-bold">{s.mobile_no}</td>
                                            <td>
                                                <span className="badge bg-light text-dark border">{s.course_name}</span>
                                            </td>
                                            <td className="pe-4 text-end fw-bold">{s.reg_no}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No students found matching current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentsList;
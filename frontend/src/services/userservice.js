import api from '../api/axios';

// Helper to get the token for protected routes
const getAuthHeader = () => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    };
};

// ================= USER & PUBLIC SERVICE =================

export async function loginUser(email, upass) {
    const URL = "/users/user/signin";
    const body = { email, upass };
    const response = await api.post(URL, body);
    return response.data;
}

export async function registerUser(email) {
    const URL = '/users/user/signup';
    const body = { email };
    const response = await api.post(URL, body);
    return response.data;
}

export async function allcourses() {
    const URL = '/courses/coursesall'; 
    const response = await api.post(URL); 
    return response.data;
}

export async function studentregister(sname, email, mobile_no, course_id) {
    const URL = '/students/registerstudent';
    const body = { sname, email, mobile_no, course_id };
    const response = await api.post(URL, body);
    return response.data;
}

// ================= PROTECTED STUDENT SERVICE =================

export async function mycourses(email) {
    const URL = '/students/getcoursesofmystudentemail';
    const body = { email };
    const response = await api.post(URL, body, getAuthHeader()); 
    return response.data;
}

export async function getAllEnrolledStudents() {
    const URL = '/students/allenrolledstudentsbycourse';
    const response = await api.get(URL, getAuthHeader());
    return response.data;
}

// ================= PROTECTED COURSE SERVICE =================

export async function getAllCourses() {
    const URL = '/courses/coursesall';
    const response = await api.post(URL, {}, getAuthHeader());
    return response.data;
}

export async function addCourse(course) {
    const URL = '/courses/addcourses';
    const response = await api.post(URL, course, getAuthHeader());
    return response.data;
}

export async function updateCourse(course) {
    const URL = '/courses/updatecourses';
    const response = await api.put(URL, course, getAuthHeader());
    return response.data;
}

export async function deleteCourse(course_id) {
    const URL = '/courses/delcourses';
    const response = await api.delete(URL, { 
        ...getAuthHeader(), 
        data: { course_id } 
    });
    return response.data;
}

// ================= PROTECTED VIDEOS SERVICE =================

export async function getAllVideos(course_id) {
    const URL = '/videos/getvideos';
    const response = await api.get(URL, { 
        ...getAuthHeader(), 
        data: { course_id } 
    });
    return response.data;
}

export async function addVideo(video) {
    const URL = '/videos/addvideos';
    const response = await api.post(URL, video, getAuthHeader());
    return response.data;
}

export async function updateVideo(video) {
    const URL = '/videos/updatevideos';
    const response = await api.put(URL, video, getAuthHeader());
    return response.data;
}

export async function deleteVideo(video_id) {
    const URL = '/videos/deletevideos';
    const response = await api.delete(URL, { 
        ...getAuthHeader(), 
        data: { video_id } 
    });
    return response.data;
}

export async function getVideosByCourse(course_id) {
    const URL = '/videos/getvideosbycourse';
    const body = { course_id };
    const response = await api.post(URL, body, getAuthHeader()); 
    return response.data;
}

export async function updateStudentPassword(passwordData) {
    const URL = '/students/updatestudentpassword';
    const response = await api.put(URL, passwordData, getAuthHeader());
    return response.data;
}

export async function updateProfilePic(formData) {
    const URL = '/students/updateprofilepic';
    const response = await api.put(URL, formData, {
        headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function getProfilePic(reg_no) {
    const URL = `/students/getprofilepic/${reg_no}`;
    const response = await api.get(URL, {
        ...getAuthHeader(),
        responseType: 'arraybuffer' 
    });
    return response.data;
}
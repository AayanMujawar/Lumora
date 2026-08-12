import axios from 'axios'
import config from './config'

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
    const URL = config.BASE_URL + "/users/user/signin"
    const body = { email, upass }
    const response = await axios.post(URL, body)
    return response.data
}

export async function registerUser(email) {
    const URL = config.BASE_URL + '/users/user/signup'
    const body = { email }
    const response = await axios.post(URL, body)
    return response.data
}

export async function allcourses() {
    const URL = config.BASE_URL + '/courses/coursesall'; 
    const response = await axios.post(URL); 
    return response.data;
}

export async function studentregister(sname, email, mobile_no, course_id) {
    const URL = config.BASE_URL + '/students/registerstudent';
    const body = { sname, email, mobile_no, course_id };
    // You mentioned you commented out @jwt_required for this, so no token needed.
    const response = await axios.post(URL, body);
    return response.data;
}
// services/userservice.js

// export async function studentregister(sname, email, mobile_no, course_id) {
//     const URL = config.BASE_URL + '/students/registerstudent';
    
//     // Create the body object
//     const body = { 
//         sname,      
//         email, 
//         mobile_no, 
//         course_id  
//     };
    
//     // Note: If @jwt_required is active on this route in Python, 
//     // you MUST include getAuthHeader()
//     const response = await axios.post(URL, body); 
//     return response.data;
// }

// ================= PROTECTED STUDENT SERVICE =================

// services/userservice.js
export async function mycourses(email) {
    const URL = config.BASE_URL + '/students/getcoursesofmystudentemail';
    const body = { email };
    // Third argument must be the config object containing headers
    const response = await axios.post(URL, body, getAuthHeader()); 
    return response.data;
}

export async function getAllEnrolledStudents() {
    const URL = config.BASE_URL + '/students/allenrolledstudentsbycourse';
    // Requires token for Admin access
    const response = await axios.get(URL, getAuthHeader());
    return response.data;
}

// ================= PROTECTED COURSE SERVICE =================

export async function getAllCourses() {
    const URL = config.BASE_URL + '/courses/coursesall';
    const response = await axios.post(URL, {}, getAuthHeader());
    return response.data;
}

export async function addCourse(course) {
    const URL = config.BASE_URL + '/courses/addcourses';
    const response = await axios.post(URL, course, getAuthHeader());
    return response.data;
}

export async function updateCourse(course) {
    const URL = config.BASE_URL + '/courses/updatecourses';
    const response = await axios.put(URL, course, getAuthHeader());
    return response.data;
}

export async function deleteCourse(course_id) {
    const URL = config.BASE_URL + '/courses/delcourses';
    // For DELETE, merge headers and data into one config object
    const response = await axios.delete(URL, { 
        ...getAuthHeader(), 
        data: { course_id } 
    });
    return response.data;
}

// ================= PROTECTED VIDEOS SERVICE =================

export async function getAllVideos(course_id) {
    const URL = config.BASE_URL + '/videos/getvideos';
    // Your backend uses .get_json() for this GET route
    const response = await axios.get(URL, { 
        ...getAuthHeader(), 
        data: { course_id } 
    });
    return response.data;
}

export async function addVideo(video) {
    const URL = config.BASE_URL + '/videos/addvideos';
    const response = await axios.post(URL, video, getAuthHeader());
    return response.data;
}

export async function updateVideo(video) {
    const URL = config.BASE_URL + '/videos/updatevideos';
    const response = await axios.put(URL, video, getAuthHeader());
    return response.data;
}

export async function deleteVideo(video_id) {
    const URL = config.BASE_URL + '/videos/deletevideos';
    const response = await axios.delete(URL, { 
        ...getAuthHeader(), 
        data: { video_id } 
    });
    return response.data;
}




// Add to services/userservice.js

export async function getVideosByCourse(course_id) {
    const URL = config.BASE_URL + '/videos/getvideosbycourse';
    const body = { course_id };
    
    // Pass the body and the auth header if the user is logged in
    const response = await axios.post(URL, body, getAuthHeader()); 
    return response.data;
}



// services/userservice.js

export async function updateStudentPassword(passwordData) {
    const URL = config.BASE_URL + '/students/updatestudentpassword';
    // The backend requires reg_no, old_upass, and new_upass in the body
    const response = await axios.put(URL, passwordData, getAuthHeader());
    return response.data;
}


// Add to services/userservice.js
export async function updateProfilePic(formData) {
    const URL = config.BASE_URL + '/students/updateprofilepic';
    const response = await axios.put(URL, formData, {
        headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data' // Required for file uploads
        }
    });
    return response.data;
}



// Add this to services/userservice.js

export async function getProfilePic(reg_no) {
    const URL = config.BASE_URL + `/students/getprofilepic/${reg_no}`;
    // We must use arraybuffer to handle the raw binary image data
    const response = await axios.get(URL, {
        ...getAuthHeader(),
        responseType: 'arraybuffer' 
    });
    return response.data;
}
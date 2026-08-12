from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from routes import courses
from utils.dbconnection import  execute 
from utils.utils import createResult,enableJWT
from passlib.hash import sha256_crypt
crypto = sha256_crypt

studentsRouter = Blueprint("students", __name__, url_prefix="/students")


@studentsRouter.get("/allenrolledstudentsbycourse")
def getAllStudentsByCourse():
    # बदल: s.email आणि s.mobile_no दोन्ही सिलेक्ट केले आहेत
    sql = """
        SELECT c.*, s.reg_no, s.sname, s.email, s.mobile_no 
        FROM courses c
        LEFT JOIN students s ON s.course_id = c.course_id
        ORDER BY c.course_id
    """
    result = execute(sql, ())
    return jsonify(status="success", data=result)


#TESTED
@studentsRouter.post("/registerstudent")
# @jwt_required()
def addStudent():
    try:
        data = request.get_json() or {}
        email = data.get("email")
        sname = data.get("sname")
        mobile_no = data.get("mobile_no")
        course_id = data.get("course_id")

        if not email or not sname or not mobile_no or not course_id:
            return jsonify(status="error", message="All fields (Name, Email, Mobile, Course) are required")

        chksql = "select email from users where email=%s"
        chkparams = (email,)
        chkresult = execute(chksql, chkparams)

        if len(chkresult) == 0:
            sql = "INSERT INTO users(email, upass, urole) VALUES(%s, %s, %s)"
            encpass = crypto.hash("Student123")
            params = (email, encpass, "Student")
            execute(sql, params)

            sql = "INSERT INTO students(sname, email, mobile_no, course_id) VALUES(%s, %s, %s, %s)"
            params = (sname, email, mobile_no, course_id)
            execute(sql, params)

            return jsonify(status="success", message="Student registered successfully")
        else:
            chksql = "SELECT email FROM students WHERE email=%s AND course_id=%s"
            chkparams = (email, course_id)
            chkresult = execute(chksql, chkparams)

            if len(chkresult) == 0:
                sql = "INSERT INTO students(sname, email, mobile_no, course_id) VALUES(%s, %s, %s, %s)"
                params = (sname, email, mobile_no, course_id)
                execute(sql, params)
                return jsonify(status="success", message="Registered for new course successfully")
            else:
                return jsonify(status="error", message="You are already registered for this course")
    except Exception as e:
        return jsonify(status="error", message=str(e))
#TESTED


@studentsRouter.put("/updatestudentpassword")
@jwt_required()
def updateStudentpassword():
    reg_no = request.json["reg_no"]
    old_password = request.json["old_upass"]
    new_password = request.json["new_upass"]

    sql = "SELECT U.upass FROM students S , users U WHERE S.email = U.email AND S.reg_no = %s"
    result = execute(sql, (reg_no,))

    if len(result) == 0:
        return jsonify(status="error", message="Invalid reg_no")

    stored_hash = result[0]["upass"]
    success = crypto.verify(old_password, stored_hash)

    if not success:
        return jsonify(status='error', message="Old password does not match")

    new_hash = crypto.hash(new_password)

    sql = "UPDATE users U, students S SET U.upass = %s WHERE S.email = U.email AND S.reg_no = %s"
    execute(sql, (new_hash, reg_no))

    return jsonify(status="success", message="Password updated successfully")



#TESTED
@studentsRouter.post("/getcoursesofmystudentemail")
@jwt_required()
def getcoursesofmystudentemail():
    # Ensure you are getting the email correctly from request.json
    data = request.get_json()
    email = data.get("email")
    
    # Query with explicit JOIN and ordering
    sql = """
        SELECT S.reg_no, C.* FROM students S 
        JOIN courses C ON S.course_id = C.course_id 
        WHERE S.email = %s
    """
    result = execute(sql, (email,))
    return jsonify(status="success", data=result)


@studentsRouter.get("/getmystudentscoursesanditsvideosdetails")
@jwt_required()
def getmystudentscoursesanditsvideosdetails():
    email = request.get_json().get("email")
    sql = "SELECT * FROM students S , courses C, videos V WHERE S.course_id = C.course_id and C.course_id = V.course_id and S.email = %s"
    params = (email,)
    result = execute(sql, params)
    return jsonify(status="success", data=result)

@studentsRouter.get("/getallstudentsforcourseid")
@jwt_required()
def getAllStudentsForCourseId():
    course_id = request.get_json().get("course_id")
    sql = "SELECT * FROM students WHERE course_id = %s"
    params = (course_id,)
    result = execute(sql, params)
    return jsonify(status="success", data=result)


# Add to your students blueprint
@studentsRouter.get("/getprofilepic/<int:reg_no>")
@jwt_required()
def getProfilePic(reg_no):
    # Fetch only the profile_pic column
    sql = "SELECT profile_pic FROM students WHERE reg_no = %s"
    result = execute(sql, (reg_no,))
    
    if len(result) > 0 and result[0]['profile_pic']:
        # Return the raw BLOB data
        return result[0]['profile_pic']
    else:
        return jsonify(status="error", message="No profile picture found")


# Add this to your studentsRouter in students.py
@studentsRouter.put("/updateprofilepic")
@jwt_required()
def updateProfilePic():
    # 1. Capture the image file and reg_no from the multipart form
    reg_no = request.form.get("reg_no")
    file = request.files.get("profile_pic")
    
    # 2. Validation to ensure data was received
    if not reg_no:
        return jsonify(status="error", message="Registration number is missing")
    if not file:
        return jsonify(status="error", message="No image file uploaded")

    # 3. Read the file as binary data for the LONGBLOB column
    blob_data = file.read()
    
    # 4. Execute the update query
    try:
        sql = "UPDATE students SET profile_pic = %s WHERE reg_no = %s"
        execute(sql, (blob_data, reg_no))
        return jsonify(status="success", message="Profile picture updated successfully")
    except Exception as e:
        return jsonify(status="error", message=str(e))




if __name__ == "__main__":
    studentsRouter.run(debug=True)
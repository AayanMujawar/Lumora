from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
import mysql.connector
import os   
from passlib.hash import sha256_crypt
crypto = sha256_crypt
from utils.dbconnection import  execute
from utils.utils import createResult, enableJWT

coursesRouter = Blueprint("courses", __name__, url_prefix="/courses")




#TESTED
@coursesRouter.post("/coursesall")

def get_all_courses():
    query = "SELECT * FROM courses"
    courses = execute(query, ())
    return jsonify(status="success", data=courses)


#TESTED
@coursesRouter.get("/getdateallcourses")
def getcourse_on_date_print_courses():
    

    start_date = request.get_json().get("start_date")
    end_date = request.get_json().get("end_date")     
    query = "SELECT * FROM courses WHERE start_date >= %s AND end_date <= %s"
    courses = execute(query, (start_date, end_date))
    return jsonify(status="success", data=courses)




#TESTED
@coursesRouter.post("/addcourses")
@jwt_required()

def addCourse():
    course_name = request.json.get("course_name")
    description = request.json.get("description")
    fees = request.json.get("fees")
    start_date = request.json.get("start_date")
    end_date = request.json.get("end_date")
    video_expire_days = request.json.get("video_expire_days")

    query=f"INSERT INTO courses (course_name, description, fees, start_date, end_date, video_expire_days) VALUES (%s, %s, %s, %s, %s, %s)"
    execute(query, (course_name, description, fees, start_date, end_date, video_expire_days))
    return jsonify(status="success", message="Course added successfully")


#TESTED
@coursesRouter.put("/updatecourses")
@jwt_required()

def updateCourse():
    course_id = request.json.get("course_id")
    course_name = request.json.get("course_name")
    description = request.json.get("description")
    fees = request.json.get("fees")
    start_date = request.json.get("start_date")
    end_date = request.json.get("end_date")
    video_expire_days = request.json.get("video_expire_days")

    query=f"UPDATE courses SET course_name=%s, description=%s, fees=%s, start_date=%s, end_date=%s, video_expire_days=%s WHERE course_id=%s"
    execute(query, (course_name, description, fees, start_date, end_date, video_expire_days, course_id))
    return jsonify(status="success", message="Course updated successfully")

#TESTED
@coursesRouter.delete("/delcourses")
@jwt_required()

def deleteCourse():
    course_id = request.get_json().get("course_id")
    query="DELETE FROM courses WHERE course_id=%s"
    execute(query, (course_id, ))
    return jsonify(status="success", message="Course deleted successfully")

if __name__ == "__main__":
    coursesRouter.run(debug=True)
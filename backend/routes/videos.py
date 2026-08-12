from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
import mysql.connector
import os   
from passlib.hash import sha256_crypt
crypto = sha256_crypt
from utils.dbconnection import getconnection, execute
from utils.utils import createResult, enableJWT


videosRouter = Blueprint("videos", __name__, url_prefix="/videos")




# videosRouter = Flask(__name__)
# videosRouter.config["JWT_SECRET_KEY"] = "asdf_jkl"
# jwt_mgr = JWTManager(videosRouter)

#TESTED
@videosRouter.get("/getvideos")
@jwt_required()

def getVideos():
    query = "SELECT v.*, c.course_name FROM videos v JOIN courses c ON v.course_id = c.course_id"
    videos = execute(query, ())
    return jsonify(status="success", data=videos)


#TESTED
@videosRouter.post("/addvideos")
@jwt_required()

def addVideo():
    course_id = request.get_json().get("course_id")
    title = request.get_json().get("title")
    description= request.get_json().get("description")
    youtube_url = request.get_json().get("youtube_url")

    query=f"INSERT INTO videos (course_id, title, description, youtube_url) VALUES (%s, %s, %s, %s)"
    execute(query, (course_id, title, description, youtube_url))
    return jsonify(status="success", message="Video added successfully")

#TESTED
@videosRouter.put("/updatevideos")
@jwt_required()

def updateVideo():
    video_id = request.get_json().get("video_id")
    course_id = request.get_json().get("course_id")
    title = request.get_json().get("title")
    description= request.get_json().get("description")
    youtube_url = request.get_json().get("youtube_url")

    query=f"UPDATE videos SET title=%s, description=%s, youtube_url=%s, course_id=%s WHERE video_id=%s"
    execute(query, (title, description, youtube_url, course_id, video_id))
    return jsonify(status="success", message="Video updated successfully")


#TESTED
@videosRouter.delete("/deletevideos")
@jwt_required()

def deleteVideo():
    
    video_id = request.get_json().get("video_id")
    query="DELETE FROM videos WHERE video_id=%s"
    execute(query, (video_id, ))
    return jsonify(status="success", message="Video deleted successfully")



# In your videos blueprint file
@videosRouter.post("/getvideosbycourse")
def getVideosByCourse():
    # Fetch course_id from the JSON body
    course_id = request.json.get("course_id")
    if not course_id:
        return jsonify(status="error", message="Course ID is required")
        
    # Query to get videos for this specific course
    sql = "SELECT video_id, title, description, youtube_url FROM videos WHERE course_id = %s"
    videos = execute(sql, (course_id,))
    
    return jsonify(status="success", data=videos)


# @A2.get("/students")
# @jwt_required()

# def getAllStudents():
#     course_id = request.get_json().get("course_id")
#     query = "SELECT * FROM students WHERE course_id = %s"
#     students = executequery.execute(query, (course_id,))
#     return jsonify(status="success", data=students)





if __name__ == "__main__":
    videosRouter.run(debug=True)
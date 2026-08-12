import email
from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
import mysql.connector
import os   
from passlib.hash import sha256_crypt
crypto = sha256_crypt
from utils.dbconnection import execute,getconnection
from utils.utils import createResult, enableJWT





usersRouter = Blueprint("users", __name__, url_prefix="/users")

# usersRouter = Flask(__name__)
# usersRouter.config["JWT_SECRET_KEY"] = "asdf_jkl"
# jwt_mgr = JWTManager(usersRouter)

@usersRouter.post("/user/signup")
def Usignup():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify(status="error", message="Email address is required")

    # Check if user already exists
    sql_check = "SELECT email FROM Users WHERE email = %s"
    existing = execute(sql_check, (email,))
    if len(existing) > 0:
        return jsonify(status="error", message="User with this email already exists. Please login.")

    default_password = "Student123"
    encPassword = crypto.hash(default_password)

    sql = "INSERT INTO Users (email, upass, urole) VALUES (%s, %s, %s)"
    params = (email, encPassword, "Student")

    try:
        execute(sql, params)
        return jsonify(
            status="success",
            message="User signed up successfully",
            assigned_password=default_password
        )
    except Exception as e:
        return jsonify(status="error", message=str(e))


@usersRouter.post("/user/signin")
def Usignin():
    email = request.json.get("email")
    password = request.json.get("upass")
    
    # 1. Check if user exists in the users table
    sql = "select * from users where email = %s"
    result = execute(sql, (email,))
    
    if len(result) == 0:
        return jsonify(status="error", message="Invalid email or password")

    # 2. Verify password
    encPasswd = result[0]["upass"]
    if not crypto.verify(password, encPasswd):
        return jsonify(status="error", message="Invalid email or password")

    # 3. Identify Role and fetch reg_no if they are a Student
    user_data = result[0]
    urole = user_data["urole"]
    
    if urole == 'Student':
        # Query the students table to find the reg_no associated with this email
        student_info = execute("SELECT reg_no FROM students WHERE email = %s", (email,))
        if len(student_info) > 0:
            user_data["reg_no"] = student_info[0]['reg_no'] # Add reg_no to the result object
        else:
            user_data["reg_no"] = None
    else:
        # Admins or other roles don't have a reg_no in the students table
        user_data["reg_no"] = 0 

    # 4. Generate Token
    user_data["upass"] = "*****" # Hide password hash
    jwt = create_access_token(identity=email, expires_delta=False)
    user_data["token"] = jwt
    
    # Return the data including reg_no and token
    return jsonify(status="success", data=user_data)


@usersRouter.post("/Admin/signup")
def Asignup():
   
    if request.get_json().get("urole").lower() != "admin":
        return jsonify(status="error", message="Invalid role for admin signup")

    default_password = "Admin123"
    default_email = "Admin@gmail.com"

    encPassword = crypto.hash(default_password)

    sql = "SELECT * from Users where urole = 'Admin'"
    existing_admins = execute(sql , ())


    if len(existing_admins) > 0:
        return jsonify(status="error", message="Admin already exists")
    
    sql = "INSERT INTO Users (email, upass, urole) VALUES (%s, %s, %s)"
    params = (
        default_email,
        encPassword,
        "Admin"
    )

    execute(sql, params)

    return jsonify(
        status="success",
        message="User signed up successfully",
        assigned_password=default_password,
        assigned_email=default_email
    )


@usersRouter.post("/Admin/signin")
def Asignin():
    default_email = "Admin@gmail.com"
    sql = f"select * from users where email = %s and urole = 'Admin'"
    if(request.json["email"] != default_email):
        return jsonify(status="error", message="Invalid email for admin signin")
    result = execute(sql, (request.json["email"],))
    success = False

    if len(result) > 0: # user is found
        rawPasswd = request.json["upass"] # entered by user
        encPasswd = result[0]["upass"] # retrieved from db
        success = crypto.verify(rawPasswd, encPasswd)
    if not success:
        return jsonify(status="error", message="Invalid email or password")
    result[0]["upass"] = "*****"
    jwt = create_access_token(identity=request.json["email"],
                              expires_delta=False)
    result[0]["token"] = jwt
    return jsonify(status="success", data=result[0])


@usersRouter.get("/allactivecourses")
@jwt_required()
def allactivecourses():
    query = "SELECT * FROM courses WHERE CURDATE() BETWEEN start_date AND end_date"
    courses = execute(query, ())
    return jsonify(status="success", data=courses)

if __name__ == "__main__":
    usersRouter.run(debug=True)
# from flask import jsonify,request,Flask
# from utils.dbconnection import getconnection
# def execute(sql,par):
#     with getconnection() as conn:
#         with conn.cursor(dictionary=True) as cur:
#             cur.execute(sql , par)
#             if cur.description:
#                 return cur.fetchall()
#             else:
#                 conn.commit()
#                 return {f"affected rows :{cur.rowcount}"}
            
from flask import jsonify
from passlib.hash import sha256_crypt
from flask_jwt_extended import (JWTManager)

crypto = sha256_crypt

def createResult(error, data):
    if data:
        return jsonify(status="success", data=data)
    else: 
        return jsonify(status="error", error=error)

def enableJWT(app):
    app.config["JWT_SECRET_KEY"] = "secret-key"
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return createResult("Unauthorized", None), 200

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return createResult(f"Invalid token: {error}", None), 200

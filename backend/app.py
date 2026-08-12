from flask import Flask, request, jsonify

import os
from flask_cors import CORS
from routes.users import usersRouter
from routes.students import studentsRouter
from routes.courses import coursesRouter
from routes.videos import videosRouter
from utils.utils import createResult, enableJWT

app = Flask(__name__)
enableJWT(app)

@app.errorhandler(500)
def server_error(e):
    return createResult(repr(getattr(e, "original_exception", e)), None), 200

app.register_blueprint(usersRouter)
app.register_blueprint(studentsRouter)
app.register_blueprint(coursesRouter)
app.register_blueprint(videosRouter)
CORS(app)
print("Loaded blueprints:", app.blueprints.keys())
print(app.url_map)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

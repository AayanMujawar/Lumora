import os
import sys

# Ensure backend folder is in python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from backend.app import app

if __name__ == "__main__":
    app.run()

import os
import mysql.connector
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)
load_dotenv(os.path.join(BACKEND_DIR, ".env"))
load_dotenv()

CA_PATH = os.path.join(BACKEND_DIR, "cert", "ca.pem")
if not os.path.exists(CA_PATH):
    CA_PATH = os.path.join(BASE_DIR, "cert", "ca.pem")



def getconnection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_ca=CA_PATH,
        use_pure=True
    )


def execute(sql, par):
    with getconnection() as conn:
        with conn.cursor(dictionary=True) as cur:
            cur.execute(sql, par)

            if cur.description:
                return cur.fetchall()
            else:
                conn.commit()
                return {f"affected rows : {cur.rowcount}"}
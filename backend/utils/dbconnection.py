import mysql.connector

def getconnection():
    return mysql.connector.connect(
        host = "localhost",
        port = 3306,
        user = "root",
        password = "manager",
        database = "sunbeam_online_student_portal_db",
        use_pure = True
    )
def execute(sql,par):
    with getconnection() as conn:
        with conn.cursor(dictionary=True) as cur:
            cur.execute(sql , par)
            if cur.description:
                return cur.fetchall()
            else:
                conn.commit()
                return {f"affected rows :{cur.rowcount}"}
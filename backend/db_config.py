import pymysql

def get_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='',  # Replace with your actual MySQL password
        db='DB_Project',
        cursorclass=pymysql.cursors.DictCursor
    )

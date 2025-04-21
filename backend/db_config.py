import os
from flask_mysqldb import MySQL
from flask import Flask

def init_db(app: Flask):
    app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
    app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
    app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "")
    app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "clothing_store")

    return MySQL(app)

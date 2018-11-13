import os

from flask import Flask, session, render_template, request, redirect, url_for
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def checkIfUserExists(username):
    user = db.execute("SELECT * FROM users WHERE username = :username", {"username": username}).fetchone()
    if user == None:
        return False
    else:
        return True

def addUser(name, surname, username, password):
    db.execute("INSERT INTO users(name, surname, username, password) VALUES "
               "(:name, :surname, :username, :password)",
               {"name": name, "surname": surname, "username": username, "password": password})
    db.commit()

@app.route("/")
def index():
    if session.get("user_id") == None:
        return render_template("index.html")
    else:
        return redirect(url_for("books"))

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    passwordText = request.form.get("password")
    #todo: implement security check
    user = db.execute("SELECT * FROM users WHERE username = :username",
                      {"username": username}).fetchone()
    if user == None:
        return render_template("loginerror.html")
    elif not check_password_hash(user.password, passwordText):
        return render_template("loginerror.html")
    else:
        session["user_id"] = user.id
        return redirect(url_for("books"))

@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    surname = request.form.get("surname")
    username = request.form.get("username")
    passwordText = request.form.get("password")
    passwordHash = generate_password_hash(passwordText)
    if checkIfUserExists(username):
        return render_template("registererror.html")
    else:
        addUser(name, surname, username, passwordHash)
        return redirect(url_for('books'))

@app.route("/books")
def books():
    return "Books"
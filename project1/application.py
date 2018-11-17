import os
import requests

from flask import Flask, session, render_template, request, redirect, url_for, jsonify, abort
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

def checkIfRegistrationValid(name, surname, username, password):
    if (not name) or (not name.strip().isalpha()):
        return (False, "Name must consist of characters of latin alphabet")
    elif (not surname) or not surname.strip().isalpha():
        return (False, "Surname must consist of characters of latin alphabet")
    elif (not username) or " " in username.strip():
        return (False, "Username must not contain whitespaces")
    elif not password:
        return (False, "Password field must not be empty")
    elif len(password) < 7:
        return (False, "Password field must contain at least 7 characters")
    else:
        return (True, "")

def checkReview(text, rating):
    if not text or not rating:
        return False
    else:
        return True

def getApiInfo(isbn):
    apiKey = "U0751KevlHMnGM2Ky5cOw"
    goodreadsStats = requests.get("https://www.goodreads.com/book/review_counts.json",
                                  params={"key": apiKey, "isbns": isbn})
    return goodreadsStats

@app.route("/")
def index():
    if not 'user_id' in session or session["user_id"] == None:
        return render_template("index.html")
    else:
        return redirect(url_for("books"))

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    passwordText = request.form.get("password")
    user = db.execute("SELECT * FROM users WHERE username = :username",
                      {"username": username}).fetchone()
    if user == None:
        return render_template("loginerror.html", loginErrorMessage = "No such user")
    elif not check_password_hash(user.password, passwordText):
        return render_template("loginerror.html", loginErrorMessage = "Invalid password")
    else:
        session["user_id"] = user.id
        return redirect(url_for("books"))

@app.route("/logout", methods=["POST"])
def logout():
    session["user_id"] = None
    return redirect(url_for('index'))

@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    surname = request.form.get("surname")
    username = request.form.get("username")
    passwordText = request.form.get("password")
    passwordHash = generate_password_hash(passwordText)
    check = checkIfRegistrationValid(name, surname, username, passwordText)
    if not check[0]:
        return render_template("registererror.html", registerErrorMessage = check[1])
    elif checkIfUserExists(username):
        return render_template("registererror.html",
                               registerErrorMessage = "User with this username already exists, pick another one!")
    else:
        addUser(name, surname, username, passwordHash)
        user_id = db.execute("SELECT TOP 1 id FROM users ORDER BY id DESC")
        session["user_id"] = user_id
        return redirect(url_for('books'))

@app.route("/delete", methods=["POST"])
def deleteAccount():
    db.execute("DELETE FROM users WHERE id = :user_id", {"user_id": session["user_id"]})
    db.commit()
    session["user_id"] = None
    return redirect(url_for("index"))

@app.route("/books")
def books():
    if not 'user_id' in session or session["user_id"] == None:
        return redirect(url_for("index"))
    else:
        books = db.execute("SELECT * FROM books").fetchall()
        return render_template("books.html", books=books)

@app.route("/books/<int:book_id>")
def book(book_id):
    if not 'user_id' in session or session["user_id"] == None:
        return redirect(url_for("index"))
    else:
        book = db.execute("SELECT * FROM books WHERE id = :id", {"id": book_id}).fetchone()
        if not book == None:
            goodReadsInfo = getApiInfo(book.isbm).json()
            ratingsCount = goodReadsInfo["books"][0]["work_ratings_count"]
            averageRating = goodReadsInfo["books"][0]["average_rating"]
            reviews = db.execute("SELECT * FROM reviews JOIN users ON reviews.user_id = users.id WHERE book_id = :book_id LIMIT 10",
                                 {"book_id": book_id}).fetchall()
            return render_template("book.html", book = book, reviews = reviews, numberOfRatings = ratingsCount, averageRating = averageRating)
        else:
            return "Error"

@app.route("/books/search", methods=["GET"])
def search():
    if not 'user_id' in session or session["user_id"] == None:
        return redirect(url_for("index"))
    else:
        keyword = request.args.get("keyword")
        searchKey = '%' + keyword + '%'
        results = db.execute("SELECT * FROM books WHERE LOWER(title) LIKE LOWER(:keyword) OR LOWER(author) LIKE LOWER(:keyword) OR isbm LIKE :keyword",
                             {"keyword": searchKey}).fetchall()
        return render_template("books.html", books = results)

grades = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5}

@app.route("/books/<int:book_id>/submit", methods=["POST"])
def submitReview(book_id):
    userId = session["user_id"]
    reviewByThisUser = db.execute("SELECT * FROM reviews WHERE user_id = :user_id AND book_id = :book_id",
                                  {"user_id": userId, "book_id": book_id}).fetchone()
    if reviewByThisUser == None:
        reviewText = request.form.get("text")
        rating = grades[request.form.get("rating")]
        if checkReview(reviewText, rating):
            db.execute("INSERT INTO reviews (user_id, book_id, text, rating) VALUES (:user_id, :book_id, :text, :rating)",
                       {"user_id": userId, "book_id": book_id, "text": reviewText, "rating": rating})
            db.commit()
            return redirect(url_for('book', book_id = book_id))
        else:
            return "Fields mus not be empty"
    else:
        return "You have already submitted form for this book"

@app.route("/api/<string:isbm>")
def returnApi(isbm):
    book = db.execute("SELECT * FROM books WHERE isbm = :isbm", {"isbm": isbm}).fetchone()
    if book == None:
        return abort(404)
    else:
        reviews = db.execute("SELECT COUNT(*), AVG(rating) FROM reviews WHERE book_id = :book_id",
                             {"book_id": book.id}).fetchone()
        if not reviews:
            return jsonify(title=book.title, author=book.author, year=book.year, isbm=book.isbm,
                       reviews_count=0, average_rating=0)
        else:
            return jsonify(title=book.title, author=book.author, year=book.year, isbm=book.isbm,
                       reviews_count=reviews.count, average_rating=reviews.avg)



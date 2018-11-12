import os
import csv

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine(os.getenv("DATABASE_URL")) # database engine object from SQLAlchemy that manages connections to the database
                                                    # DATABASE_URL is an environment variable that indicates where the database lives
db = scoped_session(sessionmaker(bind=engine))    # create a 'scoped session' that ensures different users' interactions with the
                                                    # database are kept separate
db.execute("CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR, isbm VARCHAR, author VARCHAR, year INTEGER)")
db.execute("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR, surname VARCHAR, username VARCHAR, password VARCHAR)")
db.execute("CREATE TABLE reviews (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users, book_id INTEGER REFERENCES books, rating INTEGER, text TEXT)")
db.execute("ALTER TABLE reviews ADD CONSTRAINT uq_Review UNIQUE(user_id, book_id)")

file = open("books.csv")
reader = csv.reader(file)
for isbm, title, author, year in reader:
    year = int(year)
    db.execute("INSERT INTO books (isbm, title, author, year) VALUES (:isbm, :title, :author, :year)",
               {"isbm": isbm, "title": title, "author": author, "year": year})
db.commit()

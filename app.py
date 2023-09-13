from flask import Flask, jsonify, render_template, request, url_for, session
from database import get_db, close_db
from flask_session import Session
from database import get_db, close_db

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/meatball_game")
def meatball_game():
    return render_template("meatball_game.html")

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])
    db = get_db
    db.execute("""INSERT INTO leaderboard (score,) VALUES (?,);""",(score))
    db.commit()
    return render_template("meatball_game.html")

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    score = db.execute("""SELECT * FROM leaderboard;""").fetchall() #gets a list
    return render_template("leaderboard.html", score=score)

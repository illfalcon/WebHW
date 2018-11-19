import os

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

class Channel:
    def __init__(self, name, creator):
        self.name = name
        self.creator = creator
        self.users = []
        self.users.append(creator)
        self.messages = []

class Message:
    def __init__(self, sender, text):
        self.sender = sender
        self.text = text


listOfChannels = []

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('create channel')
def createChannel(data):
    channelName = data["channelName"]
    channelCreator = data["channelCreator"]
    newChannel = Channel(channelName, channelCreator)
    listOfChannels.append(newChannel)
    emit('announce channel', {'channelName': channelName}, broadcast=True)

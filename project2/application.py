import os

from flask import Flask, render_template, jsonify, request
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

    def serialize(self):
        return {'name': self.name,
        'creator': self.creator}

class Message:
    def __init__(self, sender, text):
        self.sender = sender
        self.text = text


listOfChannels = []

@app.route("/")
def index():
    return render_template("index.html", allChannels = listOfChannels)

@app.route("/refresh_your_channels", methods=["POST"])
def refreshYourChannels():
    username = request.form.get('username')
    yourChannels = list(filter(lambda x: username in x.users, listOfChannels))
    return jsonify({"channels": [c.serialize() for c in yourChannels]})


@socketio.on('create channel')
def createChannel(data):
    channelName = data["channelName"]
    channelCreator = data["channelCreator"]
    newChannel = Channel(channelName, channelCreator)
    listOfChannels.append(newChannel)
    emit('announce channel', {'channelName': channelName}, broadcast=True)

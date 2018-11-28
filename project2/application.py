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

    def serialize(self):
        return {'sender': self.sender,
        'text': self.text}


listOfChannels = []

@app.route("/")
def index():
    return render_template("index.html", allChannels = listOfChannels)

@app.route("/display_messages", methods=["POST"])
def displayMessages():
    channelName = request.form.get('channelName')
    neededChannel = None;
    for channel in listOfChannels:
        if channel.name == channelName:
            neededChannel = channel
            break
    return jsonify({'messages': [m.serialize() for m in neededChannel.messages]})

@app.route("/display_your_channels", methods=["POST"])
def displayYourChannels():
    username = request.form.get('username')
    yourChannels = list(filter(lambda x: username in x.users, listOfChannels))
    return jsonify({"channels": [c.serialize() for c in yourChannels]})

@app.route("/display_all_channels", methods=["POST"])
def displayAllChannels():
    username = request.form.get('username')
    otherChannels = list(filter(lambda x: username not in x.users, listOfChannels))
    return jsonify({"channels": [c.serialize() for c in otherChannels]})

@socketio.on('create channel')
def createChannel(data):
    channelName = data["channelName"]
    channelCreator = data["channelCreator"]
    newChannel = Channel(channelName, channelCreator)
    listOfChannels.append(newChannel)
    emit('announce channel', {'channelName': channelName, 'channelCreator': channelCreator}, broadcast=True)

@socketio.on('message sent')
def sendMessage(data):
    channelName = data["channelName"]
    sender = data["messageSender"]
    text = data["messageText"]
    channel = None;
    for c in listOfChannels:
        if c.name == channelName:
            channel = c
            break
    message = Message(sender, text)
    channel.messages.append(message)
    emit ('announce message', {'channel': channelName, 'sender': sender, 'text': text}, broadcast=True)

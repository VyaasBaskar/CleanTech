from flask import Flask, request
from flask_cors import CORS

from tinydb import TinyDB, Query
db_location = TinyDB('./db_location.json')
location = Query()

db_event = TinyDB('./db_event.json')
event = Query()

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/getCoords', methods=['GET'])
def getCoords():
    return {'coords': db_location.all()}

@app.route('/setCoords', methods=['POST'])
def setCoords():
    # {
    #   "c": "#FFF21", # color
    #   "coords": [12, 15], # lat, long eg 37.3230° N, 122.0322° W = [-122.0322, 37.3230]
    #   "r": 2 # radius
    # }
    data = request.get_json()
    db_location.insert(data)
    return 'Data added to the database'

@app.route('/getEvents', methods=['GET'])
def getEvents():
    return {'events': db_event.all()}

@app.route('/setEvents', methods=['POST'])
def setEvents():
    # {
    #   "eventName": "Massachusets cupertino party",
    #   "addresss": "1280 Vista Dr",
    #   "time": "May 1, 5PM-6PM" 
    #   "description": "Bring water, gloves sanitation and anything else you need to clean up the street",
    # }
    data = request.get_json()
    db_event.insert(data)
    return 'Data added to the database'

if __name__ == '__main__':
    app.run()
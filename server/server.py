from flask import Flask, request, Response
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image

from tinydb import TinyDB, Query
db_location = TinyDB('./db_location.json')
location = Query()

db_event = TinyDB('./db_event.json')
event = Query()

app = Flask(__name__)
CORS(app)

@app.route('/getCoords', methods=['GET'])
def getCoords():
    return {'coords': db_location.all()}

@app.route('/post_drone_data', methods=['POST'])
def post_drone_data():
    try:
        r = request.get_json()

        print(r["gpsData"])

        decoded_image = base64.b64decode(r["image"])

        image = Image.open(BytesIO(decoded_image))
        image.save("./hi.png")

        db_location.insert(r)

        return Response()
    except:
        return Response()
    
@app.route('/getEvents', methods=['GET'])
def getEvents():
    return {'events': db_event.all()}

@app.route('/setEvents', methods=['POST'])
def setEvents():
    # {
    #   "eventName": "Massachusets cupertino party",
    #   "addresss": "1280 Vista Dr",
    #   "time": "1-2 hrs" 
    # }
    data = request.get_json()
    db_event.insert(data)

    decoded_image = base64.b64decode(data)

    image = Image.open(BytesIO(decoded_image))
    image.save("./hi.png")

    return 'Data added to the database'

if __name__ == '__main__':
    app.run("0.0.0.0", 3003)
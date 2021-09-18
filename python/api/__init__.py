# Justin Jake Jenna Blaine hackMIT2021

# Flask imports:
from flask import Flask
from flask_cors import CORS

# Helper imports:
import geocoder
from helpers import get_json


# Create the Flask app:
app = Flask(__name__)


# Configure the Flask app the flask app:
def create_app():
    CORS(app)
    app.config['SECRET_KEY'] = 'joe m'
    return app


# ------------------------------------------------------------------------
#                                 ROUTES
# ------------------------------------------------------------------------


# Route for collecting hurricane data:
@app.route('/get-hurricane-data', methods=['GET'])
def get_hurricane_data(name: str='kate'):
    """Get json data for a hurricane.

    name(string): the name of the hurricane.
    format -> <name>-<year>
    example:  KATE-2015
    """
    json_data = get_json(name)
    return json_data


"""
Idk how these will work yet, but they are being implemented:

get-current-location() to return coords for current location.

then need functions to calculate the distance from hurricanes
by either state (or county?)

"""

# Get the current location of the user:
@app.route('/get-user-location', methods=['GET'])
def get_user_location():
    """Get the current location of the user.

    Ideally needs to prompt user for permission first.
    """
    location = geocoder.ip('me')
    coords = { 'lat': location.latlng[0],
               'lng': location.latlng[1] }
    return coords


# Test:
@app.route('/test', methods=['GET'])
def test():
    pass

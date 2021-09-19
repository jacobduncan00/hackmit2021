# Justin Jake Jenna Blaine hackMIT2021

# Flask imports:
from flask import Flask, request, jsonify
from flask_cors import CORS

# Helper imports:
import geocoder
from helpers import get_json_data, get_json_counties, resource_reponse, get_json_data_multiple

# Create the Flask app:
app = Flask(__name__)
CORS(app)


# Configure the Flask app the flask app:
def create_app():
    app.config['SECRET_KEY'] = 'super secret key 169'
    return app


# ------------------------------------------------------------------------
#                                 ROUTES
# ------------------------------------------------------------------------


# Route for collecting hurricane data:
@app.route('/get-hurricane-data/<radius>/<name>/<year>', methods=['GET'])
def get_hurricane_data(radius, name, year):
    """Get json data for a hurricane.

    name(string): the name of the hurricane.
    format -> <name>-<year>
    example:  kate-2015
    ^ ignore for now
    """
    path, counties = get_json_data(int(radius), str(name), int(year))
    return {'data': [path, counties]}


# Route for collecting hurricane data:
@app.route('/get-hurricane-counties/<name>', methods=['GET'])
def get_hurricane_counties(name: str='kate'):
    """Get json counties for a hurricane.

    name(string): the name of the hurricane.
    format -> <name>-<year>
    example:  kate-2015
    ^ ignore for now
    """
    json_counties = get_json_counties(name)
    return json_counties


# Route for collecting live hurricane data>
@app.route('/get-live-hurricanes', methods=['GET'])
def get_live_hurricanes():
    json_data = get_json_data_multiple('active_storms')
    return json_data


"""
Idk how these will work yet, but they are being implemented:

get-current-location() to return coords for current location.

then need functions to calculate the distance from hurricanes
by either state (or county?)
"""


# Manually enter location without tracking:
@app.route('/manual-user-location', methods=['POST'])
def manual_user_location():
    """Location by county(?)

    """
    if request.method == 'GET':
        return 'wrong type'

    # Do something here eventually.
    if request.method == 'POST':
        pass


# Get the current location of the user:
@app.route('/get-user-location', methods=['GET', 'POST'])
def get_user_location():
    """Get the current location of the user.

    Ideally needs to prompt user for permission first.
    POST: give json with 'allow_tracking':'True' or 'False'
    """
    # Asked for permission I assume?
    if request.method == 'POST':
        # If given permission, tracks user ONCE:
        if request.json['allow_tracking'] == 'True':
            location = geocoder.ip('me')
            track_info = {
                    'track': 'success',
                    'lat': location.latlng[0],
                    'lng': location.latlng[1]
            }
            return track_info
        # Cannot track without permission:
        elif request.json['allow_tracking'] == 'False':
            return { 
                'track': 'failure',
                'lat': 'NaN',
                'lng': 'NaN'
            }

    # No idea what to do here yet
    if request.method == 'GET':
        return {
            'prompt':'Get current location ONCE?'
        }


# For requesting the data from a form.
@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    # Get resources based on their form responses:
    if request.method == 'POST':
        data = request.json
        response = jsonify(resource_reponse(data))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

# Justin Jake Jenna Blaine hackMIT2021

from flask import Flask
from flask_cors import CORS
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


# IDK what this will do yet.
@app.route('/', methods=['GET'])
def test():
    pass

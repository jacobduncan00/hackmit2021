# Justin Jake Jenna Blaine hackMIT2021

from flask import Flask
from flask_cors import CORS
from helpers import get_json

app = Flask(__name__)


def create_app():
    CORS(app)
    app.config['SECRET_KEY'] = 'joe m'
    return app


# ------------------------------------------------------------------------
#                                 ROUTES
# ------------------------------------------------------------------------


@app.route('/get-hurricane-data', methods=['GET', 'POST'])
def test(name:str='kate'):
    json_data = get_json(name)
    return json_data

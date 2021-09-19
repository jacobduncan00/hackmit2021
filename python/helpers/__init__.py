# Helper function package

# For handling json:
import json

# Used for accessing remote directories:
from os.path import abspath


# Get the json from the data directory.
def get_json_data(name: str='kate'):
    # Get the path to the json.
    path_to_json = abspath(f'../data/parsed_data/{name}.json')

    # Then open the json to grab useful data:
    with open(path_to_json, 'r') as json_file:
        data = json.load(json_file)

    # Get the coords into purely numerical form:
    convert_coords(json_data=data)
    return data


# Get the counties data:
def get_json_counties(name: str='kate'):
    # Get the path to the json.
    path_to_json = abspath(f'../data/parsed_data/{name}_damage.json')

    # Then open the json to grab useful data:
    with open(path_to_json, 'r') as json_file:
        data = json.load(json_file)

    return data


# Convert coords:
def convert_coords(json_data: str):
    """Converts coordinates to proper form:

    S latitude, W longitude are negative.

    Converts [40.7N, 45.4W] to [40.7, -45.4]
    """
    for state in json_data['data']:
        lat, lon = state['Latitude'], state['Longitude']
        state['Latitude'] = '-' + lat[:-1] if lat[-1] == 'S' else lat[:-1]
        state['Longitude'] = '-' + lon[:-1] if lon[-1] == 'W' else lon[:-1]

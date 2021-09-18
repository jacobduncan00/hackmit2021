# Helper function packages
import json
from os.path import abspath


# Get the json from the data directory.
def get_json(name: str='kate'):
    path_to_json = abspath(f'../data/parsed_data/{name}.json')
    with open(path_to_json, 'r') as json_file:
        data = json.load(json_file)

    # Get the coords into purely numerical form:
    convert_coords(json_data=data)
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

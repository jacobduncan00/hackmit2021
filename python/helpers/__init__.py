# Helper function package justin

# For handling json:
import json

# Used for accessing remote directories:
from os.path import abspath

# Imports for data manip:
import pandas as pd
import numpy as np
from math import radians
from sklearn.metrics.pairwise import haversine_distances


# Get the json from the data directory.
def get_json_data(radius, name, year):
    get_hurricane_data(radius, name, year)
    # Get the path to the json.
    path_to_json = abspath(f'../data/parsed_data/{name}.json')
    path_to_json2 = abspath(f'../data/parsed_data/{name}_damage.json')

    # Then open the json to grab useful data:
    with open(path_to_json, 'r') as json_file:
        data = json.load(json_file)

    with open(path_to_json2, 'r') as json_file2:
        data2 = json.load(json_file2)

    # Get the coords into purely numerical form:
    return data, data2


# Get the counties data:
def get_json_counties(name: str='kate'):
    # Get the path to the json.
    path_to_json = abspath(f'../data/parsed_data/{name}_damage.json')

    # Then open the json to grab useful data:
    with open(path_to_json, 'r') as json_file:
        data = json.load(json_file)

    return data


# Get multiple hurricanes:
def get_json_data_multiple(name:str):
    path_to_json = abspath(f'../data/parsed_data/{name}.json')

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


# This will return the resources based on questionnaire:
def resource_reponse(data):
    return {"Nothing":"To be implemented"}

# ========================================================
# BLAINES METHODS:
# ========================================================
data = pd.read_csv('../data/hurr_database/hur.csv', header=0, delimiter=',' ,parse_dates=['date_time'])
data = data.drop('Unnamed: 0', axis=1)
location = data[["Name", "Latitude", "Longitude", "Maximum_sustained_wind_in_knots", "Year"]]
location = location[35683:]

def get_hurricane_data(radius, name, year):
    hurricane = location[(location["Name"] == name) & (location["Year"] == year)]
    hurricane.to_json(f"../data/parsed_data/{name}.json", orient="table")
    atl_counties = pd.read_csv('../data/hurr_database/counties.csv', usecols=["county", "state", "lat", "lon"])
    atl_counties["distance_from_hurr"] = [''] * 731
    harmfulness(atl_counties, hurricane, radius, f"../data/parsed_data/{name}_damage.json")


def compute_distances_from_county(hurr, lat_county, lon_county):
    lat = list(hurr['Latitude'])
    lon = list(hurr['Longitude'])
    lat_in_radians = [radians(float(_)) for _ in lat]
    lon_in_radians = [radians(float(_)) for _ in lon]
    coords = list(zip(lat_in_radians, lon_in_radians))
    county = list((radians(lat_county), radians(lon_county)))
    distance = list()
    for i in range(0, len(lat_in_radians)):
        distance.append((haversine_distances([list(coords[i]), county])[1,0]) * 6371000/1000)
    return distance


def harmfulness(dataset, hurricane, radius, path):
    for index, row in dataset.iterrows():
        dist = compute_distances_from_county(hurricane, row[2], row[3])
        dataset.at[index, "distance_from_hurr"] = dist
    dataset["harmful"] = ["no"] * dataset.shape[0]
    for i in range(0, len(dataset)):
        if min(dataset["distance_from_hurr"].iloc[i]) < radius:
            dataset["harmful"].iloc[i] = "yes"
    send_to_jacob = dataset[dataset["harmful"] == "yes"]
    send_to_jacob["min_distance"] = [0] * send_to_jacob.shape[0]
    for i in range(0, len(send_to_jacob)):
        send_to_jacob["min_distance"].iloc[i] = min(send_to_jacob["distance_from_hurr"].iloc[i])
    temp = send_to_jacob[["lat", "lon", "min_distance"]].drop_duplicates()
    temp.to_json(path, orient="table")

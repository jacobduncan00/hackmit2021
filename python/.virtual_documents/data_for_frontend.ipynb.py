import pandas as pd
from math import radians
import numpy as np
import math
from sklearn.metrics.pairwise import haversine_distances


current_storm = pd.read_json("https://www.nhc.noaa.gov/CurrentStorms.json")





for i in range(0, len(current_storm)):
    current_storm["activeStorms"][i]


current_storm = pd.json_normalize(current_storm['activeStorms'])


current_storm[["name", "classification", "intensity", "pressure","latitudeNumeric","longitudeNumeric","movementDir","movementSpeed"]].to_json("../data/parsed_data/active_storms.json", orient="table")


def compute_distances_from_county(hurr, lat_county, lon_county):
    lat = list(hurr['Latitude'])
    lon = list(hurr['Longitude'])
    for i in range(0,len(hurr)):
        l = lat[i]
        lo = lon[i]
        if l[-1] == 'S':
            lat[i] = '-' + l[:-1]
        else:
            lat[i] = l[:-1]

        if lo[-1] == 'W':
            lon[i] = '-' + lo[:-1]
        else:
            lon[i] = lo[:-1]
    lat_in_radians = [radians(float(_)) for _ in lat]
    lon_in_radians = [radians(float(_)) for _ in lon]
    coords = list(zip(lat_in_radians, lon_in_radians))
    county = list((radians(lat_county), radians(lon_county)))
    distance = list()
    for i in range(0, len(lat_in_radians)):
        distance.append((haversine_distances([list(coords[i]), county])[1,0]) * 6371000/1000)
    return distance


def compute_distance_from_county(hurr, lat_county, lon_county):
    lat_in_radians = radians(hurr['latitudeNumeric'])
    lon_in_radians = radians(hurr['longitudeNumeric'])
    coords = [lat_in_radians, lon_in_radians]
    county = [radians(lat_county), radians(lon_county)]
    return ((haversine_distances([coords, county])[1,0]) * 6371000/1000)


counties = pd.read_csv('../data/hurr_database/counties.csv')


def harmfulness_past_storms(dataset, hurricane, radius, path):
    count = 0
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
    return temp


def harmfulness_current(dataset, hurricane, radius, path):
    count = 0
    for index, row in dataset.iterrows():
        dist = compute_distance_from_county(hurricane, row[2], row[3])
        dataset.at[index, "distance_from_hurr"] = dist
    dataset["harmful"] = ["no"] * dataset.shape[0]
    for i in range(0, len(dataset)):
        if dataset["distance_from_hurr"].iloc[i] < radius:
            dataset["harmful"].iloc[i] = "yes"
    send_to_jacob = dataset[dataset["harmful"] == "yes"]
    send_to_jacob["min_distance"] = [0] * send_to_jacob.shape[0]
    for i in range(0, len(send_to_jacob)):
        send_to_jacob["min_distance"].iloc[i] = min(send_to_jacob["distance_from_hurr"].iloc[i])
    temp = send_to_jacob[["lat", "lon", "min_distance"]].drop_duplicates()
    temp.to_json(path, orient="table")
    return temp


curr = current_storm[["name","latitudeNumeric","longitudeNumeric"]]


atl_counties


harmfulness_current(atl_counties, curr.loc[0], 300, "../data/parsed_data/temp.json")




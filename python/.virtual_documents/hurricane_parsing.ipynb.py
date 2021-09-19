import pandas as pd
from math import radians
from sklearn.metrics.pairwise import haversine_distances


data = pandas.read_csv('../data/hurr_database/hur.csv', header=0, delimiter=',' ,parse_dates=['date_time'])
data = data.drop('Unnamed: 0', axis=1)
location = data[["Name", "Latitude", "Longitude", "Maximum_sustained_wind_in_knots", "Year"]]
location = location[35683:]


def get_hurricane_data(radius, name, year):
    hurricane = location[(location["Name"] == name) & (location["Year"] == year)]
    hurricane.to_json(f"../data/parsed_data/{name}.json", orient="table")
    atl_counties = pd.read_csv('../data/hurr_database/counties.csv', usecols=["county", "state", "lat", "lon"])
    atl_counties["distance_from_hurr"] = [''] * 731
    harmfulness(atl_counties, hurricane, radius, f"../data/parsed_data/{name}_damage.json")


get_hurricane_data(100, "SANDY", 2012)


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
    count = 0
    for index, row in dataset.iterrows():
        dist = compute_distances_from_county(hurricane, row[2], row[3])
        dataset.at[index, "distance_from_hurr"] = dist
    dataset["harmful"] = ["no"] * dataset.shape[0]
    for i in range(0, len(dataset)):
        if min(dataset["distance_from_hurr"].iloc[i]) < radius:
            print(min(dataset["distance_from_hurr"].iloc[i]))
            dataset["harmful"].iloc[i] = "yes"
    send_to_jacob = dataset[dataset["harmful"] == "yes"]
    send_to_jacob["min_distance"] = [0] * send_to_jacob.shape[0]
    for i in range(0, len(send_to_jacob)):
        send_to_jacob["min_distance"].iloc[i] = min(send_to_jacob["distance_from_hurr"].iloc[i])
    temp = send_to_jacob[["lat", "lon", "min_distance"]].drop_duplicates()
    temp.to_json(path, orient="table")
    print(dataset)
    return temp




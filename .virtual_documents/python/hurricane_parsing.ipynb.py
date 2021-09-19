import pandas
import numpy 
import numpy.linalg as la
import geopandas as gpd
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import haversine_distances
from math import radians


data = pandas.read_csv('../data/hurr_database/atlantic.csv')


data.columns


location = data[["ID", "Name","Latitude", "Longitude", "Status", "Maximum Wind"]]
location = location[35683:]


hurr_SANDY = location[location["Name"] == '              SANDY']
hurr_SANDY.to_json("../data/parsed_data/sandy.json", orient="table")


location["Name"]


hurr_ANNA = location[location["ID"] == 'AL012015']


hurr_ANNA.to_json("../data/parsed_data/ana.json", orient="table")


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


distances = compute_distances_from_county(location, 38.3365, -75.0849)
location["distance_from_OC"] = distances
location["harmful"] = ['no'] * 13422


location[location["ID"] == ids_of_harmful_hurr[0]]


ids_of_harmful_hurr = location[location["distance_from_OC"] < 300]


ids_of_harmful_hurr


count = 0
for index, row in location.iterrows():
    if row[0] == ids_of_harmful_hurr[count]:
        location.at[index,'harmful'] = 'yes'
        if location.at[index+1,"ID"] get_ipython().getoutput("= ids_of_harmful_hurr[count]:")
            count = count + 1       


location.to_csv("training_data.csv")


atl_states = list(("Connecticut", "Delaware", "Florida",
"Georgia",
"Maine",
"Maryland",
"Massachusetts",
"New Hampshire",
"New Jersey",
"New York",
"North Carolina",
"Pennsylvania",
"Rhode Island",
"South Carolina",
"Virginia"))


current_storm = pandas.read_json("https://www.nhc.noaa.gov/CurrentStorms.json")


current_storm


current_storm = pandas.json_normalize(current_storm['activeStorms'])


current_storm.columns


fp = "../data/AL152021_lin.shp"
line = gpd.read_file(fp)


line


get_ipython().run_line_magic("matplotlib", " inline")
line.plot()


counties = pandas.read_csv('../data/hurr_database/US_counties_COVID19_health_weather_data.csv')


counties = counties[["county", "state", 'lat', "lon"]]


atl_counties = counties[counties.state.isin(atl_states)]


hurr_KATE = location[location["ID"] == 'AL122015']


lats = list(atl_counties["lat"])


longs = list(atl_counties["lon"])


for index, row in atl_counties.head().iterrows():
    print(row[2])


atl_counties


def harmfulness(dataset, hurricane, radius, path):
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





harmfulness(atl_counties, hurr_SANDY, 100, "../data/parsed_data/sandy_damage.json")




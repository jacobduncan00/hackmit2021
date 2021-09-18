# Helper function packages
import json

def get_json(name:str='kate'):
    with open(f'/Users/blaine-mason/Github/hackmit2021/python/helpers/{name}.json', 'r') as json_file:
        data = json.load(json_file)
    return data

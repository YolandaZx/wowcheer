#!/usr/bin/python

import json
from pprint import pprint
import urllib.request

in_filename = 'original/projects_orig.json'
out_filename ='projects.json'
prefix = 'project/project_'
attribute = 'main_poster_url'
max = 30
json_data=open(in_filename)
list = json.load(json_data)
count = 1;
for data in list:
	imageURL = data[attribute]
	print("fetching " + imageURL + "...")
	filename = prefix + str(count) +".png"
	imageData = urllib.request.urlretrieve(imageURL,filename)
	data[attribute] = filename
	data["ticket_prices"] = [100,200,300]
	count = count + 1
	if count > max:
		break

with open(out_filename, 'w') as outfile:
	json.dump(list, outfile)
	
#!/usr/bin/python

import json
from pprint import pprint
import urllib.request

in_filename = 'original/artists_orig.json'
out_filename ='artists.json'
prefix = 'artists/artist_'
attribute = 'poster'
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
	count = count + 1
	if count > max:
		break

with open(out_filename, 'w') as outfile:
	json.dump(list, outfile)
	
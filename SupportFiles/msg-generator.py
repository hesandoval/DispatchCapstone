import json
import  time
import datetime
import pytz
import uuid
import argparse

def linspace(a, b, num):
    if num < 2:
        return b
    diff = (float(b) - a)/(num - 1)
    return [diff * i + a  for i in range(num)]

num_samples = 100

# parser = argparse.ArgumentParser(description='User store latitude/longitude _start, _end')
# parser.add_argument('--latitude_start', action="store", dest="latitude_start", type=float, default=37.642714)
# parser.add_argument('--latitude_end', action="store", dest="latitude_end", type=float, default=-122.417522)
# parser.add_argument('--longitude_start', action="store", dest="longitude_start", type=float, default=37.643067)
# parser.add_argument('--longitude_end', action="store", dest="longitude_end", type=float, default=-122.417366)
# args = parser.parse_args()

# latitude_start = 37.642714 #degrees
# longitude_start = -122.417522

# latitude_end = 37.643067 #degrees
# longitude_end = -122.417366

parser = argparse.ArgumentParser(description='User store latitude/longitude _start, _end')
parser.add_argument('--latitude_start', action="store", help="latitude starting degree", dest="latitude_start", type=float, const=37.642714, default=37.642714)
parser.add_argument('--latitude_end', action="store", help="longitude starting degree", dest="latitude_end", type=float, const=-122.417522, default=-122.417522)
parser.add_argument('--longitude_start', action="store", help="latitude ending degree", dest="longitude_start", type=float, const=37.642714, default=37.643067)
parser.add_argument('--longitude_end', action="store", help="longitude starting degree", dest="longitude_end", type=float, const=-122.417522, default=-122.417366)
args = parser.parse_args()

latitude_start = args.latitude_start
longittude_start = args.longitude_start
latitude_end = args.latitude_start
longittude_end = args.longitude_start



elevation_start = .15 #meters
elevation_end = .1

battery_start = 90.0 #percentage
battery_end = 89.0

speed_start = 2.0 #mph
speed_end = 2.0

trip_id = str(uuid.uuid4())#UUID generator

start_time = time.ctime()
latitude = linspace(latitude_start, latitude_end, num=num_samples)
longitude = linspace(longitude_start, longitude_end, num=num_samples)
elevation = linspace(elevation_start, elevation_end, num=num_samples)
battery_percentage = linspace(battery_start, battery_end, num=num_samples)
speed = linspace(speed_start, speed_end, num=num_samples)


#calculate estimated times
tz = pytz.timezone('US/Pacific-New')
utc_datetime_start = tz.localize(datetime.datetime.utcnow())
total_time_seconds = num_samples/5
time_additions_seconds = linspace(0, total_time_seconds, num=num_samples)
time = [utc_datetime_start + datetime.timedelta(seconds = t) for t in time_additions_seconds]

msg_list = []
for i in xrange(0, num_samples):
    carry_data_current = {}
    carry_data_current["sender"] = "Carry1"
    carry_data_current["created"] = str(time[i].isoformat())
    current_location = {}
    current_location["latitude"] = latitude[i]
    current_location["longitude"] = longitude[i]
    current_location["elevation"] = elevation[i]
    carry_data_current["current_location"] = current_location
    carry_data_current["battery_life"] = battery_percentage[i]
    carry_data_current["speed"] = speed[i]
    carry_data_current["photograph"] = []
    carry_data_current["trip_id"] = trip_id

    if i == num_samples-1:
    	carry_data_current["completed"] = True#false if less than or eqaul to num_samples - 1
    else:
    	carry_data_current["completed"] = False    

    door_status = {}
    door_status["left_open"] = False
    door_status["right_open"] = False
    carry_data_current["door_status"] = door_status
    
    light_status = {}
    light_status["front_on"] = True
    light_status["back_on"] = True
    carry_data_current["light_status"] = light_status
    carry_data_current["waypoints"] = []
    for val in zip(latitude, longitude):
    	obj = {"latitude":val[0], "longitude":val[1]}
    	carry_data_current["waypoints"].append(obj)
    
    msg = {}
    msg["carry_data_current"] = carry_data_current
    msg_list.append(msg)

with open("messages.json", 'w') as fp:
  json.dump(msg_list, fp, sort_keys=True, indent=4, separators=(',', ': '))

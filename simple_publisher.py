# Import library paho-mqtt
import paho.mqtt.client as mqtt
from random import randint
import time
# Inisialisasi client
mqttc = mqtt.Client("rompanlcom", clean_session=False)

# Buat koneksi ke broker
#mqttc.username_pw_set("rompang.doni@gmail.com", "438134e9")
mqttc.connect("iot.eclipse.org", 1883)


lat = 40.7143528

# Publish message
count = 0
while True:
   
    lat = lat + 0.0001
    mqttc.publish("sensor/suhuts", payload=str(lat)+"#"+str(-74.0059731), qos=0, retain=False)
    print "publsihed",count
    count+=1
    time.sleep(1)
    


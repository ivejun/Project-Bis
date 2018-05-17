# Import library paho-mqtt
import paho.mqtt.client as mqtt
import json
import thread
# Inisiasi mqtt client

from collections import defaultdict

def handle_message_masuk(mqttc, obj, msg):
	print "Message baru : "+msg.payload+" dengan topik "+msg.topic



mqttc = mqtt.Client("rompang.doni@gmail.com", clean_session=False)

#Registrasi callback function
mqttc.on_message = handle_message_masuk
#mqttc.username_pw_set("rompang.doni@gmail.com", "438134e9")
# Buat koneksi ke broker
mqttc.connect("iot.eclipse.org", 1883)

# Subscribe dengan topik tertentu
mqttc.subscribe("sensor/suhut", qos=0)

# Looping subscriber
mqttc.loop_forever()	

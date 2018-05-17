#include <SoftwareSerial.h>
#include <TinyGPS.h>
#define TINY_GSM_MODEM_SIM800
#include <TinyGsmClient.h>
#include <PubSubClient.h>
#define SerialMon Serial
#define SerialAT Serial1

SoftwareSerial mySerial(10, 11);
TinyGPS gps;

void gpsdump(TinyGPS &gps);
void printFloat(double f, int digits = 2);
char* SendingPosition;

const char apn[]  = "internet";
const char user[] = "";
const char pass[] = "";
const char* broker = "iot.eclipse.org";
const char* topicInit = "sens/suh";
const char* k = "";

TinyGsm modem(SerialAT);
TinyGsmClient client(modem);
PubSubClient mqtt(client);

long lastReconnectAttempt = 0;

void setup()
{
  delay(1000);
  mySerial.begin(9600);
  SerialMon.begin(9600);
  delay(10);
  SerialAT.begin(9600);
  delay(3000);
  SerialMon.println("Initializing modem...");
  modem.restart();

  String modemInfo = modem.getModemInfo();
  SerialMon.print("Modem: ");
  SerialMon.println(modemInfo);

  SerialMon.print("Waiting for network...");

  if (!modem.waitForNetwork()) {
    SerialMon.println(" fail");
    while (true);
  }

  SerialMon.println(" OK");
  SerialMon.print("Connecting to ");
  SerialMon.print(apn);

  if (!modem.gprsConnect(apn, user, pass)) {
    SerialMon.println(" fail");
    while (true);
  }

  SerialMon.println(" OK");
  mqtt.setServer(broker, 1883);
}

void loop()
{
  bool newdata = false;
  while (mySerial.available())
  {
    char c = mySerial.read();
    //Serial.print(c);
    if (gps.encode(c))
    {
      newdata = true;
      break;
    }
  }

  if (mqtt.connected()) {
    mqtt.loop();
    if (newdata)
    {
      gpsdump(gps);
      delay(1000);
    }
  }
  else {
    unsigned long t = millis();
    if (t - lastReconnectAttempt > 10000L) {
      lastReconnectAttempt = t;
      if (mqttConnect()) {
        lastReconnectAttempt = 0;
      }
    }
  }

}
void gpsdump(TinyGPS & gps)
{
  float flat, flon;
  gps.f_get_position(&flat, &flon);
  String latitude = String(flat, 6);
  String longitude = String(flon, 6);
  String all = latitude + "#" + longitude;
  SendingPosition = all.c_str();
  mqtt.publish(topicInit, SendingPosition);
}

boolean mqttConnect() {
  SerialMon.print("Connecting to ");
  SerialMon.print(broker);
  if (!mqtt.connect("GsmClientTest")) {
    SerialMon.println(" fail");
    return false;
  }
  SerialMon.println(" OK");
  //mqtt.publish(topicInit, "GsmClientTest started");
  return mqtt.connected();

}


#include <WiFi.h>
#include <PubSubClient.h>
#include "DHTesp.h"

const int DHT_PIN = 15;
const int POT_PIN = 34; 
const int LED_PIN = 2; 

DHTesp dhtSensor;
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.emqx.io"; // Awla "test.mosquitto.org"

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);
  pinMode(LED_PIN, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  if (String(topic) == "projet/irrigation/pompe") {
    if(message == "ON") digitalWrite(LED_PIN, HIGH);
    else digitalWrite(LED_PIN, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_Random_Client")) {
      client.subscribe("projet/irrigation/pompe");
    } else {
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // --- HNA FIN BEDDELNA L-CODE ---
  
  // Bla manqraw mn sensors, kan-génériw arqam mn rasna
  // Random Temperature bin 20.00 w 45.00
  float temp = random(2000, 4500) / 100.0; 
  
  // Random Humidité Sol bin 0% w 100%
  int humiditySol = random(0, 100); 

  // --- SAFI, L-BAQI BHAL BHAL ---

  String payload = "{\"temp\":" + String(temp) + ", \"sol\":" + String(humiditySol) + "}";
  
  Serial.print("Envoi Aléatoire: ");
  Serial.println(payload);

  client.publish("projet/irrigation/data", payload.c_str());
  
  delay(3000); // Koul 3 secondes kaybeddel l-arqam
}
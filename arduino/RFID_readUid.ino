#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

int ledPin = 2;
int passLedPin = 17;
int failLedPin = 16;
const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* ssid = "SKYFiber_MESH_1A10";
const char* password =  "531055085";
const char* requestPath = "https://hoasys.herokuapp.com/api/admin/rfid/register/";

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  pinMode(ledPin, OUTPUT);
  pinMode(passLedPin, OUTPUT);
  pinMode(failLedPin, OUTPUT);

  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
  Serial.println("\nConnected to the WiFi network");
  Serial.println("<-- REGISTER TAG -->");
  Serial.println("\n - - - Watching for tags - - -");
}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) //Check the current connection status
  {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      digitalWrite(ledPin, LOW);
      return;
    }

    MFRC522::StatusCode status;
    String uid;
    
    Serial.println("\n<< Tag detected >>");
    digitalWrite(ledPin, HIGH);

    Serial.print(F("Tag UID:"));
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += mfrc522.uid.uidByte[i];
    }
    Serial.println(uid);
    
    String verifyTagPath = String(requestPath)+uid;
    httpGETRequest(verifyTagPath);
    
    Serial.println("\n - - - Watching for tags - - -");

    mfrc522.PICC_HaltA(); // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
  }
  else {
    Serial.println("Connection lost");
  }

  Serial.println(" ");
  delay(1000);
}

void httpGETRequest(String path) {
  HTTPClient http;

  http.begin(path);
  int httpResponseCode = http.GET();

  Serial.println("\nRequesting to server...");
  String rawPayload;

  if (httpResponseCode == 200) {
    Serial.println("Tag read");
  }
  if (httpResponseCode == 202) {
    Serial.println("Tag already registered");
  }
  else {
    Serial.print("Response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

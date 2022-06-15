#include <SPI.h>
#include <MFRC522.h>
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
#define MAX_DEVICES 4
#define ledPin 2
#define failPin 4
#define dirPin 32 
#define stepPin 33
#define trigPin 5
#define echoPin 16
#define stepsPerRevolution 100
#define csPin 12
#define dPin 13
#define clkPin 14

MD_Parola P = MD_Parola(HARDWARE_TYPE, dPin, clkPin, csPin, MAX_DEVICES);

const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* deviceKey = "124TEST";
const char* ssid = "SKYFiber_MESH_1A10";
const char* password =  "531055085";
const char* requestPath = "http://192.168.55.107:5000/api/admin/rfid/scan/";

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

void setup() {  
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(ledPin, OUTPUT);
  pinMode(failPin, OUTPUT);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
  P.begin();

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to network");
  Serial.println("<-- SCAN TAG -->");
  Serial.println("\n - - - Watching for tags - - -");
  P.print("S T O P");
}

void loop() {
  bool result = mfrc522.PCD_PerformSelfTest();
  if(!result){
    digitalWrite(failPin,HIGH);
    delay(500);
    digitalWrite(failPin,LOW);
    delay(500);
    return;
  }


  if ((WiFi.status() == WL_CONNECTED)) //Check the current connection status
  {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      digitalWrite(ledPin, LOW);
      return;
    }
    
    HTTPClient http;
    MFRC522::StatusCode status;
    String uid;

    Serial.println("\n<< Tag detected >>");

    Serial.print(F("Tag UID:"));
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += mfrc522.uid.uidByte[i];
    }
    //Serial.println(uid);
    
    String path = String(requestPath) + String(deviceKey) + "/" + uid;    
    Serial.println(path);
  
    http.begin(path);
    int httpResponseCode = http.GET();
  
    Serial.println("\nRequesting to server...");
  
    if (httpResponseCode == 200) {
      digitalWrite(ledPin, HIGH);
      P.print("P A S S");
      Serial.println("RFID scan recorded");
      
      digitalWrite(dirPin, HIGH);
      for (int i = 0; i < stepsPerRevolution; i++) {
        digitalWrite(stepPin, HIGH);
        delayMicroseconds(4000);
        digitalWrite(stepPin, LOW);
        delayMicroseconds(4000); 
      }

      digitalWrite(trigPin, LOW);
      delayMicroseconds(2);
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);
      long duration = pulseIn(echoPin, HIGH);
      float distance = duration * 0.034 / 2;;
      
      while(distance > 40){
        digitalWrite(trigPin, LOW);
        delayMicroseconds(2);
        digitalWrite(trigPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(trigPin, LOW);
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Enter Distance: ");
        Serial.println(distance);
        delay(500);
      }
      
      delay(200);

      while(distance < 40){
        digitalWrite(trigPin, LOW);
        delayMicroseconds(2);
        digitalWrite(trigPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(trigPin, LOW);
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Exit Distance: ");
        Serial.println(distance);
        delay(500);
      }
      
      delay(1000);
      P.print("S T O P");
      delay(2000);
      
      digitalWrite(dirPin, LOW);
      for (int i = 0; i < stepsPerRevolution; i++) {
        digitalWrite(stepPin, HIGH);
        delayMicroseconds(4000);
        digitalWrite(stepPin, LOW);
        delayMicroseconds(4000); 
      }
      digitalWrite(ledPin, LOW);
    }
    else {
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
      P.print("S T O P");
    }
    
    http.end();
    mfrc522.PICC_HaltA(); // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD

    delay(200);

    Serial.println("\n - - - Watching for tags - - -");
  }
  else {
    Serial.println("Connection lost");
    digitalWrite(failPin,HIGH);
    delay(200);
    digitalWrite(failPin,LOW);
  }
  delay(200);
}
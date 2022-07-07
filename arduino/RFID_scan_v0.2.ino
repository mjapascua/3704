#include <SPI.h>
#include <MFRC522.h>
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#define ledPin 2
#define failPin 4
//#define RFdisabled 27

//Sensor
#define trigPin 5
#define echoPin 16

//LED Matrix
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
#define MAX_DEVICES 8
#define csPin 12
#define dPin 13
#define clkPin 14

//Motor driver
#define dirPin 32 
#define stepPin 33
#define manualPin 34
#define stepsPerRevolution 100

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
  pinMode(manualPin, INPUT);
  
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
  
  P.begin(8);
  P.setZone(0, 0, 3);
  P.setZone(1, 4, 7);
  P.displayZoneText(0,"S T O P",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);

  bool rfDisabled = mfrc522.PCD_PerformSelfTest();

  if(!digitalRead(rfDisabled)){
    Serial.print("Connecting");
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
    }
    Serial.println("\nConnected to network");
    Serial.println("<-- SCAN TAG -->");
    Serial.println("\n - - - Watching for tags - - -");
  }
}

void loop() {
  bool rfFunctional = mfrc522.PCD_PerformSelfTest();
  
  if(!rfFunctional){
    digitalWrite(failPin,HIGH);
  }  digitalWrite(failPin,LOW);

  
  if(digitalRead(manualPin)){
    digitalWrite(ledPin, HIGH);
    P.displayZoneText(1,"P A S S",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);
    Serial.println("RFID scan recorded");
    
    bool isStopped = runRevolution(HIGH);
    
    if(!isStopped){
      trigSensor();
      long duration = pulseIn(echoPin, HIGH);
      float distance = duration * 0.034 / 2;;
      
      while(distance > 40){
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Enter Distance: ");
        Serial.println(distance);
        delay(400);
      }
      
      delay(200);
  
      while(distance < 40){
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Exit Distance: ");
        Serial.println(distance);
        delay(400);
      }
      
      delay(1000);
      P.displayZoneText(0,"S T O P",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);
      delay(2000);
      
      runRevolution(LOW);
    }
    digitalWrite(ledPin, LOW);
  }

  
  
  if(!rfFunctional){
    delay(200);
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

    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += mfrc522.uid.uidByte[i];
    }
    
    String path = String(requestPath) + String(deviceKey) + "/" + uid;    
    Serial.println(path);
  
    http.begin(path);
    int httpResponseCode = http.GET();
  
    Serial.println("\nRequesting to server...");
  
    if (httpResponseCode == 200) {
      digitalWrite(ledPin, HIGH);
      P.displayZoneText(1,"P A S S",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);
      Serial.println("RFID scan recorded");
      
      bool isStopped = runRevolution(HIGH);
      
      if(!isStopped){
        trigSensor();
        long duration = pulseIn(echoPin, HIGH);
        float distance = duration * 0.034 / 2;;
        
        while(distance > 40){
          trigSensor();
          duration = pulseIn(echoPin, HIGH);
          distance = duration * 0.034 / 2;
          Serial.print("Enter Distance: ");
          Serial.println(distance);
          delay(400);
        }
        
        delay(200);
  
        while(distance < 40){
          trigSensor();
          duration = pulseIn(echoPin, HIGH);
          distance = duration * 0.034 / 2;
          Serial.print("Exit Distance: ");
          Serial.println(distance);
          delay(400);
        }
        
        delay(1000);
        P.displayZoneText(0,"S T O P",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);
        delay(2000);
        
        runRevolution(LOW);
      }
      digitalWrite(ledPin, LOW);
    }
    else {
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
      P.displayZoneText(0,"F A I L",PA_CENTER,P.getSpeed(), P.getPause(), PA_PRINT, PA_CLOSING);
      delay(2000);
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


void trigSensor(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
}

bool runRevolution(bool startAt){
  digitalWrite(dirPin, startAt);

  for (int i = 0; i < stepsPerRevolution; i++) {
    if(digitalRead(manualPin)){
      trigSensor();
      long duration = pulseIn(echoPin, HIGH);
      float distance = duration * 0.034 / 2;
      
      while(duration < 40){   
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
      };
      
      digitalWrite(dirPin, !startAt);
      for (int x = i; x < stepsPerRevolution; x++) {
        digitalWrite(stepPin, HIGH);
        delayMicroseconds(4000);
        digitalWrite(stepPin, LOW);
        delayMicroseconds(4000); 
      }
      
      return true;
    };
    
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(4000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(4000); 
  }   
  
  return false;
}
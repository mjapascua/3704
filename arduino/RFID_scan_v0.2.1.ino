#include <SPI.h>
#include <MFRC522.h>
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#define passPin 2
#define statusPin 26
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
#define stepsPerRevolution 200

MD_Parola P = MD_Parola(HARDWARE_TYPE, dPin, clkPin, csPin, MAX_DEVICES);

const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* deviceKey = "124TEST";
const char* ssid = "2.4G";
const char* password =  "Mikepascua123#";
const char* requestPath = "https://hoasys.herokuapp.com/api/admin/rfid/scan/";\

// const char* deviceKey = "124TEST";
// const char* ssid = "mike";
// const char* password =  "12345678";
// const char* requestPath = "https://hoasys.herokuapp.com/api/admin/rfid/scan/";



MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

void setup() {  
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(passPin, OUTPUT);
  pinMode(failPin, OUTPUT);
  pinMode(statusPin, OUTPUT);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(manualPin, INPUT);
  
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
  bool rfFunctional = mfrc522.PCD_PerformSelfTest();

  P.begin(2);
  P.setZone(0, 0, 3);
  P.setZone(1, 4, 7);
  P.displayClear(1);
  P.displayZoneText(0,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
  P.displayAnimate();


  if(rfFunctional){
    Serial.print("Connecting");
    digitalWrite(statusPin,LOW);
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
    }
    digitalWrite(statusPin,HIGH);
    Serial.println("\nConnected to network");
    Serial.println("<-- SCAN TAG -->");
    Serial.println("\n - - - Watching for tags - - -");
  } else {
    digitalWrite(statusPin,LOW);
  }
}

void loop() {

  P.displayAnimate();
  bool rfFunctional = mfrc522.PCD_PerformSelfTest();
  bool manualOpen = digitalRead(manualPin);
  
  if(!rfFunctional){
    digitalWrite(statusPin,LOW);
  }  digitalWrite(statusPin,HIGH);
  
  if(manualOpen){
    digitalWrite(passPin, HIGH);
    P.displayClear(0);
    P.displayZoneText(1,"P A S S",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);  
    P.displayAnimate();  
    int isStopped = runRevolution(HIGH, 1000);
    Serial.print("Stopped : ");
    Serial.println(isStopped);
    
    if(!isStopped){   
      trigSensor();
      long duration = pulseIn(echoPin, HIGH);
      float distance = duration * 0.034 / 2;;
      
      while(distance > 100){
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Enter Distance: ");
        Serial.println(distance);
        delay(400);
      }
      
      delay(200);
  
      while(distance < 100){
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
        Serial.print("Exit Distance: ");
        Serial.println(distance);
        delay(400);
      }
      
      delay(1000);      
      runRevolution(LOW,0);
    }
    P.displayClear(1);
    P.displayZoneText(0,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
    P.displayAnimate();
    digitalWrite(passPin, LOW);
  };

  if(!rfFunctional){
    delay(100);
    return;
  };

  if ((WiFi.status() == WL_CONNECTED)) //Check the current connection status
  {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
    HTTPClient http;
    MFRC522::StatusCode status;
    String uid;

    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      //digitalWrite(statusPin, HIGH);
      return;
    }
 //AHA bobobo no lloo
    Serial.println("\n<< Tag detected >>");
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += mfrc522.uid.uidByte[i];
    }
    //Serial.println(uid);

    String path = String(requestPath) + String(deviceKey) + "/" + uid;      
    http.begin(path);
    int httpResponseCode = http.GET();
  
    Serial.println("\nRequesting to server...");
  
    if (httpResponseCode == 200) {
      digitalWrite(passPin, HIGH);
      P.displayClear(0);
      P.displayZoneText(1,"P A S S",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);   
      P.displayAnimate();
      Serial.println("RFID scan recorded");
      
      bool isStopped = runRevolution(HIGH,200);
      
      if(!isStopped){
        trigSensor();
        long duration = pulseIn(echoPin, HIGH);
        float distance = duration * 0.034 / 2;;
        
        while(distance > 100){
          trigSensor();
          duration = pulseIn(echoPin, HIGH);
          distance = duration * 0.034 / 2;
          Serial.print("Enter Distance: ");
          Serial.println(distance);
          delay(400);
        }
        
        delay(200);
  
        while(distance < 100){
          trigSensor();
          duration = pulseIn(echoPin, HIGH);
          distance = duration * 0.034 / 2;
          Serial.print("Exit Distance: ");
          Serial.println(distance);
          delay(400);
        }
         
        delay(1000);
       
        runRevolution(LOW,0);
      }
      P.displayClear(1);
      P.displayZoneText(0,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
      P.displayAnimate();     
      digitalWrite(passPin, LOW);
    }
    else {
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
      digitalWrite(failPin,HIGH);
      P.displayClear(1);
      P.displayZoneText(0,"F A I L",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
      P.displayAnimate();
      delay(2000);
      P.displayZoneText(0,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
      P.displayAnimate();
      digitalWrite(failPin,LOW);
    }
    
    http.end();
    mfrc522.PICC_HaltA(); // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
    
    digitalWrite(failPin,LOW);
    digitalWrite(passPin,LOW);

    Serial.println("\n - - - Watching for tags - - -");
    delay(100);

  }  else {
    Serial.println("Connection lost");
    digitalWrite(statusPin,LOW);
    delay(100);
    return;
  }

}


void trigSensor(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
}

int runRevolution(int startAt, int addDelay){
  digitalWrite(dirPin, startAt);
  delay(100+addDelay);

  for (int i = 0; i < stepsPerRevolution; i++) {
    bool btnPress = digitalRead(manualPin);
    P.displayZoneText(1,"P A S S",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
    P.displayClear(0);
    P.displayAnimate();
    if(btnPress ==  HIGH){
      trigSensor();
      long duration = pulseIn(echoPin, HIGH);
      float distance = duration * 0.034 / 2;      
      while(duration < 100){   
        trigSensor();
        duration = pulseIn(echoPin, HIGH);
        distance = duration * 0.034 / 2;
      };
      
      digitalWrite(dirPin, !startAt);
      P.displayZoneText(0,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
      P.displayClear(1);
      P.displayAnimate();

      for (int x = 0; x < i; x++) {
        digitalWrite(stepPin, HIGH);
        delayMicroseconds(4000);
        digitalWrite(stepPin, LOW);
        delayMicroseconds(4000); 
      }

      return 1;
    };
    
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(4000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(4000); 
  }   
  return 0;
}
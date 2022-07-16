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
#define stepsPerRevolution 1400

#define exitDistance 110

MD_Parola P = MD_Parola(HARDWARE_TYPE, dPin, clkPin, csPin, MAX_DEVICES);

const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* deviceKey = "124TEST";
const char* ssid = "GlobeAtHome_D0E2B_2.4";
const char* password =  "GlobeFiberNav4";
const char* requestPath = "https://hoasys.herokuapp.com/api/admin/rfid/scan/";

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
  displayLED(0,"S T O P");

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
  displayLED(0,"S T O P");
  bool rfFunctional = mfrc522.PCD_PerformSelfTest();
  bool manualOpen = digitalRead(manualPin);
  
  if(!rfFunctional){
    digitalWrite(statusPin,LOW);
  }  digitalWrite(statusPin,HIGH);
  
  if(manualOpen){
    int shouldLower = runRevolution(HIGH, 1000,0);
    if(!shouldLower){
      return;
    }
    if(shouldLower){
      runRevolution(LOW,0,0);
    }
    displayLED(0,"S T O P");
  };

  if(!rfFunctional){
    delay(100);
    return;
  };

  if ((WiFi.status() == WL_CONNECTED))
  {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
    HTTPClient http;
    MFRC522::StatusCode status;
    String uid;

    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      return;
    }
    checkRFID();
    
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

void checkRFID(){
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
  HTTPClient http;
  MFRC522::StatusCode status;
  String uid;
  
  Serial.println("\n<< Tag detected >>");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += mfrc522.uid.uidByte[i];
  }
  Serial.println(uid);

  String path = String(requestPath) + String(deviceKey) + "/" + uid;      
  http.begin(path);
  int httpResponseCode = http.GET();

  Serial.print("\nRequesting to ...");
  Serial.println(path);

  if (httpResponseCode == 200) {
    digitalWrite(passPin, HIGH);
    Serial.println("RFID scan recorded");
    int shouldLower = runRevolution(HIGH,200,0);
    digitalWrite(passPin, LOW);
    if(!shouldLower){
      return;
    }
    delay(1000);
    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      runRevolution(LOW,0, 0);
    } else {
      checkRFID();
    }
  
    displayLED(0,"S T O P");
  } else {
    Serial.println(httpResponseCode);
    digitalWrite(failPin,HIGH);
    displayLED(0,"F A I L");
    delay(2000);
    displayLED(0,"S T O P");
    digitalWrite(failPin,LOW);
  }
  http.end();
}
void trigSensor(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
}

void checkDis(bool enter, bool pass){
  trigSensor();
  long duration = pulseIn(echoPin, HIGH);
  float lastDis = 0;
  float distance = duration * 0.034 / 2;
  bool entered = enter;
  bool passed = pass;
  if(digitalRead(manualPin)) return;

  delay(500);
  while(!entered && !passed){
    if(digitalRead(manualPin)) return;
    trigSensor();
    lastDis = distance;
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    Serial.print("distance: ");
    Serial.println(distance);
    if(!entered && distance <= exitDistance && lastDis <= exitDistance){
      entered = 1;
    }
    if(entered && distance >= exitDistance && lastDis >= exitDistance){
      passed = 1;
    }
    delay(100);
  }

  delay(500);
  if(digitalRead(manualPin)) return;
  if((entered && passed)){
   return; 
  } else checkDis(entered,passed);
}

int runRevolution(int startAt, int addDelay, int steps){
  digitalWrite(dirPin, startAt);
  delay(100 + addDelay);
  int useSteps;
  if(steps){
    useSteps = steps;
  } else {
    useSteps = stepsPerRevolution;
  }
  displayLED(0,"S T O P");

  trigSensor();
  long duration = pulseIn(echoPin, HIGH);
  float lastDis = 0;
  float distance = duration * 0.034 / 2;
  bool entered = 0;
  bool passed = 0;
  
  for (int i = 0; i < useSteps; i++) {
    bool btnPress = digitalRead(manualPin);
    if(btnPress ==  HIGH){
      delay(200);
      return runRevolution(!startAt, 200, i);
    };
    if(startAt && useSteps == ( stepsPerRevolution * 0.8 )){
      displayLED(1,"P A S S");
    }
    if(startAt){
      digitalWrite(stepPin, HIGH);
      delayMicroseconds(1000);
      digitalWrite(stepPin, LOW);
      lastDis = distance;
      trigSensor();
      duration = pulseIn(echoPin, HIGH, 10000);
      distance = duration * 0.034 / 2;
      Serial.print("distance: ");
      Serial.println(distance);
  
      if(distance){
        if(!entered && distance <= exitDistance && lastDis <= exitDistance){
          entered = 1;
        }
        if(entered && distance >= exitDistance && lastDis >= exitDistance){
          passed = 1;
        } 
      }
      if(entered && passed){
        return 1;
      }
    } else {
      digitalWrite(stepPin, HIGH);  
      delayMicroseconds(3000);
      digitalWrite(stepPin, LOW);
      delayMicroseconds(3000); 
    }
   
  }
  if(startAt){
    checkDis(0,0);
    return 1;
  } else return 0;
}

void displayLED(int at, const char* text){
  P.displayClear(!at);
  P.displayZoneText(at,text,PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
  P.displayAnimate();
}
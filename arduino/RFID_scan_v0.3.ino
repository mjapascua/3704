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
const char* ssid = "baconpancakes";
const char* password =  "123456789";
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
    digitalWrite(passPin, HIGH);
    displayLED(1,"P A S S");
    int isStopped = runRevolution(HIGH, 1000);
    Serial.print("Stopped : ");
    Serial.println(isStopped);
    
    if(!isStopped){   
      checkDis(0,0);
      delay(1000);
      runRevolution(LOW,0);
    }
    displayLED(0,"S T O P");
    digitalWrite(passPin, LOW);
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
    displayLED(1,"P A S S");
    Serial.println("RFID scan recorded");
    bool isStopped = runRevolution(HIGH,200);
    digitalWrite(passPin, LOW);

    if(!isStopped){
      checkDis(0,0);
      delay(1000);
      if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
        runRevolution(LOW,0);
      } else {
        checkRFID();
      }
    }
    displayLED(0,"S T O P");
    digitalWrite(passPin, LOW);
  } else {
    Serial.println(httpResponseCode);
    digitalWrite(failPin,HIGH);
    displayLED(0,"F A I L");
    delay(2000);
    displayLED(0,"S T O P");
    digitalWrite(failPin,LOW);
  }

  
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

  delay(500);
  while(distance > exitDistance || lastDis > exitDistance){
    if(digitalRead(manualPin)) return;
    trigSensor();
    lastDis = distance;
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    Serial.print("Enter distance: ");
    Serial.println(distance);
    delay(1000);
  }
  if(distance <= exitDistance && lastDis <= exitDistance){
    entered = true;
  }
  delay(500);

  while(distance < exitDistance || lastDis < exitDistance){
    if(digitalRead(manualPin)) return;
    trigSensor();
    lastDis = distance;
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    Serial.print("Exit distance: ");
    Serial.println(distance);
    delay(1000);
  }
  if(distance >= exitDistance && lastDis >= exitDistance){
    passed = true;
  }
  delay(500);

  if((entered && passed)||digitalRead(manualPin)){
   return; 
  } else checkDis(entered,passed);
}

int runRevolution(int startAt, int addDelay){
  digitalWrite(dirPin, startAt);
  delay(100+addDelay);

  if(startAt){
    displayLED(1,"P A S S");
  } else{
    displayLED(0,"S T O P");
  }

  for (int i = 0; i < stepsPerRevolution; i++) {
    bool btnPress = digitalRead(manualPin);
    
    if(btnPress ==  HIGH){
      if(startAt){
        displayLED(1,"P A S S");
      } else{
        displayLED(0,"S T O P");
      }
      checkDis(0,0);
      
      digitalWrite(dirPin, !startAt);
      if(!startAt){
        displayLED(1,"P A S S");
      } else{
        displayLED(0,"S T O P");
      }
      
      for (int x = 0; x < i; x++) {
        digitalWrite(stepPin, HIGH);
        delayMicroseconds(2000);
        digitalWrite(stepPin, LOW);
        delayMicroseconds(2000); 
      }

      return 1;
    };
    
    digitalWrite(stepPin, HIGH);  
    delayMicroseconds(2000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(2000); 
  }   
  return 0;
}

void displayLED(int at, String text){
  P.displayClear(!at);
  P.displayZoneText(at,"S T O P",PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
  P.displayAnimate();
}
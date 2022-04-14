
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

int ledPin = 2;
const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* ssid = "---";
const char* password =  "Asmodeus2731";
String hostApi = "http://192.168.55.101:5000/api/";
String requestPath = hostApi + "admin/rfid/scan";

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  pinMode(ledPin, OUTPUT);

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
  //Serial.print("IP address: ");
  //Serial.println(WiFi.localIP());
  Serial.println(F("- READY TO SCAN -")); 
}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) //Check the current connection status
  {
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
        
    if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
      digitalWrite(ledPin,LOW);
      return;
    }
    
    MFRC522::StatusCode status;
    HTTPClient http;
    String uid;

    Serial.println("\n<< Card detected >>");
    digitalWrite(ledPin,HIGH);
    
    Serial.print(F("Card UID:"));    //Dump UID
    for (byte i = 0; i < mfrc522.uid.size; i++) {
     uid += mfrc522.uid.uidByte[i];
     }
    Serial.println(uid);

    byte block = 1;
    byte len = 18;
    byte buffer1[18];

    //Authenticate
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid)); 
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("Authentication failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }
    
    //Read
    status = mfrc522.MIFARE_Read(block, buffer1, &len);
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("Reading failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }

    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 2, &key, &(mfrc522.uid)); 
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("Authentication failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }
    
    block = 2;
    byte buffer2[18];
    
    status = mfrc522.MIFARE_Read(block, buffer2, &len);
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("Reading failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }

    //Send request
    http.begin(requestPath);
    int httpResponseCode = http.GET();
    
    Serial.print("Payload:");
    for (uint8_t i = 0; i < 16; i++) {
      Serial.print(String((char)buffer1[i]));
    }
    for (uint8_t i = 0; i < 16; i++) {
      Serial.print(String((char)buffer2[i]));
    }
    
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    Serial.println("\n<< End of reading  >>");

    Serial.println("\nRequesting to server...");

    if (httpResponseCode>0) {
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
    
    http.end();
  }
  else {
    Serial.println("Connection lost");
  }
  
  Serial.println(" ");
  delay(1000);
}

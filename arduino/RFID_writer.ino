#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

int ledPin = 2;
const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin

const char* ssid = "---";
const char* password =  "Asmodeus2731";
const char* requestPath = "http://192.168.55.101:5000/api/admin/rfid/register";
const char *payloadArr[2];

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

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
  Serial.println(F("- REGISTER TAG -"));
  //Serial.print("IP address: ");
  //Serial.println(WiFi.localIP());

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

    // Serial.println("\n<< Type resident name >>");
    // len = Serial.readBytesUntil('#', (char *) buffer, 30) ; // read family name from serial

    String hashToStore;
    String queueId;
    String payload = httpTagRequest(requestPath, uid);
    JSONVar resObject = JSON.parse(payload);

    if (JSON.typeof(resObject) == "undefined") {
      Serial.println("Parsing input failed!");
      return;
    }

    JSONVar resKeys = resObject.keys();

    for (int i = 0; i < resKeys.length(); i++) {
      JSONVar value = resObject[resKeys[i]];
      payloadArr[i] = value;
    }

    Serial.print("\nHash = ");
    Serial.println(payloadArr[0]);
    hashToStore = payloadArr[0];
    Serial.print("Queue id = ");
    Serial.println(payloadArr[1]);
    queueId = payloadArr[1];

    byte block;
    byte len;

    block = 1;
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("PCD_Authenticate() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }

    len = hashToStore.length();
    byte buffer[64];
    memcpy(buffer, hashToStore.c_str(), len);

    for (byte i = len; i < 48; i++) buffer[i] = ' ';

    // Write block
    status = mfrc522.MIFARE_Write(block, buffer, 16);
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("MIFARE_Write() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }
    else Serial.println(F("\nBlock 1 write success..."));

    block = 2;
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("PCD_Authenticate() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }

    // Write block
    status = mfrc522.MIFARE_Write(block, &buffer[16], 16);
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("MIFARE_Write() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }
    else {
      Serial.println(F("Block 2 write success..."));
      String removePath = String(requestPath) + "/queue/" + queueId;

      String removeResponse = httpRemoveFromQueue(removePath);
      Serial.println("Tag registered to "+String(payloadArr[2]));
      Serial.println(removeResponse);
    }
    Serial.println("\n<< End of process >>");

    mfrc522.PICC_HaltA(); // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
  }
  else {
    Serial.println("Connection lost");
  }

  Serial.println(" ");
  delay(1000);
}


String httpTagRequest(const char* path, String uid) {
  HTTPClient http;

  http.begin(path);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST("{\"uid\":\"" + uid + "\"}");

  Serial.println("\nRequesting to server...");
  String rawPayload;

  if (httpResponseCode == 200) {
    rawPayload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();

  return rawPayload;
}

String httpRemoveFromQueue(String path) {
  HTTPClient http;

  http.begin(path);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.GET();

  Serial.println("\nRemoving from queue...");
  String rawPayload;

  if (httpResponseCode == 200) {
    rawPayload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    Serial.println(http.getString());
  }

  http.end();

  return rawPayload;
}

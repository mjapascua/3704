#include <SPI.h>
#include <Arduino_JSON.h>

#define passPin 2
#define statusPin 26
#define failPin 4
//#define RFdisabled 27

//Motor driver
#define dirPin 32 
#define stepPin 33
//#define manualPin 34
//#define stepsPerRevolution 1600

const int RST_PIN = 22; // Reset pin
const int SS_PIN = 21; // Slave select pin


void setup() {  
  Serial.begin(115200);

  pinMode(statusPin, OUTPUT);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin(); // Init SPI bus
  digitalWrite(dirPin, HIGH);

}

void loop() {
  digitalWrite(stepPin, HIGH);
  delayMicroseconds(500);
  digitalWrite(stepPin, LOW);
  delayMicroseconds(500); 
}

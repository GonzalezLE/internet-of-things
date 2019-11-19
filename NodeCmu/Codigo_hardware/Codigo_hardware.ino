#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>
#include <RTClib.h>
#include <Wire.h>
RTC_DS3231 rtc;
char t[32];

#define foco1 16
#define foco2 2
#define foco3 0
#define puerta 14
#define enchufe 12

// Variables vara manejar firebase
#define FIREBASE_HOST "thehouse-506e7.firebaseio.com"
#define FIREBASE_AUTH "Gf8ZjUKmIA55V9qVSr8khne5JzmWOd4ckW8glACa"
#define WIFI_SSID "Totalplay-759A"
#define WIFI_PASSWORD "759A2EEDKtewV864"

/***********************************************
 *                    Pines
 ***********************************************                   
 * D0=>Foco1 sala(16)                   
 * D1=>SCL relog tiempo real
 * D2=>SDA reloj tiempo real
 * D3=>Foco2 Cocina(4)
 * D4=>Foco3 Recamara(2)
 * D5=>ChapaElectrica(14)
 * D6=>Enchufe(12)
***********************************************/
/***********************************************
 * Manejar estados de los focos int Status[]
 * [0]=>Foco 1
 * [1]=>Foco 2
 * [2]=>Foco 3
 * [3]=>chapa
 * [4]=>Foco Enchufe
************************************************/
int Status[] = {0, 0, 0, 0};
void setup() {
  Serial.begin(9600);
  Wire.begin();
  rtc.begin();
  rtc.adjust(DateTime(F(__DATE__),F(__TIME__)));
  
  pinMode(foco1,OUTPUT);
  pinMode(foco2,OUTPUT);
  pinMode(foco3,OUTPUT);
  pinMode(puerta,OUTPUT);
  pinMode(enchufe,OUTPUT);
  ApagaTodo();
  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
void loop() {
  DateTime now = rtc.now();
  Status[0]=Firebase.getInt("foco1");
  Status[1]=Firebase.getInt("foco2");
  Status[2]=Firebase.getInt("foco3");
  Status[3]=Firebase.getInt("puerta");

  Serial.println(now.hour());
  Serial.println(now.minute());
  
  
  if(Status[0]==1){
    PrendeFoco1();
  }else{
    if(Status[0]==0){
      ApagaFoco1();
    }
  }
  if(Status[1]==1){
    PrendeFoco2();
  }else{
    if(Status[1]==0){
      ApagaFoco2();
    }
  }
  if(Status[2]==1){
    PrendeFoco3();
  }else{
    if(Status[2]==0){
      ApagaFoco3();
    }
  }
  if(Status[3]==1){
    Openpuerta();
    delay(5000);
    Closedpuerta();
    Firebase.setInt("puerta",0);
  }
  

}
void ApagaTodo(){
  PrendeFoco1();
  PrendeFoco2();
  PrendeFoco3();
  Closedpuerta();
  ClosedEnchufe();
}
void PrendeFoco1() {
  digitalWrite(foco1,HIGH);
}
void ApagaFoco1() {
  digitalWrite(foco1,LOW);
}
void PrendeFoco2() {
  digitalWrite(foco2,HIGH);
}
void ApagaFoco2() {
  digitalWrite(foco2,LOW);
}
void PrendeFoco3() {
  digitalWrite(foco3,HIGH);
}
void ApagaFoco3() {
  digitalWrite(foco3,LOW);
}
void Closedpuerta(){
  digitalWrite(puerta,LOW);
}
void Openpuerta(){
  digitalWrite(puerta,HIGH);
}
void OpenEnchufe() {
  digitalWrite(enchufe,LOW);
}
void ClosedEnchufe() {
  digitalWrite(enchufe,HIGH);
}

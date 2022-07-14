# Realtime BeerPhong
## Beschreibung des Projekts
Realtime BeerPhong ist eine AR-Anwendung die das Spiel "Beer Pong" mittels AFrame und JavaScript darstellt. Die Anwendung wurde im Rahmen der Veranstaltung Echtzeit Computergrafik der Hochschule Furtwangen im Sommersemester 2022 durchgeführt. Der Kurs wurde geleitet von Prof. Dr. Uwe Hahne.

## Ausführung des Codes
Zur Ausführung des Codes empfehlen wir folgende Vorgehensweise mit Windows (falls Sie ein anderes Betriebssystem verwenden kann die Vorgehensweise abweichen):
1. Clonen Sie das Repository
2. erstellen Sie sich einen .vscode-Ordner mit einer settings.json und fügen sie folgenden Code ein: 
```
{
    "liveServer.settings.https": {
        "enable": true,
        "cert": "",
        "key": "",
        "passphrase": ""
    }
}
```
3. Sie müssen bei den Werten "cert" den absoluten Pfad auf ein Zertifikat hinterlegen und bei "key" den absoluten Pfad zum passenden Key des Zertifikats. (Falls Sie kein eigenes Zertifikat und Key haben müssen sie sich dafür eins erstellen. Passende Tools hierfür sind unteranderem openssl oder GnuPG)
4. Klicken Sie mit einem Rechtsklick auf die aFrame.html. Es Sollte sich die Anwendung in Ihrem Browser öffnen.
5. Wenn Sie sich mit Ihrem Smartphone in dem Gleichen Netzwerk befinden können sie in einem Webbrowser (vorzugsweise Chrome) in der URL folgendes eingeben: **https:[die ip-Adresse ihres PCs im Netzwerk]:[Die Portnummer des live Servers]/aFrame.html**.
6. Lassen Sie sich den Marker (welchen Sie unter Assets mit dem Namen "BeerPongMarker.pdf" finden können) entweder auf Ihrem Laptop anzeigen oder drucken Sie diesen aus. Wenn Sie mit ihrer Smartphone Kamera in der Anwendung den Marker scannen sollte die AR-Szene von Realtime BeerPhong erscheinen.  

## Zusätzliche Librarys
Für die Anwendung werden keine zusätzlichen Librarys benötigt. Als unterstützende Ressource für die Technik werden folgende Skripte direkt aus dem Netz geladen(Stand Juli 2022):
* Von cdn.jsdelivr: [GLTFLoader](https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js)
* Von cdn.jsdelivr: [ThreeJs](https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js)
* Von cdn.jsdelivr: [OrbitControls](https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js)
* Von aframe.io: [aframe_min](https://aframe.io/releases/1.0.4/aframe.min.js)
* Von raw.githack.com: [aframe_ar](https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js)  

## Getestete Browser und Smartphones
### Die Anwendung wurde auf folgenden Smartphones getestet:
* Samsung A52
* Google Pixel 5
* Samsung A21
* IPhone 8

**Die Anwendung wurde hauptsächlich auf Google Chrome entwickelt.**
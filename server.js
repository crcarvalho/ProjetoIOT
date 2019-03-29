var five = require("johnny-five"),
    board = new five.Board(),
    servos = null,
    servoPins = [9],
    sensorLed = null,
    sensor = null,
    sensorPins = [2],
    express = require('express'),
    app = express(),
    port = 3000;




var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');


var led;
var servo;
var distancia;
var ultimoStatusVaga;

board.on("ready", function() {
    led = new five.Led(13);
    var servos = new five.Servos(9);

    servos.to(0);

    /*
        var proximity = new five.Proximity({
            controller: "HCSR04",
            pin: 7
        });

        proximity.on("change", function() {
            distancia = this.cm;
            var statusAtual;

            if (distancia < 5 ) {
                led.off();
                statusAtual = "Cheio";
            } else {
                //servo.to(0);
                led.on(); 
                statusAtual = "Vazio";                  
            }

            if (ultimoStatusVaga !== statusAtual) {
                ultimoStatusVaga = statusAtual;

                if (statusAtual == "Vazio") {
                    
                    //setTimeout(function(){servo.to(45)}, '3000');
                }            

                client.publish('distancia12', ultimoStatusVaga);
            }
        });*/
});


app.post('/led/ligar', function(req, res) {
    led.on();
    res.sendStatus(200);
});

app.post('/led/desligar', function(req, res) {
    led.off();
    res.sendStatus(200);
});

app.get('/tigelapet', function(req, res) {
    if (distancia < 5) {
        res.send("Cheio");
    } else {
        res.send("Vazio");
    }
});

app.listen(3000, function() {
    console.log(`app listening on port ${3000}`);
})
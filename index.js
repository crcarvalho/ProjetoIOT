"use strict";

var five = require("johnny-five"),
    board = new five.Board(),
    servos = null,
    servoPins = [9],
    sensorLed = null,
    sensor = null,
    sensorPins = [2],
    led = null,
    pinLed = 13,
    express = require('express'),
    app = express(),
    port = 8000;


var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');

board.on("ready", function() {
    led = new five.Led(pinLed);

    console.log("### Board conectado!!!");
    // Initialize a Servo collection
    console.log("### Inicializando os pins do servo: ", servoPins);
    servos = new five.Servos(servoPins);
    console.log("### Colocando o servo na posição de 0 graus");
    servos.to(0);

    var sensor = new five.Sensor.Digital(7);

    sensor.on("change", function() {
        var sensorPoteVazio = this.value;
        //Pote vazio
        if (sensorPoteVazio) {
            console.log("Pote vazio**************");
            led.on();
            servos.to(90);
            setTimeout(function() {
                servos.to(0), led.off()
            }, '3000');
            client.publish('alimentacao', 'Alimentando PET');
        } else {
            console.log("Pote cheio**************");
        }
    });



});

app.get('/servos/:mode/:value?', function(req, res) {
    if (servos) {
        var status = "OK";
        var value = req.params.value; // optional, may be null
        switch (req.params.mode) {
            case "min": // 0 degrees
                servos.min();
                break;
            case "max":
                servos.max();
                break;
            case "stop": // use after sweep
                servos.stop();
                break;
            case "sweep":
                servos.sweep();
                break;
            case "to":
                if (value !== null) {
                    servos.to(value);
                }

                if (value == 90) {
                    led.on();
                } else {
                    led.off();
                }
                break;
            default:
                status = "Unknown: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    } else {
        res.send('Board NOT ready!')
    }
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});
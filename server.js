// GLOBAL SHIT
var port = 3000;
var delay = 500;

// LIBRARIES
var express = require('express');
var gpio = require('onoff').Gpio;

// MY EXPORTS

// GLOBALS
console.log('GPIO setup');
var redLED = new gpio(21,'out');
console.log('GPIO 21 is a Red LED');
var yellowLED = new gpio(16, 'out');
console.log('GPIO 16 is a Yellow LED');
var greenLED = new gpio(23, 'out');
console.log('GPIO 23 is a Green LED');
var button = new gpio(12, 'in', 'both');
console.log('GPIO 12 is a button.');

button.watch( 
	function(err,value) {
		console.log('Button press:' + value );
		
		if( value === 1 ) {
			greenLED.writeSync(value);
			flashyBits();
		} else {
			redLED.writeSync(value);
			yellowLED.writeSync(value);
			greenLED.writeSync(value);
		}
	}
);
console.log('Watching button ...');

// CREATE THE APP
var app = express();

app.get('/red', function(req, res) {
	console.log( 'HTTP red request received' );

	redLED.writeSync( redLED.readSync() === 0 ? 1:0 );
	
	res.status(200);
	res.send('flicky red light');
	
});

app.get('/yellow', function(req, res) {
	console.log( 'HTTP yellow request received' );

	yellowLED.writeSync( yellowLED.readSync() === 0 ? 1:0 );

	res.status(200);
	res.send('flicky yellow light');

});

app.get('/green', function(req, res) {
	console.log( 'HTTP green request received' );

	greenLED.writeSync( greenLED.readSync() === 0 ? 1:0 );
	
	res.status(200);
	res.send('flicky green light');
	
});

app.listen( port, function() {
	console.log('SERVER listening on port ' + port );

});

//HELPERS
function flashyBits() {
	delayedWrite(100,redLED,1);
	delayedWrite(200,redLED,0);
	delayedWrite(300,yellowLED,1);
	delayedWrite(400,yellowLED,0);
	delayedWrite(500,redLED,1);
	delayedWrite(600,redLED,0);
	delayedWrite(700,yellowLED,1);
	delayedWrite(800,yellowLED,0);
}

function delayedWrite(delay, led, value) {
	setTimeout( function() {
		led.writeSync(value);
	}, delay);
};

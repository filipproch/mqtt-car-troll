const MQTT = require('mqtt');
const keypress = require('keypress');

const client = MQTT.connect('mqtt://192.168.9.116');

const MAX_SPEED = 32;

function setPower(power) {
  console.log(`setPower ${power}`);
  client.publish('car/engines', JSON.stringify({
    action: 'set_power',
    power: power
  }))
}

function setDirection(direction) {
  console.log(`setDirection ${direction}`);
  client.publish('car/engines', JSON.stringify({
    action: 'set_direction',
    direction: direction
  }))
}

function left() {
  setDirection('left')
}

function right() {
  setDirection('right')
}

function go(speed) {
  setPower(speed)
}

function stop() {
  setPower(0);
  setDirection('straight');
}

client.on('connect', () => {
  console.log('connected to MQTT');

  keypress(process.stdin);
});

process.stdin.on('keypress', function (ch, key) {
  //console.log('got "keypress"', key);

  if (key && key.ctrl && key.name === 'c') {
    process.stdin.pause();
    process.exit(0);
  }

  if (key.name === 'up') {
    go(MAX_SPEED);
  } else if (key.name === 'down') {
    go(-MAX_SPEED);
  } else if (key.name === 'left') {
    left();
  } else if (key.name === 'right') {
    right();
  } else if (key.name === 'space') {
    stop();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
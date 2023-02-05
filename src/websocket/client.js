const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/');


ws.on('open', function open() {
    ws.send('something from client');
});

ws.on('message', function incoming(data) {

    console.log(`received: ${data}`);

});
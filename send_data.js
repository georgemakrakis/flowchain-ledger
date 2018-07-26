let WebSocketClient = require('websocket').client;
let ip = require("ip");

let client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });

    let limit = 0;
    function sendNumber() {
        if (connection.connected && limit!==100) {
            let number = Math.round(Math.random() * 0xFFFFFF);
            let lucky = Math.round(Math.random() * 100 + 1);
            let obj = {temperature: lucky};

            console.log('[SEND]', JSON.stringify(obj));

            connection.sendUTF(JSON.stringify(obj));
            limit++;
            setTimeout(sendNumber, 1000);
        }
        else if(limit===100)
        {
            connection.close();
        }
    }

    sendNumber();
});

client.connect('ws://'+ip.address()+':8001/object/frontdoor/send', '');




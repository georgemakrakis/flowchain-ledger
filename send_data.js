let WebSocketClient = require('websocket').client;
let ip = require('ip');
let fs = require('fs')

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

    getFileReady();
    let limit = 0;
    function sendNumber() {
        if (connection.connected && limit!==10) {
            let number = Math.round(Math.random() * 0xFFFFFF);
            let lucky = Math.round(Math.random() * 100 + 1);
            let obj = {temperature: lucky};

            console.log('[SEND]', JSON.stringify(obj));

            connection.sendUTF(JSON.stringify(obj));

            fs.appendFile('data_send', obj.temperature + ',' + Date.now() + '\n', function (err) {
                if (err)
                {
                    return console.log(err);
                }
            });
            limit++;
            setTimeout(sendNumber, 1000);
        }
        else if(limit===10)
        {
            connection.close();
        }
    }

    sendNumber();
});

client.connect('ws://'+ip.address()+':8001/object/frontdoor/send', '');
//client.connect('ws://192.168.1.2:8001/object/frontdoor/send', '');

function getFileReady(){
    fs.writeFile('data_send', '', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
    fs.appendFile('data_send', 'message_num,time_created' + '\n', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
}




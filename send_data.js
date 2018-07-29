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
    connection.on('message', function (message) {
        console.log('------+++++--------'+message);
    });

    //getFileReadyResponseTime();
    getFileReadyRTT();
    let limit = 0;
    function sendNumber() {
        if (connection.connected && limit!==10)
        {
            let number = Math.round(Math.random() * 0xFFFFFF);
            let lucky = Math.round(Math.random() * 100 + 1);
            let obj = {temperature: lucky, timestamp: Date.now()};

            console.log('[SEND]', JSON.stringify(obj));

            connection.sendUTF(JSON.stringify(obj));

            //*******SECTION for Response Time*********
            // fs.appendFile('data_send_ResponseTime', obj.temperature + ',' + Date.now() + '\n', function (err) {
            //     if (err)
            //     {
            //         return console.log(err);
            //     }
            // });

            //*******SECTION for Service Time - RTT*********
            // client.on('RTT', function(connection) {
            //     //*******SECTION for RTT*********
            //     fs.appendFile('data_send_RTT', obj.temperature + ',' + Date.now() + '\n', function (err) {
            //         if (err)
            //         {
            //             return console.log(err);
            //         }
            //     });
            // });

            limit++;
            setTimeout(sendNumber, 1000);

            // connection.on('GOOOOOTTT_ITTTTT', function (GOT_IT_BACK) {
            //         console.log('------+++++--------'+GOT_IT_BACK.data);
            // });
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

function getFileReadyResponseTime(){
    fs.writeFile('data_send_ResponseTime', '', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
    fs.appendFile('data_send_ResponseTime', 'message_num,time_created' + '\n', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
}

function getFileReadyRTT(){
    fs.writeFile('data_send_RTT', '', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
    fs.appendFile('data_send_RTT', 'message_num,time_created' + '\n', function (err) {
        if (err)
        {
            return console.log(err);
        }
    });
}




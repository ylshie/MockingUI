
export function test () {
    console.log("this is test");
}

//const local     = "localhost"
//const google    = "34.81.174.90"
//const host      = local
//const url       = "http://"  + host + ":3000";
//const urlS      = "https://" + host + ":3001";
var connection  = null;
var callOnOpen  = null;
var callOnError = null;
var handlerMsg  = {}

export function createConnection(url, fOpen, fError, fMessage) {
    console.log("createConnection");

    connection  = new WebSocket(url);

    callOnOpen  = fOpen;
    callOnError = fError;
    handlerMsg  = fMessage;

    connection.onopen = function () {
        // first we want users to enter their names
        if (callOnOpen) callOnOpen();
    };
    
    connection.onerror = function (error) {
        if (callOnError) callOnError(error);
    };
    
    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        console.log("message");
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
    
        const handler = handlerMsg[json.type] 
        if (handler) {
            handler(json);
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    return connection;
}

export function ListRoom(url, callback) {
    //const agent = new https.Agent({
    //    rejectUnauthorized: false
    //})
    //  fetch(myUrl, { agent })

    fetch(url + '/listRoom', {
        rejectUnauthorized: false,
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.json())
    .then((data) => {
        if (callback) callback(data);
    });
}

export function JoinRoom(url, room, role, callback) {
    //const agent = new https.Agent({
    //    rejectUnauthorized: false
    //})
    //  fetch(myUrl, { agent })

    fetch(url + '/joinRoom', {
        rejectUnauthorized: false,
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            room: room,
            role: role,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (callback) callback(data);
    });
}

export function CloseRoom(url, room, role, callback) {
    fetch(url + '/closeRoom', {
        rejectUnauthorized: false,
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            room: room,
            role: role,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (callback) callback(data);
    });
}




const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
//instead of express creating the server in the background, we manually call
//http.createServer so that we'll have the raw http server returned
const server = http.createServer(app);
//because socketio takes in the raw server in its setup
const io = socketio(server);

const publicDirectory = path.join(__dirname,'../public');
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDirectory));

let count = 0;

io.on('connection',(socket)=>{ //connection is the event.
    console.log('New WebSocket connection');
    socket.emit('countUpdated', count);

    socket.on('increment',()=>{
        count++;
        socket.emit('countUpdated',count);
    })
});

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
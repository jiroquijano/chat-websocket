const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages');

const app = express();
//instead of express creating the server in the background, we manually call
//http.createServer so that we'll have the raw http server returned
const server = http.createServer(app);
//because socketio takes in the raw server in its setup
const io = socketio(server);

const publicDirectory = path.join(__dirname,'../public');
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDirectory));

io.on('connection',(socket)=>{ //connection is the event.
    console.log('New WebSocket connection');
    socket.emit('message',generateMessage('Welcome'));

    //broadcast.emit emits the message to all clients except for the current socket    
    socket.broadcast.emit('message', generateMessage('A new user has joined!')); 
    socket.on('sendMessage',(data, callback) =>{
        const filter = new Filter();
        if(filter.isProfane(data)){
            return callback('Profane word detected');
        }
        io.emit('message',generateMessage(data));
        callback();
    });

    socket.on('sendLocation', (data,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`));
        callback();
    });

    socket.on('disconnect',()=>{ //disconnect is called within the .on connection
        io.emit('message', generateMessage('A user left the convo'));
    });
});

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
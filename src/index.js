const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

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

    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUser({id:socket.id, username, room});
        
        if(error) {
            return callback(error);
        }

        //socket join is used for grouping clients to a specific 'room'
        socket.join(user.room);

        console.log('New WebSocket connection');
        socket.emit('message',generateMessage('Admin',`Welcome to the ${user.room} room!`));
        //broadcast.emit emits the message to all clients except for the current socket   
        //using the to() method further specifies which client group should the event be emitted to 
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`)); 
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    });

    socket.on('sendMessage',(data, callback) =>{
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(data)){
            return callback('Profane word detected');
        }
        io.to(user.room).emit('message',generateMessage(user.username,data));
        callback();
    });

    socket.on('sendLocation', (data,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://www.google.com/maps?q=${data.latitude},${data.longitude}`));
        callback();
    });

    socket.on('disconnect',()=>{ //disconnect is called within the .on connection
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} left the ${user.room} room`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        };
    });

});

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
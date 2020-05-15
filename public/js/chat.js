const socket = io();

socket.on('message',(data)=>{
    console.log(data);
});

document.querySelector('#submit').addEventListener('click',(e)=>{
    e.preventDefault();
    const input = document.querySelector('.textarea').value;
    socket.emit('sendMessage', input);
});
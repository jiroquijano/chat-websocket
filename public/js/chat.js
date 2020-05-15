const socket = io();

socket.on('message',(data)=>{
    console.log(data);
});

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = e.target.elements.message.value;
    socket.emit('sendMessage', input);
});
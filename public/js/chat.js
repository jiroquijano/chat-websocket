const socket = io();

socket.on('countUpdated',(data)=>{
    document.querySelector('h1').innerText = data;
});

document.querySelector('#increment').addEventListener('click', (event)=>{
    socket.emit('increment');
})

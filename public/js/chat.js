const socket = io();

socket.on('countUpdated',(data)=>{
    console.log(`The count: ${data}`);
});
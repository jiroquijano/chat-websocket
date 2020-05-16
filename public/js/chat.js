const socket = io();

socket.on('message',(data)=>{
    console.log(data);
});

socket.on('sendLocation', (data)=>{
    console.log(data);
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = e.target.elements.message.value;
    socket.emit('sendMessage', input, (error)=>{
        if(error){
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click',(e)=>{
    if(!navigator.geolocation) return alert('Geolocation not supported by browser');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    });
});
const socket = io();

// Elements
const DOMElements = {
    messageForm : document.querySelector('#message-form'),
    messageFormInput : document.querySelector('#message-form input'),
    messageFormButton : document.querySelector('#message-form button'),
    sendLocationButton : document.querySelector('#send-location')
};

socket.on('message',(data)=>{
    console.log(data);
});

socket.on('sendLocation', (data)=>{
    console.log(data);
})

DOMElements.messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    DOMElements.messageFormButton.disabled = true;
    const input = e.target.elements.message.value;
    socket.emit('sendMessage', input, (error)=>{
        DOMElements.messageFormButton.disabled = false;
        DOMElements.messageFormInput.value = '';
        DOMElements.messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click',(e)=>{
    DOMElements.sendLocationButton.disabled = true;
    if(!navigator.geolocation) return alert('Geolocation not supported by browser');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            DOMElements.sendLocationButton.disabled = false;
            console.log('location shared!');
        });
    });
});
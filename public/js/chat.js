const socket = io();

// Elements
const DOMElements = {
    messageForm : document.querySelector('#message-form'),
    messageFormInput : document.querySelector('#message-form input'),
    messageFormButton : document.querySelector('#message-form button'),
    sendLocationButton : document.querySelector('#send-location'),
    messages: document.querySelector('#messages')
};

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//Options
//ignoreQueryPrefix option is for well, ignoring the prefix which is '?' in this case
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

socket.on('message',(data)=>{
    console.log(data);
    const html = Mustache.render(messageTemplate,{
        message: data.message,
        createdAt: moment(data.createdAt).format('h:mm:ss a')
    });
    DOMElements.messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (data)=>{
    console.log(data);
    const html = Mustache.render(locationTemplate,{
        location: data.url,
        createdAt: moment(data.createdAt).format('h:mm:ss a')
    });
    DOMElements.messages.insertAdjacentHTML('beforeend',html);
});

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

DOMElements.sendLocationButton.addEventListener('click',(e)=>{
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

socket.emit('join', {username, room});
const generateMessage = (user,message) =>{
    return {
        user,
        message,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (user,message)=>{
    return {
        user,
        url: message,
        createdAt: new Date().getTime()
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage
};
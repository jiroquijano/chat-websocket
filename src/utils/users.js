const users = [];

const addUser = ({id, username, room})=>{
    [username,room] = [username,room].map(curr=>curr.toLowerCase().trim());
    if(!username || !room){
        return {
            error: 'username and room are required!'
        }
    };
    const existingUser = users.find((curr)=>{
        return (curr.username === username && curr.room === room);
    });

    if(existingUser){
        return {
            error: 'username already taken!'
        };
    };

    const user = {id,username,room};
    users.push(user);
    return {user};
};

const removeUser = (id) =>{
    const index = users.findIndex(curr=>curr.id === id);
    if(index => 0){
        return users.splice(index,1)[0];
    }
};

const getUser = (id) =>{
    return users.find((curr)=>{
        return curr.id === id;
    });
};

const getUsersInRoom = (room) =>{
    return users.filter((curr)=>{
        return curr.room === room;
    });
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};
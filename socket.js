var io;

const initializeSocket = (server) => {
    io = require('socket.io')(server);
    // var user;
    io.on('connection', function (socket) {
        // user = socket.handshake.query.user && JSON.parse(socket.handshake.query.user)
        socket.join('guest');
        // io.to('guest').emit('connected', `${user.id} joined the auction`);
    });
}

const emit = (event, payload, callback) =>
    io.emit(event, payload, callback);


const listen = (event, callback) =>
    io.on(event, callback);

module.exports = {
    initializeSocket,
    emit,
    listen
}
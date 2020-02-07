var io;

const initializeSocket = (server) => {
    io = require('socket.io')(server);

    var user;
    io.use(function (socket, next) {
            user = socket.handshake.query.user
            if (user) {
                //db call auth
                //then
                next();
                //catch
                // next(new Error('Authentication error'));
            } else {
                next(new Error('User id did not recieve'));
            }
        })
        .on('connection', function (socket) {
            socket.join('guest');
            io.to('guest').emit('connected', `${user.name} joined the auction`);
        });
}

const emit = (event, callback) =>
    io.emit(event, callback);


const listen = (event, callback) =>
    io.on(event, callback);

module.exports = {
    initializeSocket,
    emit,
    listen
}

const express = require('express');
const path = require('path');

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
//  include the staic file
app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
    // send signal to all except the user
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " joined the room");
    });
    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " exit the room");
    });
    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });
});

// listening port
server.listen(5000);
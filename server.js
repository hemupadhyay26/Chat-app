
const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.set('view engine', 'hbs');
app.get('/', (req, res) => {
    res.render("index");
});

//  include the static files

app.use(express.static(path.join(__dirname + "/public")));

app.get('*', (req, res) => {
    res.render("404error");
});

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
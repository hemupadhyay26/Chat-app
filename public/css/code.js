(function () {

    // select the main div page
    const app = document.querySelector('.app');
    const socket = io();
    // extract username
    let uname;
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        // activation of chat-screen
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // extract the message from the chat user write
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input ").value;
        if (message.length == 0) {
            return;
        }
        
        renderMessege("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // exit button function
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser",uname);
        app.querySelector(".join-screen").classList.add("active");
        app.querySelector(".chat-screen").classList.remove("active");
        window.location.herf = window.location.herf;
    });

    // run when the response from the socket is received
    socket.on("update", function(update)
    {
        renderMessege("update",update);
    });
    socket.on("chat", function(message)
    {
        renderMessege("other",message);
    });

    // it is use to printing the message;
    function renderMessege(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML =
                `<div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>`;
            messageContainer.appendChild(el);
        }
        else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML =
                `<div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>`;
            messageContainer.appendChild(el);
        }
        else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText =message;
            messageContainer.appendChild(el);
        }
        // scroll chat to end 
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
const socket = io();

const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const usersContainer = document.getElementById('users-container');

let currentUser = null;

// Login event
loginContainer.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value;
    nameInput.value = '';
    currentUser = name;
    socket.emit('new-user', name);
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
});

// Chat message event
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`${message} `, true, currentUser);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

// Receive chat message
socket.on('chat-message', data => {
    if (data.name !== currentUser) {
        appendMessage(`${data.name}: ${data.message}`, false, data.id);
    }
});

// User connected
socket.on('user-connected', data => {
    appendUser(data.name, data.id, true);
});

// User disconnected
socket.on('user-disconnected', data => {
    updateUserStatus(data.id, false);
});

function appendMessage(message, isYourMessage, id) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    if (isYourMessage) {
        messageElement.classList.add('your-message');
    } else {
        messageElement.classList.add('other-message');
    }
    messageContainer.append(messageElement);
}

function appendUser(name, id, isOnline) {
    let userElement = document.querySelector(`#user-${id}`);
    if (!userElement) {
        userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.id = `user-${id}`;
        usersContainer.append(userElement);
    }
    const statusElement = document.createElement('span');
    statusElement.classList.add('status');
    if (isOnline) {
        statusElement.classList.add('online');
    } else {
        statusElement.classList.add('offline');
    }
    userElement.textContent = name;
    userElement.prepend(statusElement);
}

function updateUserStatus(id, isOnline) {
    const userElement = document.querySelector(`#user-${id}`);
    if (userElement) {
        const statusElement = userElement.querySelector('.status');
        if (isOnline) {
            statusElement.classList.add('online');
            statusElement.classList.remove('offline');
        } else {
            statusElement.classList.add('offline');
            statusElement.classList.remove('online');
        }
    }
}

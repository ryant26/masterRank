import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3002');

function sendInvite(data) {
    socket.emit('groupInviteSend', data);
}

export { sendInvite };
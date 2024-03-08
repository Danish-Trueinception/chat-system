const readline = require('readline');
const io = require('socket.io-client');
const tty = require('tty');

// Change the following URL with your server's URL
const SERVER_URL = 'http://localhost:3000';

const socket = io(SERVER_URL);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


// Listen for messages from the server
socket.on('message', (data) => {
  console.log(`${data.name}: ${data.msg}`);
});

// Handle connection established
socket.on('connect', () => {
  console.log(`Connected to server at ${SERVER_URL}`);

  rl.prompt();

  rl.on('line', (input) => {
    // Send message to the server
    let payload = {
      name: "client1",
      msg: input,
      to: "client2"
    }
    socket.send(payload);
    rl.prompt();
  });
});

// Handle connection closed
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Handle errors
socket.on('error', (error) => {
  console.error('Error:', error);
});


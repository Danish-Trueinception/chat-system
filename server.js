const { Server } = require("socket.io");

const server = new Server(3000);

const clients = [];

server.on('connection', (socket) => {
    console.log(`Client connected [id=${socket.id}]`);

    socket.on('message', (payload) => {
        addOrUpdateClient(socket, payload);

        // Find the client with the specified name and send the message to them
        const recipient = clients.find(client => client.name === payload.to);
        if (recipient) {
            socket.to(recipient.id).emit('message', payload);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected [id=${socket.id}]`);
        // Remove the disconnected client from the clients array
        const index = clients.findIndex(client => client.id === socket.id);
        if (index !== -1) {
            clients.splice(index, 1);
        }   
    });
});

console.log('Server is running on port 3000');

// Add or update a client in the clients array
function addOrUpdateClient(socket, payload) {
    const existingClientIndex = clients.findIndex(client => client.name === payload.name);
    if (existingClientIndex !== -1) {
        clients[existingClientIndex].id = socket.id;
    } else {
        clients.push({ id: socket.id, name: payload.name });
    }
}

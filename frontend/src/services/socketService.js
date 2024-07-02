import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

export const subscribeToPriceUpdates = (callback) => {
  socket.on('priceUpdate', (update) => {
    console.log('Received price update:', update);
    callback(update); // Pass data to the callback function provided by the component
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

import { io } from 'socket.io-client';

console.log(import.meta.env.VITE_SOCKET_URL);
console.log(window.location.origin);

const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
  withCredentials: true,
  transports: ['websocket'],
  // path: '/socket.io',
});

export default socket;

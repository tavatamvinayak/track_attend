import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('http://YOUR_SERVER_IP:3000', {
  transports: ['websocket'],
  autoConnect: false,
});

// echo.js
import Echo from 'laravel-echo';
import { io } from 'socket.io-client';

window.io = io;

const echo = new Echo({
  broadcaster: 'socket.io',
  host: 'http://127.0.0.1:6001', // change if using ngrok
  forceTLS: false,
  transports: ['websocket'],
});

export default echo;
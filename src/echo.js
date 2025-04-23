// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: 'pusher',
//   key: '375c5940c1883ff52e95', // e.g., 'app-key'
//   cluster: 'ap2', // e.g., 'ap2', 'mt1', etc.
//   forceTLS: true, // set to true if using https
//   encrypted: true,
//   disableStats: true,
//   authEndpoint: 'http://localhost:8000/broadcasting/auth',
//   auth: {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//     },
//   },
// });

// export default echo;
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const EchoInstance  = new Echo({
  broadcaster: "pusher",
  key: "375c5940c1883ff52e95",
  cluster: "ap2", // your cluster
  forceTLS: false,
  wsHost: window.location.hostname,
  wsPort: 6001,
  wssPort: 6001,
  enabledTransports: ["ws", "wss"],
  disableStats: true,
  authEndpoint: "http://localhost:8000/broadcasting/auth", // important
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      Accept: "application/json",
    },
  },
});

export default EchoInstance ;


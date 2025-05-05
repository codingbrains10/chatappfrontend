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

export default EchoInstance;



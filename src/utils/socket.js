import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

// keep a single socket instance
let socket;

export const createSocketConnection = () => {
  if (!socket) {
    if (location.hostname === "localhost") {
      socket = io(BASE_URL, {
        withCredentials: true,   // ✅ ensures cookies (auth) are sent
      });
    } else {
      socket = io("/", {
        path: "/api/socket.io",
        withCredentials: true,
      });
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

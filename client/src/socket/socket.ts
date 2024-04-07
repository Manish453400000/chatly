import io from "socket.io-client";
import { LocalStorage } from "../utils";

const token = LocalStorage.get("token");
const socket = io('http://localhost:8080', {
  withCredentials: true,
  auth: { token }
});

export { socket }
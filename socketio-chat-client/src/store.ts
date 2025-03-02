import { configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./features/chat/chatSlice";
import { io, Socket } from "socket.io-client";

export let socket: Socket | undefined;

export function connectSocket(): void {
  socket = io("ws://localhost:3000");
}

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export type RootAppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "./types";

export const useChat = () => {
  const [socket, setSocket] = useState<Socket>();
  const [userID, setUserID] = useState<string>();
  const [roomID, setRoomID] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io(`ws://localhost:3000`);
    setSocket(socket);

    socket.on("system_message", (message) => {
      console.log("[system_message]: ", message);
    });

    socket.on("system_event", (payload) => {
      // system_eventのpayload
      // { event: <event名>, body: <{ user_id, room_id }> }
      const { event, body } = payload;
      switch (event) {
        case "profile":
          const { user_id: userID, room_id: roomID } = JSON.parse(body);
          setUserID(userID);
          setRoomID(roomID);
          break;
        default:
          console.log(`event ${event} not found`);
      }
    });

    socket.on("chat_message", (payload) => {
      const { user_id: userID, message } = payload;
      const newMessage: ChatMessage = { userID: userID, message: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return (): void => {
      socket.disconnect();
    };
  }, []);

  const handleJoinChat = (roomID: string) => {
    if (!socket) {
      console.log("socket not found");
      return;
    }
    socket.emit("join_room", { room_id: roomID });
  };

  const handleSendChatMessage = (message: string) => {
    if (!socket) {
      console.log("socket not found");
      return;
    }
    if (!userID) {
      console.log("userID not found");
      return;
    }
    const newMessage: ChatMessage = { userID, message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("send_chat_message", { room_id: roomID, message: message });
  };

  return {
    userID,
    roomID,
    messages,
    handleJoinChat,
    handleSendChatMessage,
  };
};

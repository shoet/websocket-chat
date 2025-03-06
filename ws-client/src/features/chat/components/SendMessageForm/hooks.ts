import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks";
import { useChatWebSocket } from "../ChatWebSocketProvider";

export const useSendMessage = () => {
  const clientID = useAppSelector((state) => state.chat.profile.clientID);
  const roomID = useAppSelector((state) => state.chat.profile.roomID);
  const { sendMessageToRoom } = useChatWebSocket();
  const [message, setMessage] = useState<string>();

  const handleOnChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleSubmit = (formData: FormData) => {
    if (!roomID || !clientID) {
      return;
    }
    const message = formData.get("message");
    if (!message) {
      return;
    }
    sendMessageToRoom(clientID, roomID, message.toString());
    setMessage("");
  };

  return { message, handleOnChangeMessage, handleSubmit };
};

import React, { useState } from "react";
import { useChat } from "../../hooks";

export const useSendMessage = () => {
  const { handleSendChatMessage } = useChat();
  const [message, setMessage] = useState<string>();

  const handleOnChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value) {
      setMessage(e.target.value);
    }
  };

  const handleSubmit = (formData: FormData) => {
    const message = formData.get("message");
    if (!message) {
      return;
    }
    handleSendChatMessage(message.toString());
  };

  return { message, handleOnChangeMessage, handleSubmit };
};

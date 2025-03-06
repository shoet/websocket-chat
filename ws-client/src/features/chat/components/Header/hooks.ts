import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks";
import { useChatWebSocket } from "../ChatWebSocketProvider";

export const useHeader = () => {
  // const { clientID, roomID } = useAppSelector((state) => state.chat.profile);
  const clientID = useAppSelector((state) => state.chat.profile.clientID);
  const roomID = useAppSelector((state) => state.chat.profile.roomID);
  const { joinRoom } = useChatWebSocket();

  const [localRoomID, setLocalRoomID] = useState<string | undefined>(roomID);

  const submitJoinRoom = (formData: FormData) => {
    const roomID = formData.get("room_id");
    const userID = formData.get("user_id");
    if (!roomID || !userID) {
      return;
    }
    joinRoom(userID.toString(), roomID.toString());
  };

  const handleOnChangeRoomID = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value) {
      setLocalRoomID(e.target.value);
    }
  };

  const joined = roomID != undefined;

  return {
    clientID,
    roomID,
    localRoomID,
    joined,
    handleOnChangeRoomID,
    submitJoinRoom,
  };
};

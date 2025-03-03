import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks";
import { socket } from "../../../../store";

export const useHeader = () => {
  const { userID, roomID } = useAppSelector((state) => state.chat.profile);

  const [localRoomID, setLocalRoomID] = useState<string | undefined>(roomID);

  const submitJoinRoom = (formData: FormData) => {
    const roomID = formData.get("room_id");
    const userID = formData.get("user_id");
    if (!roomID || !userID) {
      return;
    }
    if (!socket) {
      console.log("socket not found");
      return;
    }
    socket.emit("join_room", { room_id: roomID });
  };

  const handleOnChangeRoomID = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value) {
      setLocalRoomID(e.target.value);
    }
  };

  const joined = roomID != undefined;

  return {
    userID,
    roomID,
    localRoomID,
    joined,
    handleOnChangeRoomID,
    submitJoinRoom,
  };
};

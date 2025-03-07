import { useAppSelector } from "../../../../hooks";
import { useChatWebSocket } from "../ChatWebSocketProvider";

export const useHeader = () => {
  const clientID = useAppSelector((state) => state.chat.profile.clientID);
  const roomID = useAppSelector((state) => state.chat.profile.roomID);
  const { joinRoom } = useChatWebSocket();

  const submitJoinRoom = (formData: FormData) => {
    const roomID = formData.get("room_id");
    const userID = formData.get("user_id");
    if (!roomID || !userID) {
      return;
    }
    joinRoom(userID.toString(), roomID.toString());
  };

  const joined = roomID != undefined;

  return {
    clientID,
    roomID,
    joined,
    submitJoinRoom,
  };
};

import { useChatWebSocket } from "../ChatWebSocketProvider";

export const Chat = () => {
  const { clientID, roomID, joinRoom } = useChatWebSocket();

  const handleJoinRoom = (formData: FormData) => {
    const roomID = formData.get("room_id");
    if (roomID) {
      joinRoom(roomID.toString());
    }
  };

  return (
    <div>
      <div>clientID: {clientID}</div>
      <div>roomID: {roomID}</div>
      <div>
        <form action={handleJoinRoom}>
          <input type="text" name="room_id" />
          <button type="submit">join</button>
        </form>
      </div>
    </div>
  );
};

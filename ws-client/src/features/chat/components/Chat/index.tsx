import { useChatWebSocket } from "../ChatWebSocketProvider";

export const Chat = () => {
  const { clientID, roomID, joinRoom, sendMessageToRoom } = useChatWebSocket();

  const handleJoinRoom = (formData: FormData) => {
    const roomID = formData.get("room_id");
    if (roomID) {
      joinRoom(roomID.toString());
    }
  };

  const handlePostMessage = (formData: FormData) => {
    const message = formData.get("message");
    if (roomID && message) {
      sendMessageToRoom(roomID, message.toString());
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
        <form action={handlePostMessage}>
          <input type="text" name="message" />
          <button type="submit">send</button>
        </form>
      </div>
    </div>
  );
};

import { useChat } from "../../hooks";
import { JoinRoomForm } from "../JoinRoomForm";
import { Messages } from "../Messages";
import { SenderForm } from "../Sender";
import { UserStatus } from "../UserStatus";

export const Chat = () => {
  const { userID, roomID, messages, handleJoinChat, handleSendChatMessage } =
    useChat();

  const handleSubmit = async (formData: FormData): Promise<void> => {
    if (!roomID) {
      console.log("room no set");
      return;
    }
    const message = formData.get("message");
    if (!message) {
      return;
    }
    handleSendChatMessage(message.toString());
  };

  const handleJoin = async (room: string): Promise<void> => {
    if (!room) {
      console.log("room no set");
      return;
    }
    handleJoinChat(room);
  };

  return (
    <div>
      <UserStatus userID={userID} roomID={roomID} />
      <JoinRoomForm onClickJoin={handleJoin} />
      <Messages messages={messages} />
      <SenderForm handleSubmit={handleSubmit} />
    </div>
  );
};

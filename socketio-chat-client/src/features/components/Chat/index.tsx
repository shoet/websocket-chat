import { useChat } from "../../hooks";
import { JoinRoomForm } from "../JoinRoomForm";
import { Messages } from "../Messages";
import { SenderForm } from "../Sender";
import { UserStatus } from "../UserStatus";

export const Chat = () => {
  const {
    id,
    room,
    messages,
    handleJoinChat,
    handleSendChatMessage,
    handleDisconnect,
  } = useChat();

  const handleSubmit = async (formData: FormData): Promise<void> => {
    if (!room) {
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
      <UserStatus id={id} room={room} />
      <JoinRoomForm onClickJoin={handleJoin} />
      <Messages messages={messages} />
      <SenderForm handleSubmit={handleSubmit} />
    </div>
  );
};

import { useChat } from "../../hooks";
import { Messages } from "../Messages";
import { SenderForm } from "../Sender";

export const Chat = () => {
  const { userID, roomID, messages, handleSendChatMessage } = useChat();

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

  return (
    <div>
      {userID && <Messages currentUserID={userID} messages={messages} />}
      <SenderForm handleSubmit={handleSubmit} />
    </div>
  );
};

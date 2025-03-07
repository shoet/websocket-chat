import clsx from "clsx";
import styles from "./index.module.css";
import { useMessages } from "./hooks";
import { Message } from "../../chatSlice";

export const Messages = () => {
  const { clientID, messages } = useMessages();

  console.log(clientID);
  console.log(messages);
  if (!clientID) {
    return null;
  }
  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) => (
        <ChatMessage clientID={clientID} message={msg} key={idx} />
      ))}
    </div>
  );
};

export const ChatMessage = (props: { clientID: string; message: Message }) => {
  const { clientID, message } = props;
  return (
    <div
      className={clsx(
        styles.message,
        message.clientID == clientID ? styles.messageMe : styles.messageOther
      )}
    >
      <div className={styles.messageName}>{message.clientID.slice(0, 5)}</div>
      <div className={styles.messageText}>{message.message}</div>
      <div className={styles.messageTime}>
        {new Date(message.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

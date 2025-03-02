import { useChat } from "../../hooks";
import styles from "./index.module.css";

export const Messages = () => {
  const { userID, messages } = useChat();

  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) =>
        msg.userID == userID ? (
          <MessageMe key={idx} message={msg.message} />
        ) : (
          <MessageOther key={idx} userID={msg.userID} message={msg.message} />
        )
      )}
    </div>
  );
};

export const MessageMe = (props: { message: string }) => {
  const { message } = props;
  return <div>[Me]: {message}</div>;
};

export const MessageOther = (props: { userID: string; message: string }) => {
  const { userID, message } = props;
  return (
    <div>
      [{userID}] {message}
    </div>
  );
};

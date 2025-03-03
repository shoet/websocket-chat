import clsx from "clsx";
import { useChat } from "../../hooks";
import styles from "./index.module.css";

export const Messages = () => {
  const { userID, messages } = useChat();

  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) =>
        msg.userID == userID ? (
          <div className={clsx(styles.message, styles.messageMe)} key={idx}>
            {msg.message}
          </div>
        ) : (
          <div className={clsx(styles.message, styles.messageOther)} key={idx}>
            {msg.message}
          </div>
        )
      )}
    </div>
  );
};

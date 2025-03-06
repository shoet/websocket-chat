import clsx from "clsx";
import styles from "./index.module.css";
import { useMessages } from "./hooks";

export const Messages = () => {
  const { clientID, messages } = useMessages();

  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) =>
        msg.clientID == clientID ? (
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

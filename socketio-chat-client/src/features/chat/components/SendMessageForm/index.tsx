import styles from "./index.module.css";
import { useSendMessage } from "./hooks";

export const SendMessageForm = () => {
  const { message, handleOnChangeMessage, handleSubmit } = useSendMessage();
  return (
    <form action={handleSubmit}>
      <div className={styles.sendMessageForm}>
        <input
          className={styles.messageForm}
          type="text"
          name="message"
          placeholder="メッセージを入力"
          value={message}
          onChange={handleOnChangeMessage}
        />
        <button className={styles.sendMessageButton} type="submit"></button>
      </div>
    </form>
  );
};

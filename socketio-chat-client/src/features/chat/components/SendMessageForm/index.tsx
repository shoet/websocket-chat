import styles from "./index.module.css";
import { useSendMessage } from "./hooks";
import { PaperPlaneIcon } from "../../../../components/Icons";

export const SendMessageForm = () => {
  const { message, handleOnChangeMessage, handleSubmit } = useSendMessage();
  return (
    <form action={handleSubmit}>
      <div className={styles.sendMessageForm}>
        <input
          className={styles.inputMessage}
          type="text"
          name="message"
          placeholder="メッセージを入力"
          value={message}
          onChange={handleOnChangeMessage}
        />
        <button className={styles.sendButton} type="submit">
          <PaperPlaneIcon size="20px" color="white" />
        </button>
      </div>
    </form>
  );
};

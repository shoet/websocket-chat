import { Header } from "../Header";
import { Messages } from "../Messages";
import { SendMessageForm } from "../SendMessageForm";
import styles from "./index.module.css";

export const Chat = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.messages}>
        <Messages />
      </div>
      <div className={styles.sendForm}>
        <SendMessageForm />
      </div>
    </div>
  );
};

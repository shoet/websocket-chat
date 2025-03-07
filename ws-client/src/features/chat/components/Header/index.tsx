import { UserIcon } from "../../../../components/Icons";
import { useHeader } from "./hooks";
import styles from "./index.module.css";

export const Header = () => {
  const { clientID, roomID, submitJoinRoom, joined } = useHeader();
  return (
    <form action={submitJoinRoom}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <span className={styles.profileIcon}>
            <UserIcon size="20px" color="white" />
          </span>
          <span className={styles.userID}>{clientID}</span>
          <input name="user_id" type="hidden" value={clientID || ""} />
        </div>
        <div className={styles.roomForm}>
          {joined ? (
            <div className={styles.joinedRoomID}>Joined room [ {roomID} ]</div>
          ) : (
            <input
              className={styles.inputRoom}
              name="room_id"
              type="text"
              placeholder="RoomID"
            />
          )}
        </div>
      </div>
    </form>
  );
};

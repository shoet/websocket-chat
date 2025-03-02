import { useHeader } from "./hooks";
import styles from "./index.module.css";

export const Header = () => {
  const { userID, localRoomID, submitJoinRoom, joined } = useHeader();
  return (
    <form action={submitJoinRoom}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <span className={styles.profileIcon}>アイコン</span>
          <span className={styles.userID}>{userID}</span>
          <input name="user_id" type="hidden" value={userID} />
        </div>
        <div className={styles.roomForm}>
          {joined ? (
            <div className={styles.joinedRoomID}>
              Joined room [ {localRoomID} ]
            </div>
          ) : (
            <input
              className={styles.inputRoom}
              name="room_id"
              type="text"
              placeholder="RoomID"
              value={localRoomID}
            />
          )}
        </div>
      </div>
    </form>
  );
};

import { UserIcon } from "../../../../components/Icons";
import { useHeader } from "./hooks";
import styles from "./index.module.css";

export const Header = () => {
  const { userID, roomID, localRoomID, submitJoinRoom, joined } = useHeader();
  return (
    <form action={submitJoinRoom}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <span className={styles.profileIcon}>
            <UserIcon size="20px" color="white" />
          </span>
          <span className={styles.userID}>{userID}</span>
          <input name="user_id" type="hidden" value={userID} />
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
              value={localRoomID}
            />
          )}
        </div>
      </div>
    </form>
  );
};

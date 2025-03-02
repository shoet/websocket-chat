type Props = {
  userID?: string;
  roomID?: string;
};

export const UserStatus = (props: Props) => {
  const { userID, roomID } = props;
  return (
    <div>
      <div>ID: {userID}</div>
      <div>ROOM: {roomID}</div>
    </div>
  );
};

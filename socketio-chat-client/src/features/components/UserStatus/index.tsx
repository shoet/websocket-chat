type Props = {
  id?: string;
  room?: string;
};

export const UserStatus = (props: Props) => {
  const { id, room } = props;
  return (
    <div>
      <div>ID: {id}</div>
      <div>ROOM: {room}</div>
    </div>
  );
};

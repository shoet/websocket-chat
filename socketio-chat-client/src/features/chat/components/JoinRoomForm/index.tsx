import { useState } from "react";

type Props = {
  onClickJoin: (room: string) => Promise<void>;
};

export const JoinRoomForm = (props: Props) => {
  const { onClickJoin } = props;
  const [room, setRoom] = useState<string>();
  const handleOnChangeRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.value || e.target.value == "") {
      return;
    }
    setRoom(e.target.value);
  };

  const handleOnClickJoin = async (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!room) {
      return;
    }
    await onClickJoin(room);
  };

  return (
    <div>
      <input type="text" name="room" onChange={handleOnChangeRoom} />
      <button onClick={handleOnClickJoin}>join</button>
    </div>
  );
};

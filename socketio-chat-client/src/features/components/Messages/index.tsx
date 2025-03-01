import { ChatMessage } from "../../hooks";

type Props = {
  currentUserID: string;
  messages: ChatMessage[];
};
export const Messages = (props: Props) => {
  const { currentUserID, messages } = props;

  return (
    <div>
      {messages.map((msg, idx) =>
        msg.userID == currentUserID ? (
          <MessageMe key={idx} message={msg.message} />
        ) : (
          <MessageOther key={idx} userID={msg.userID} message={msg.message} />
        )
      )}
    </div>
  );
};

export const MessageMe = (props: { message: string }) => {
  const { message } = props;
  return <div>[Me]: {message}</div>;
};

export const MessageOther = (props: { userID: string; message: string }) => {
  const { userID, message } = props;
  return (
    <div>
      [{userID}] {message}
    </div>
  );
};

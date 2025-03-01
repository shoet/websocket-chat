type Props = {
  messages: string[];
};
export const Messages = (props: Props) => {
  const { messages } = props;

  return (
    <div>
      {messages.map((msg) => (
        <div>{msg}</div>
      ))}
    </div>
  );
};

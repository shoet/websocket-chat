type Props = {
  handleSubmit: (formData: FormData) => Promise<void>;
};

export const SenderForm = (props: Props) => {
  const { handleSubmit } = props;
  return (
    <form action={handleSubmit}>
      <input type="text" name="message" />
      <button type="submit">送信</button>
    </form>
  );
};

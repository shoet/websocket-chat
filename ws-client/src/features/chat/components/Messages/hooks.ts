import { useAppSelector } from "../../../../hooks";

export const useMessages = () => {
  const messages = useAppSelector((state) => state.chat.messages);
  const clientID = useAppSelector((state) => state.chat.profile.clientID);

  return { clientID, messages };
};

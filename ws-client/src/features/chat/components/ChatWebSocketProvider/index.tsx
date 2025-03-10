import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "../../../../hooks";
import { changeRoom, receiveChatMessage, updateProfile } from "../../chatSlice";

class ChatWebSocketConnection {
  private host: string;
  private socket: WebSocket;

  constructor(props: {
    host: string;
    openCb?: (socket: WebSocket) => void;
    messageCb?: (message: string) => void;
  }) {
    const { host, openCb, messageCb } = props;

    this.host = host;
    this.socket = new WebSocket(`${this.host}`);

    this.socket.addEventListener("open", () => {
      openCb && openCb(this.socket);
    });

    this.socket.addEventListener("message", (message) => {
      messageCb && messageCb(message.data);
    });
  }

  sendMessage = (message: string) => {
    this.socket.send(message);
  };

  close = () => {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  };
}

type ChatWebSocketContextValue = {
  joinRoom: (clientID: string, roomID: string) => void;
  sendMessageToRoom: (
    clientID: string,
    roomID: string,
    message: string
  ) => void;
};

const ChatWebSocketContext = createContext<ChatWebSocketContextValue>({
  joinRoom: () => {},
  sendMessageToRoom: () => {},
});

export const useChatWebSocket = () => useContext(ChatWebSocketContext);

function requestLog(message: string): void {
  const { type, data } = JSON.parse(message);
  console.log(`[${type}] ${data}`);
}

type MessagePayload =
  | { type: "init_profile"; data: { client_id: string } }
  | { type: "update_profile"; data: { client_id: string; room_id: string } }
  | { type: "system_message"; data: { message: string } }
  | {
      type: "chat_message";
      data: {
        room_id: string;
        client_id: string;
        message: string;
        timestamp: number;
      };
    };

export const ChatWebSocketContextProvider = (props: {
  host: string;
  children: ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [connection, setConnection] = useState<ChatWebSocketConnection>();

  useEffect(() => {
    const connection = new ChatWebSocketConnection({
      host: props.host,
      openCb: (socket: WebSocket) => {
        console.log("[log] connected");
        // Connectionが確立したタイミングでpingを送信
        if (socket.readyState === WebSocket.OPEN) {
          socket.send("ping");
        }
      },
      messageCb: (message) => {
        requestLog(message);
        const { type, data }: MessagePayload = JSON.parse(message);
        switch (type) {
          case "init_profile":
            dispatch(updateProfile({ clientID: data.client_id }));
            break;
          case "update_profile":
            if (data.client_id) {
              dispatch(updateProfile({ clientID: data.client_id }));
            }
            if (data.room_id) {
              dispatch(updateProfile({ roomID: data.room_id }));
            }
            break;
          case "chat_message":
            dispatch(
              receiveChatMessage({
                clientID: data.client_id,
                roomID: data.room_id,
                message: data.message,
                timestamp: data.timestamp,
              })
            );
            break;
          case "system_message":
            console.log(data.message);
            break;
          default:
            throw new Error(`unknown type: ${type}`);
        }
      },
    });
    setConnection(connection);
    return connection.close();
  }, []);

  const joinRoom = (clientID: string, roomID: string) => {
    if (connection && clientID) {
      connection.sendMessage(
        JSON.stringify({
          type: "join_room",
          data: { room_id: roomID, client_id: clientID },
        })
      );
      dispatch(changeRoom);
    }
  };

  const sendMessageToRoom = (
    clientID: string,
    roomID: string,
    message: string
  ) => {
    if (connection && clientID) {
      connection.sendMessage(
        JSON.stringify({
          type: "chat_message",
          data: { room_id: roomID, client_id: clientID, message: message },
        })
      );
    }
  };

  return (
    <ChatWebSocketContext.Provider
      value={{
        joinRoom,
        sendMessageToRoom,
      }}
    >
      {props.children}
    </ChatWebSocketContext.Provider>
  );
};

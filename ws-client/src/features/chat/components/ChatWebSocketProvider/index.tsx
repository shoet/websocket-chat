import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "../../../../hooks";
import {
  changeRoom,
  Message,
  receiveChatMessage,
  saveLocalChatMessages,
  updateProfile,
} from "../../chatSlice";

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

  sendCustomMessage = (message: string) => {
    this.socket.send(
      JSON.stringify({ action: "custom_event", message: message })
    );
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

const tryParseMessage = (message: string): MessagePayload | undefined => {
  try {
    return JSON.parse(message);
  } catch (e) {
    console.log("failed to parse request");
  }
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
        if (message === "") {
          // 空文字のメッセージが飛んでくることがあるため無視する
          return;
        }
        const request = tryParseMessage(message);
        if (!request) {
          return;
        }
        const { type, data } = request;
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
            console.log("unknown action", type);
        }
      },
    });
    setConnection(connection);
    return connection.close();
  }, []);

  const joinRoom = (clientID: string, roomID: string) => {
    if (connection && clientID) {
      connection.sendCustomMessage(
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
      const now = Date.now();
      const newMessage: Message = {
        clientID,
        message,
        timestamp: now,
      };
      dispatch(saveLocalChatMessages({ message: newMessage }));
      connection.sendCustomMessage(
        JSON.stringify({
          type: "chat_message",
          data: {
            room_id: roomID,
            client_id: clientID,
            message: message,
            timestamp: now,
          },
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

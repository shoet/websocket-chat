import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

class ChatWebSocketConnection {
  private host: string;
  private socket: WebSocket;

  constructor(props: {
    host: string;
    openCb?: () => void;
    messageCb?: (message: string) => void;
  }) {
    const { host, openCb, messageCb } = props;

    this.host = host;
    this.socket = new WebSocket(`ws://${this.host}`);

    this.socket.addEventListener("open", () => {
      openCb && openCb();
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
  clientID?: string;
  roomID?: string;
  joinRoom: (roomID: string) => void;
  sendMessage: (message: string) => void;
  sendMessageToRoom: (roomID: string, message: string) => void;
};

const ChatWebSocketContext = createContext<ChatWebSocketContextValue>({
  joinRoom: () => {},
  sendMessage: () => {},
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
  | { type: "system_message"; data: { message: string } };

export const ChatWebSocketContextProvider = (props: {
  children: ReactNode;
}) => {
  const [connection, setConnection] = useState<ChatWebSocketConnection>();
  const [clientID, setClientID] = useState<string>();
  const [roomID, setRoomID] = useState<string>();

  useEffect(() => {
    const connection = new ChatWebSocketConnection({
      host: "localhost:3000",
      openCb: () => {
        console.log("[log] connected");
      },
      messageCb: (message) => {
        requestLog(message);
        const { type, data }: MessagePayload = JSON.parse(message);
        switch (type) {
          case "init_profile":
            setClientID(data.client_id);
            break;
          case "update_profile":
            if (data.client_id) {
              setClientID(data.client_id);
            }
            if (data.room_id) {
              setRoomID(data.room_id);
            }
            break;
          case "system_message":
            break;
          default:
            throw new Error(`unknown type: ${type}`);
        }
        console.log("[log] receive message");
        console.log(message);
      },
    });
    setConnection(connection);
    return connection.close();
  }, []);

  useEffect(() => {
    console.log(clientID);
  }, [clientID]);

  const joinRoom = (roomID: string) => {
    if (connection && clientID) {
      connection.sendMessage(
        JSON.stringify({
          type: "join_room",
          data: { room_id: roomID, client_id: clientID },
        })
      );
    }
  };

  const sendMessage = (message: string) => {};

  const sendMessageToRoom = (roomID: string, message: string) => {};

  return (
    <ChatWebSocketContext.Provider
      value={{
        clientID,
        roomID,
        joinRoom,
        sendMessage,
        sendMessageToRoom,
      }}
    >
      {props.children}
    </ChatWebSocketContext.Provider>
  );
};

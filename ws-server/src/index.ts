import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 3000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

const connections = new Map<ClientID, WebSocket>();

type RoomID = string;
type ClientID = string;
const rooms = new Map<RoomID, ClientID[]>();
const chatRooms = new Map<RoomID, ChatMessage[]>();

type ChatMessage = {
  clientID: string;
  roomID: string;
  message: string;
  timestamp: number;
};

type MessagePayload =
  | {
      type: "join_room";
      data: { room_id: string; client_id: string };
    }
  | {
      type: "chat_message";
      data: {
        room_id: string;
        client_id: string;
        message: string;
      };
    };

wss.on("connection", (socket) => {
  console.log("connected");
  const uuid = crypto.randomUUID();
  connections.set(uuid, socket);
  socket.send(
    JSON.stringify({ type: "init_profile", data: { client_id: uuid } })
  );

  socket.on("message", (message) => {
    const { type, data }: MessagePayload = JSON.parse(message.toString());
    switch (type) {
      case "join_room":
        joinRoom(data.room_id, data.client_id);
        socket.send(
          JSON.stringify({
            type: "update_profile",
            data: { client_id: data.client_id, room_id: data.room_id },
          })
        );
        broadCastInRoom(data.room_id, {
          type: "system_message",
          data: {
            message: `${data.client_id}さんが ${data.room_id}に入出しました。`,
          },
        });
        break;
      case "chat_message":
        const newChatMessage: ChatMessage = {
          clientID: data.client_id,
          roomID: data.room_id,
          message: data.message,
          timestamp: Date.now(),
        };
        const chatRoom = chatRooms.get(data.room_id) || [];
        chatRoom.push(newChatMessage);
        chatRooms.set(data.room_id, chatRoom);
        broadCastInRoom(data.room_id, {
          type: "chat_message",
          data: {
            client_id: data.client_id,
            room_id: data.room_id,
            message: data.message,
            timestamp: newChatMessage.timestamp,
          },
        });
        break;
      default:
        console.error(`uknown type: ${type}`);
    }
  });

  socket.on("close", (code, reason) => {
    console.log("closed client");
    console.log(code, reason);
  });
});

function joinRoom(roomID: string, userID: string): void {
  const userIDs = rooms.get(roomID);
  if (!userIDs || userIDs.length == 0) {
    rooms.set(roomID, [userID]);
  } else {
    userIDs.push(userID);
    rooms.set(roomID, userIDs);
  }
}

function broadCastInRoom(roomID: string, payload: any): void {
  rooms.get(roomID)?.forEach((userID) => {
    const socket = connections.get(userID);
    if (socket) {
      socket.send(JSON.stringify(payload));
    }
  });
}

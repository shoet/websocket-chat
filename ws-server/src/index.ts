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

const connections = new Map<string, WebSocket>();
const rooms = new Map<string, string>();

type MessagePayload = {
  type: "join_room";
  data: { room_id: string; client_id: string };
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
        rooms.set(data.client_id, data.room_id);
        socket.send(
          JSON.stringify({
            type: "update_profile",
            data: { client_id: data.client_id, room_id: data.room_id },
          })
        );
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

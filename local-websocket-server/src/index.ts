import { Server, Socket } from "socket.io";
import { ChatRoomRepository } from "./infrastracture/repository/repository";

const io = new Server(3000, {
  cors: {
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

const chatRoomRepository = new ChatRoomRepository();

io.on("connection", (socket) => {
  console.log("connected user");
  socket.emit("system_message", "hello chat");

  sendProfile(io, socket.id, { userID: socket.id });

  socket.on("join_room", async (payload) => {
    // join_room のPayload
    // { room_id }
    const { room_id: roomID } = payload;
    const userID = socket.id;
    let chatRoom = chatRoomRepository.getChatRoomByID(roomID);
    if (chatRoom == undefined) {
      chatRoom = chatRoomRepository.createChatRoom(roomID);
    }
    if (!chatRoom.isJoined(userID)) {
      chatRoom.joinUser(userID);
    }

    socket.join(chatRoom.getRoomID());
    sendProfile(io, userID, { userID, roomID: chatRoom.getRoomID() });
    sendSystemMessageInTheRoom(
      io,
      chatRoom.getRoomID(),
      `Joined user ${userID}`
    );

    console.log(
      `Room: [${chatRoom.getRoomID()}], CurrentUsers: [${chatRoom.getUserIDs()}]`
    );
  });

  socket.on("send_chat_message", (payload) => {
    // send_chat_messageのpayload
    // { room_id, message }
    const { room_id: roomID, message } = payload;
    const chatRoom = chatRoomRepository.getChatRoomByID(roomID);
    if (chatRoom == undefined) {
      console.log("room not found");
      return;
    }
    sendChatWithoutMeInTheRoom(socket, roomID, message);
  });
});

/**
 * ルーム内の自分以外のメンバーに`chat_message`をemitする
 */
function sendChatWithoutMeInTheRoom(
  socket: Socket,
  roomID: string,
  message: string
): void {
  socket.broadcast
    .in(roomID)
    .emit("chat_message", { user_id: socket.id, message: message });
}

/**
 * ルーム内の全員に`system_message`をemitする
 */
function sendSystemMessageInTheRoom(
  server: Server,
  roomID: string,
  message: string
): void {
  server.to(roomID).emit("system_message", message);
}

/**
 * 特定のユーザーに`system_message`をemitする
 */
function sendSystemMessageToUser(
  socket: Socket,
  userID: string,
  message: string
): void {
  // io.to(socket.id).emit("system_message", "特定の人に通知");
  socket.to(userID).emit("system_message", message);
}

/**
 * socketと接続中のユーザー以外の全員に`system_message`をemitする
 */
function sendSystemMessageWithoutMe(socket: Socket, message: string): void {
  socket.broadcast.emit("system_message", message);
}

type Profile = {
  userID: string;
  roomID?: string;
};

/**
 * userIDに対して`system_event`を通じて`profile`を送信する
 */
function sendProfile(server: Server, userID: string, profile: Profile): void {
  server.to(userID).emit("system_event", {
    event: "profile",
    body: JSON.stringify({
      user_id: profile.userID,
      room_id: profile.roomID,
    }),
  });
}

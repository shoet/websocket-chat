import { ChatRoom, ChatMessage } from "../../domain/chat";

export class ChatRoomRepository {
  private chatRooms: ChatRoom[];

  constructor() {
    this.chatRooms = [];
  }

  createChatRoom(roomID: string): ChatRoom {
    const newChatRoom = new ChatRoom(roomID);
    this.chatRooms.push(newChatRoom);
    return newChatRoom;
  }

  isExistRoom(roomID: string): boolean {
    return this.getChatRoomByID(roomID) != undefined;
  }

  getChatRoomByID(roomID: string): ChatRoom | undefined {
    const chats = this.chatRooms.filter((c) => roomID == c.getRoom());
    if (chats.length == 0) {
      return undefined;
    }
    return chats[0];
  }

  postMessageToChatRoom(roomID: string, message: ChatMessage): void {
    const chat = this.getChatRoomByID(roomID);
    if (!chat) {
      return;
    }
    chat.appendMessage(message);
  }
}

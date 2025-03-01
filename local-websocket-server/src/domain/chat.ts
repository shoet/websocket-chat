export class ChatRoom {
  private roomID: string;
  private messages: ChatMessage[];
  private userIDs: string[];

  constructor(room: string) {
    this.roomID = room;
    this.messages = [];
    this.userIDs = [];
  }

  getRoomID(): string {
    return this.roomID;
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getUserIDs(): string[] {
    return this.userIDs;
  }

  appendMessage(message: ChatMessage): void {
    this.messages = [...this.messages, message];
  }

  getRoom(): string {
    return this.roomID;
  }

  isJoined(userID: string): boolean {
    return this.userIDs.includes(userID);
  }

  joinUser(userID: string): void {
    this.userIDs.push(userID);
  }
}

export type ChatMessage = {
  id: string;
  message: string;
};

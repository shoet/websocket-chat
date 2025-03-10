import {
  IConnectionRepository,
  IRoomRepository,
  IChatMessageRepository,
} from "./repository";

export class ConnectionUsecase {
  private connectionRepository: IConnectionRepository;

  constructor(connectionRepository: IConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async run(clientID: string, connectionID: string) {
    await this.connectionRepository.saveConnection(clientID, connectionID);
  }
}

export class JoinRoomUsecase {
  private roomRepository: IRoomRepository;

  constructor(roomRepository: IRoomRepository) {
    this.roomRepository = roomRepository;
  }

  async run(roomID: string, clientID: string) {
    await this.roomRepository.saveUserRoom(roomID, clientID);
    // TODO: broadcat
  }
}

export class ChatMessageUsecase {
  private connectionRepository: IConnectionRepository;
  private roomRepository: IRoomRepository;
  private chatMessageRepository: IChatMessageRepository;

  constructor(
    connectionRepository: IConnectionRepository,
    roomRepository: IRoomRepository,
    chatMessageRepository: IChatMessageRepository
  ) {
    this.connectionRepository = connectionRepository;
    this.roomRepository = roomRepository;
    this.chatMessageRepository = chatMessageRepository;
  }

  async run(roomID: string, clientID: string, message: string) {
    // TODO: saveChat
    // TODO: broadcast
  }
}

import * as ddb from "@aws-sdk/client-dynamodb";
import "./extensions";

export interface IConnectionRepository {
  saveConnection(clientID: string, connectionID: string): Promise<void>;
  getConnectionID(clientID: string): Promise<string | undefined>;
}

export interface IRoomRepository {
  saveUserRoom(roomID: string, clientID: string): Promise<void>;
}

export interface IChatMessageRepository {
  saveMessage(
    roomID: string,
    clientID: string,
    message: string,
    timestampUTC: number
  ): Promise<void>;
}

type ClientID = string;
type ConnectionID = string;
type RoomID = string;

export class LocalRoomRepository implements IRoomRepository {
  private rooms: Map<RoomID, ClientID[]>;

  constructor() {
    this.rooms = new Map();
  }

  async saveUserRoom(roomID: string, clientID: string): Promise<void> {
    const room = this.rooms.get(roomID);
    if (room) {
      room.push(clientID);
    } else {
      this.rooms.set(roomID, [clientID]);
    }
  }
}

class BaseDynamoDBRepository {
  protected ddbClient: ddb.DynamoDBClient;
  protected readonly ddbTableName: string;

  constructor(tableName: string) {
    this.ddbTableName = tableName;
    this.ddbClient = new ddb.DynamoDBClient({});
  }
}

export class ConnectionRepository
  extends BaseDynamoDBRepository
  implements IConnectionRepository
{
  constructor(tableName: string) {
    super(tableName);
  }

  async saveConnection(clientID: string, connectionID: string): Promise<void> {
    const now = new Date().toTimestampInSeconds();
    const putCommand = new ddb.PutItemCommand({
      TableName: this.ddbTableName,
      Item: {
        client_id: { S: clientID },
        connection_id: { S: connectionID },
        created_at: { N: now.toString() },
        updated_at: { N: now.toString() },
        expire_at: { N: now.toString() + 3600 }, // 1時間後にレコードを削除する
      },
    });
    try {
      await this.ddbClient.send(putCommand);
    } catch (e) {
      console.error("failed to saveConnection", e);
      throw e;
    }
  }

  async getConnectionID(clientID: string): Promise<string | undefined> {
    const getCommand = new ddb.GetItemCommand({
      TableName: this.ddbTableName,
      Key: {
        client_id: { S: clientID },
      },
    });
    try {
      const result = await this.ddbClient.send(getCommand);
      if (result.Item) {
        return result.Item["connection_id"].S;
      }
      return;
    } catch (e) {
      console.error("failed to saveConnection", e);
      throw e;
    }
  }
}

export class RoomRepository
  extends BaseDynamoDBRepository
  implements IRoomRepository
{
  constructor(tableName: string) {
    super(tableName);
  }

  async saveUserRoom(roomID: string, clientID: string): Promise<void> {
    const now = new Date().toTimestampInSeconds();
    const putCommand = new ddb.PutItemCommand({
      TableName: this.ddbTableName,
      Item: {
        room_id: { S: roomID },
        client_id: { S: clientID },
        created_at: { N: now.toString() },
        updated_at: { N: now.toString() },
      },
    });
    try {
      await this.ddbClient.send(putCommand);
    } catch (e) {
      console.error("failed to saveUserRoom", e);
      throw e;
    }
  }
}

export class ChatMessageRepository
  extends BaseDynamoDBRepository
  implements IChatMessageRepository
{
  constructor(tableName: string) {
    super(tableName);
  }

  async saveMessage(
    roomID: string,
    clientID: string,
    message: string,
    timestamp: number
  ): Promise<void> {
    const now = new Date().toTimestampInSeconds();
    const putCommand = new ddb.PutItemCommand({
      TableName: this.ddbTableName,
      Item: {
        room_id: { S: roomID },
        client_id: { S: clientID },
        message: { S: message },
        timestamp: { N: timestamp.toString() },
        created_at: { N: now.toString() },
        updated_at: { N: now.toString() },
        expire_at: { N: now.toString() + 3600 }, // 1時間後にレコードを削除する
      },
    });
    try {
      await this.ddbClient.send(putCommand);
    } catch (e) {
      console.error("failed to saveMessage", e);
      throw e;
    }
  }
}

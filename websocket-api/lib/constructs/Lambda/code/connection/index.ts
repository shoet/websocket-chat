import { Handler, APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import {
  ChatMessageRepository,
  ConnectionRepository,
  RoomRepository,
} from "./repository";
import { z } from "zod";
import {
  ApiGatewayManagementApiClient,
  GetConnectionCommand,
  GoneException,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

class ConnectionNotFoundError extends Error {
  readonly message: string;
  constructor() {
    super();
    this.message = "connection not found";
  }
}

var environment = z.object({
  CONNECTION_TABLE_NAME: z.string().min(1),
  ROOM_TABLE_NAME: z.string().min(1),
  CHAT_MESSAGE_TABLE_NAME: z.string().min(1),
  CALLBACK_URL: z.string().min(1),
});

type Environment = z.infer<typeof environment>;

function loadEnvironment(): Environment {
  const env = environment.safeParse(process.env);
  if (!env.success) {
    throw new Error("failed to load environment");
  }
  return env.data;
}

const env = loadEnvironment();

export const connectionHandler: Handler = async (
  event: APIGatewayProxyWebsocketEventV2,
  context
) => {
  const connectionID = event.requestContext.connectionId;

  const connectionRepository = new ConnectionRepository(
    env.CONNECTION_TABLE_NAME
  );
  const clientID = crypto.randomUUID();
  await connectionRepository.saveConnection(clientID, connectionID);

  return {
    statusCode: 200,
    body: JSON.stringify({
      type: "init_profile",
      data: { client_id: clientID },
    }),
  };
};

type CustomEventPayload =
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

export const customEventHandler: Handler = async (
  event: APIGatewayProxyWebsocketEventV2,
  context
) => {
  if (!event.body) {
    return;
  }
  const { action, message } = JSON.parse(event.body);
  const { type, data }: CustomEventPayload = JSON.parse(message);
  switch (type) {
    case "chat_message":
      await sendMessage(data.client_id, data.message);
      return { statusCode: 200 };

    case "join_room":
      await joinRoom(data.room_id, data.client_id);
      await sendMessage(
        data.client_id,
        JSON.stringify({
          type: "update_profile",
          data: { room_id: data.room_id },
        })
      );
      await sendMessageToRoom(
        data.room_id,
        JSON.stringify({
          type: "system_message",
          data: { message: `${data.client_id}さんが入室しました。` },
        })
      );
      return { statusCode: 200 };

    default:
      console.log("unknown type", type);
      return { statusCode: 200 };
  }
};

const joinRoom = async (roomID: string, clientID: string) => {
  const roomRepository = new RoomRepository(env.ROOM_TABLE_NAME);
  await roomRepository.saveUserRoom(roomID, clientID);
};

const sendMessageToRoom = async (roomID: string, message: string) => {
  const roomRepository = new RoomRepository(env.ROOM_TABLE_NAME);

  const room = await roomRepository.getRoom(roomID);
  if (!room) {
    throw new Error(`roomID not found: ${roomID}`);
  }

  await Promise.all(
    room.clientIDs.map((clientID) =>
      clientID
        ? sendMessage(clientID, message).catch(async (e) => {
            // GoneExceptionの場合はコネクションが破棄されているものとして、ルームから削除する
            if (
              e instanceof GoneException ||
              e instanceof ConnectionNotFoundError
            ) {
              await roomRepository.deleteFromRoom(room.roomID, clientID);
              console.log("deleted discarded connection", {
                clientID: clientID,
              });
            } else {
              console.error("failed to delete from room", e);
              throw e;
            }
          })
        : Promise.resolve()
    )
  );
};

const sendMessage = async (clientID: string, message: string) => {
  const callbackUrl = env.CALLBACK_URL;
  const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
  const connectionRepository = new ConnectionRepository(
    env.CONNECTION_TABLE_NAME
  );
  const connectionID = await connectionRepository.getConnectionID(clientID);
  if (!connectionID) {
    throw new ConnectionNotFoundError();
  }

  try {
    const getConnectionCommand = new GetConnectionCommand({
      ConnectionId: connectionID,
    });
    await client.send(getConnectionCommand);
  } catch (e) {
    if (e instanceof Error) {
      console.error("failed to get connection", e);
    } else {
      console.error("failed to get connection. occurred unknown error", e);
    }
    throw e;
  }

  try {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionID,
      Data: message,
    });
    await client.send(command);
  } catch (e) {
    if (e instanceof Error) {
      console.error("failed to sendMessage", e);
    } else {
      console.error("failed to sendMessage. occurred unknown error", e);
    }
    throw e;
  }
};

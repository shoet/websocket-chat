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
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

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
      const connectionRepository = new ConnectionRepository(
        env.CONNECTION_TABLE_NAME
      );
      const connectionID = await connectionRepository.getConnectionID(
        data.client_id
      );
      if (!connectionID) {
        console.error("connection not found");
        return {
          statusCode: 404,
        };
      }
      await sendMessage(connectionID, data.message);
      break;
    case "join_room":
      await joinRoom(data.room_id, data.client_id);
      break;

    default:
      console.log("unknown type", type);
  }

  return {
    statusCode: 200,
  };
};

const joinRoom = async (roomID: string, clientID: string) => {
  const roomRepository = new RoomRepository(env.ROOM_TABLE_NAME);
  await roomRepository.saveUserRoom(roomID, clientID);
};
const sendMessage = async (connectionID: string, message: string) => {
  const callbackUrl = env.CALLBACK_URL;
  const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

  const getConnectionCommand = new GetConnectionCommand({
    ConnectionId: connectionID,
  });
  try {
    await client.send(getConnectionCommand);
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
    };
  }

  const command = new PostToConnectionCommand({
    ConnectionId: connectionID,
    Data: message,
  });
  try {
    await client.send(command);
    return {
      statusCode: 200,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
    };
  }
};

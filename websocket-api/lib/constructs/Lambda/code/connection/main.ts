import {
  ChatMessageRepository,
  ConnectionRepository,
  RoomRepository,
} from "./repository";
import * as cfn from "@aws-sdk/client-cloudformation";
import "./extensions";

export async function main() {
  const cfnClient = new cfn.CloudFormationClient({});

  (async () => {
    const describeCommand = new cfn.DescribeStacksCommand({
      StackName: "WebsocketApiStack",
    });
    const result = await cfnClient.send(describeCommand);
    const stack = result.Stacks?.[0];
    if (!stack) {
      console.error("stack not found");
      return;
    }
    const connectionTableName = stack.Outputs?.find(
      (o) => o.OutputKey == "ConnectionTableName"
    )?.OutputValue;
    const roomTableName = stack.Outputs?.find(
      (o) => o.OutputKey == "RoomTableName"
    )?.OutputValue;
    const chatMessageTableName = stack.Outputs?.find(
      (o) => o.OutputKey == "ChatMessageTableName"
    )?.OutputValue;

    const clientID = crypto.randomUUID();
    if (connectionTableName) {
      const connectionRepository = new ConnectionRepository(
        connectionTableName
      );
      await connectionRepository.saveConnection(clientID, "connection id");
      const connectionID = await connectionRepository.getConnectionID(clientID);
      console.log(connectionID);
    }

    if (roomTableName) {
      const roomRepository = new RoomRepository(roomTableName);
      await roomRepository.saveUserRoom("room_a", clientID);
      const room = await roomRepository.getRoom("room_a");
      console.log(room);

      await roomRepository.deleteFromRoom("room_a", clientID);
    }

    if (chatMessageTableName) {
      const chatMessageRepository = new ChatMessageRepository(
        chatMessageTableName
      );
      await chatMessageRepository.saveMessage(
        "room_a",
        clientID,
        "hello message",
        Date.now()
      );
    }
  })();
}

(async () => {
  await main();
})();

import { Chat } from "./features/chat/components/Chat";
import { ChatWebSocketContextProvider } from "./features/chat/components/ChatWebSocketProvider";

function App() {
  return (
    <ChatWebSocketContextProvider>
      <Chat />
    </ChatWebSocketContextProvider>
  );
}

export default App;

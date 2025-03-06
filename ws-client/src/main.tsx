import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChatWebSocketContextProvider } from "./features/chat/components/ChatWebSocketProvider/index.tsx";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <ChatWebSocketContextProvider>
        <App />
      </ChatWebSocketContextProvider>
    </StoreProvider>
  </StrictMode>
);

// createConfiguration
// export AppSelector
// export AppDispatch

import { configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./features/chat/chatSlice";

export const store = configureStore({
  reducer: [chatReducer],
});

export type RootAppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

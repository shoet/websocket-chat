import { createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "./types";

export type Profile = {
  userID?: string;
  roomID?: string;
};

export type Error = {
  message: string;
};

export type ChatState = {
  profile: Profile;
  messages: ChatMessage[];
  systemMessage?: string;
  errors: Error[];
};

const initialState: ChatState = {
  profile: {},
  messages: [],
  errors: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    updateProfile: (
      state,
      action: { type: string; payload: { userID?: string; roomID?: string } }
    ) => {
      const profile = action.payload;
      state.profile = profile;
    },
    postChatMessage: (
      state,
      action: { type: string; payload: { message: ChatMessage } }
    ) => {
      const { message } = action.payload;
      state.messages.push(message);
    },
    notifySystemMessage: (
      state,
      action: { type: string; payload: { message: string } }
    ) => {
      const { message } = action.payload;
      state.systemMessage = message;
    },
    queueError: (
      state,
      action: { type: string; payload: { error: Error } }
    ) => {
      const { error } = action.payload;
      state.errors.push(error);
    },
    dequeueError: (state) => {
      if (state.errors.length == 0) {
        return;
      }
      state.errors.shift();
    },
    // xxx: (state, action: { type: string; payload: {} }) => {
    //   const {} = action.payload;
    // },
  },
});

export const {
  updateProfile,
  postChatMessage,
  notifySystemMessage,
  queueError,
  dequeueError,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

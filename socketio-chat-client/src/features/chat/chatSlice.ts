import { createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "./types";

export type ChatState = {
  currentRoomID?: string;
  userID?: string;
  messages: ChatMessage[];
};

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {},
});

export const {} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

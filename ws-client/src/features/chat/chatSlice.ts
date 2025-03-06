import { createSlice } from "@reduxjs/toolkit";

type Profile = {
  clientID?: string;
  roomID?: string;
};

type Message = {
  clientID: string;
  message: string;
  timestamp: number;
};

type ChatState = {
  profile: Profile;
  messages: Message[];
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    profile: {},
    messages: [],
  } as ChatState,
  reducers: {
    // xxx: (state, action: { type: string; payload: any }) => {},
    updateProfile: (
      state,
      action: { type: string; payload: { clientID?: string; roomID?: string } }
    ) => {
      const { clientID, roomID } = action.payload;
      if (clientID) {
        state.profile.clientID = clientID;
      }
      if (roomID) {
        state.profile.roomID = roomID;
      }
    },
    receiveChatMessage: (state, action: { type: string; payload: any }) => {},
    changeRoom: (state, action: { type: string; payload: any }) => {
      state.messages = []; // ルームが変更になったので初期化する
    },
  },
});

export const { updateProfile, changeRoom } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./fetchers/user/userSlice";
import ammoSlice from "./fetchers/ammo/ammoSlice";
import attackSlice from "./fetchers/attack/attackSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    ammo: ammoSlice,
    attack: attackSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

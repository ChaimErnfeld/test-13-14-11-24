import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./fetchers/user/userSlice";
import ammoSlice from "./fetchers/ammo/ammoSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    ammo: ammoSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../../types";

interface UserState {
  user: User | null;
  status: string;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: "",
};

export const registerUser = createAsyncThunk("user/register", async (user: User): Promise<User> => {
  const response = await axios.post("http://localhost:3000/api/register", user);
  const data = response.data;
  return data;
});

export const loginUser = createAsyncThunk(
  "login/uesr",
  async (user: { username: string; password: string }): Promise<User> => {
    const response = await axios.post("http://localhost:3000/api/login", user);
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;

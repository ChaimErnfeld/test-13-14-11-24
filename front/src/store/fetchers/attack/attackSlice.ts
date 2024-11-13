import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AmmoDetails } from "../../../types";
import axios from "axios";

interface AttackState {
  attack: AmmoDetails[];
  status: string;
  error: string | null;
}

const initialState: AttackState = {
  attack: [],
  status: "idle",
  error: "",
};

const getDetails = createAsyncThunk("attack/get", async (ammoName: string): Promise<AmmoDetails[]> => {
  const response = await axios.get(`http://localhost:3000/api/ammo/${ammoName}`);
  const data = response.data.data;
  return data;
});

export const attackSlice = createSlice({
  name: "attack",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attack = action.payload;
      })
      .addCase(getDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

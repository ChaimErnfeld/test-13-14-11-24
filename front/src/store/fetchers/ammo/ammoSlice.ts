import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Ammo } from "../../../types";

interface AmmoState {
  ammos: Ammo[];
  status: string;
  error: string | null;
}

const initialState: AmmoState = {
  ammos: [],
  status: "idle",
  error: "",
};

export const getAmmos = createAsyncThunk(
  "ammo/get",
  async (details: { organization: string; district?: string }): Promise<Ammo[]> => {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:3000/api/ammo", details, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data.data;
    return data;
  }
);

const ammoSlice = createSlice({
  name: "ammo",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAmmos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAmmos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ammos = action.payload;
      })
      .addCase(getAmmos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default ammoSlice.reducer;

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
    const token = sessionStorage.getItem("token");
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
  reducers: {
    updateAmountAmmo: (state, action) => {
      const updatedAmmo = action.payload;
      state.ammos = state.ammos.map((ammo) =>
        ammo.name === updatedAmmo.name ? { ...ammo, amount: updatedAmmo.amount } : ammo
      );
    },
  },
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
export const { updateAmountAmmo } = ammoSlice.actions;

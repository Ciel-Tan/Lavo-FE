import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ITuan, TuanState } from "../types/tuan.type";
import { createTuan, deleteTuan, getAllTuan, getTuanById, updateTuan } from "../services/tuan.service";

const initialState: TuanState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

export const fetchAllTuan = createAsyncThunk("tuan/fetchAll", async () => {
  const data = await getAllTuan();
  return data;
});

export const fetchTuanById = createAsyncThunk("tuan/fetchById", async (tuanId: string) => {
  const data = await getTuanById(tuanId);
  return data;
});

export const createTuanThunk = createAsyncThunk("tuan/create", async (payload: ITuan) => {
  const data = await createTuan(payload);
  return data;
});

export const updateTuanThunk = createAsyncThunk("tuan/update", async (payload: ITuan) => {
  const data = await updateTuan(payload);
  return data;
});

export const deleteTuanThunk = createAsyncThunk("tuan/delete", async (tuanId: string) => {
  await deleteTuan(tuanId);
  return tuanId;
});

const tuanSlice = createSlice({
  name: "tuan",
  initialState,
  reducers: {
    setSelectedTuan(state, action: PayloadAction<ITuan | null>) {
      state.selected = action.payload;
    },
    upsertTuan(state, action: PayloadAction<Partial<ITuan> & { Tuan_id: string }>) {
      const incoming = action.payload;
      const idx = state.items.findIndex((t) => t.Tuan_id === incoming.Tuan_id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...incoming } as ITuan;
      } else {
        state.items.unshift(incoming as ITuan);
      }
      if (state.selected && state.selected.Tuan_id === incoming.Tuan_id) {
        state.selected = { ...state.selected, ...incoming } as ITuan;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllTuan.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchAllTuan.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchAllTuan.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách tuần thất bại";
      })
      // Fetch by id
      .addCase(fetchTuanById.pending, (state) => {
        state.loadingSelected = true;
        state.error = null;
      })
      .addCase(fetchTuanById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchTuanById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.error.message ?? "Tải tuần thất bại";
      })
      // Create
      .addCase(createTuanThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTuanThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTuanThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Tạo tuần thất bại";
      })
      // Update
      .addCase(updateTuanThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTuanThunk.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((t) => t.Tuan_id === action.payload.Tuan_id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selected && state.selected.Tuan_id === action.payload.Tuan_id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateTuanThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Cập nhật tuần thất bại";
      })
      // Delete
      .addCase(deleteTuanThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteTuanThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((t) => t.Tuan_id !== action.payload);
        if (state.selected && state.selected.Tuan_id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteTuanThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Xoá tuần thất bại";
      });
  },
});

export const { setSelectedTuan, upsertTuan } = tuanSlice.actions;
export default tuanSlice.reducer;
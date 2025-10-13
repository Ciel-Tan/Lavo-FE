import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ITuanSanPham, TuanSanPhamState } from "../types/tuan_san_pham.type";
import { createTuanSanPham, getAllTuanSanPham, getTuanSanPhamById } from "../services/tuan_san_pham.service";

const initialState: TuanSanPhamState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

export const fetchAllTuanSanPham = createAsyncThunk("tuan_san_pham/fetchAll", async () => {
  const data = await getAllTuanSanPham();
  return data;
});

export const fetchTuanSanPhamById = createAsyncThunk("tuan_san_pham/fetchById", async (tuanId: string) => {
  const data = await getTuanSanPhamById(tuanId);
  return data;
});

export const createTuanSanPhamThunk = createAsyncThunk("tuan_san_pham/create", async (payload: ITuanSanPham) => {
  const data = await createTuanSanPham(payload);
  return data;
});

const tuanSanPhamSlice = createSlice({
  name: "tuan_san_pham",
  initialState,
  reducers: {
    setSelectedTuanSanPham(state, action: PayloadAction<ITuanSanPham | null>) {
      state.selected = action.payload;
    },
    upsertTuanSanPham(state, action: PayloadAction<Partial<ITuanSanPham> & { Tuan_id: string }>) {
      const incoming = action.payload;
      const idx = state.items.findIndex((t) => t.Tuan_id === incoming.Tuan_id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...incoming } as ITuanSanPham;
      } else {
        state.items.unshift(incoming as ITuanSanPham);
      }
      if (state.selected && state.selected.Tuan_id === incoming.Tuan_id) {
        state.selected = { ...state.selected, ...incoming } as ITuanSanPham;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllTuanSanPham.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchAllTuanSanPham.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchAllTuanSanPham.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách tuần thất bại";
      })
      // Fetch by id
      .addCase(fetchTuanSanPhamById.pending, (state) => {
        state.loadingSelected = true;
        state.error = null;
      })
      .addCase(fetchTuanSanPhamById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchTuanSanPhamById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.error.message ?? "Tải tuần thất bại";
      })
      // Create
      .addCase(createTuanSanPhamThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTuanSanPhamThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTuanSanPhamThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Tạo tuần thất bại";
      })
  },
});

export const { setSelectedTuanSanPham, upsertTuanSanPham } = tuanSanPhamSlice.actions;
export default tuanSanPhamSlice.reducer;
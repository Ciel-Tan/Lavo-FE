import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DongSanPhamState } from "../types/dong_san_pham.type";
import { createDongSanPham } from "../services/dong_san_pham.service";
import type { IDongSanPhamRow } from "../types/dong_san_pham.type";
import { getAllDongSanPham } from "../services/dong_san_pham.service";

const initialState: DongSanPhamState = {
  items: [],
  selected: null,
  loadingList: false,
  saving: false,
  error: null,
};

export const fetchAllDongSanPham = createAsyncThunk("dong_san_pham/fetchAll", async () => {
  const data = await getAllDongSanPham();
  return data;
});

export const createDongSanPhamThunk = createAsyncThunk("dong_san_pham/create", async (payload: IDongSanPhamRow) => {
  const data = await createDongSanPham(payload);
  return data;
});

const dongSanPhamSlice = createSlice({
  name: "dong_san_pham",
  initialState,
  reducers: {
    setSelectedDongSanPham(state, action: PayloadAction<IDongSanPhamRow | null>) {
      state.selected = action.payload;
    },
    upsertDongSanPham(state, action: PayloadAction<Partial<IDongSanPhamRow> & { Dong_sp_id: string }>) {
      const incoming = action.payload;
      const idx = state.items.findIndex((t) => t.Dong_sp_id === incoming.Dong_sp_id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...incoming } as IDongSanPhamRow;
      } else {
        state.items.unshift(incoming as IDongSanPhamRow);
      }
      if (state.selected && state.selected.Dong_sp_id === incoming.Dong_sp_id) {
        state.selected = { ...state.selected, ...incoming } as IDongSanPhamRow;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllDongSanPham.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchAllDongSanPham.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchAllDongSanPham.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách dòng sản phẩm thất bại";
      })
      // Create
      .addCase(createDongSanPhamThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createDongSanPhamThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createDongSanPhamThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Tạo dòng sản phẩm thất bại";
      })
  },
});

export const { setSelectedDongSanPham, upsertDongSanPham } = dongSanPhamSlice.actions;
export default dongSanPhamSlice.reducer;
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ISanPham, SanPhamState } from "../types/san_pham.type";
import { createSanPham, deleteSanPham, getAllSanPham, getSanPhamById, updateSanPham } from "../services/san_pham.service";

const initialState: SanPhamState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

export const fetchAllSanPham = createAsyncThunk("san_pham/fetchAll", async () => {
  const data = await getAllSanPham();
  return data;
});

export const fetchSanPhamById = createAsyncThunk("san_pham/fetchById", async (sanPhamId: string) => {
  const data = await getSanPhamById(sanPhamId);
  return data;
});

export const createSanPhamThunk = createAsyncThunk("san_pham/create", async (payload: ISanPham) => {
  const data = await createSanPham(payload);
  return data;
});

export const updateSanPhamThunk = createAsyncThunk("san_pham/update", async (payload: ISanPham) => {
  const data = await updateSanPham(payload);
  return data;
});

export const deleteSanPhamThunk = createAsyncThunk("san_pham/delete", async (sanPhamId: string) => {
  await deleteSanPham(sanPhamId);
  return sanPhamId;
});

const sanPhamSlice = createSlice({
  name: "san_pham",
  initialState,
  reducers: {
    setSelectedSanPham(state, action: PayloadAction<ISanPham | null>) {
      state.selected = action.payload;
    },
    upsertSanPham(state, action: PayloadAction<Partial<ISanPham> & { Ma_SKU: string }>) {
      const incoming = action.payload;
      const idx = state.items.findIndex((t) => t.Ma_SKU === incoming.Ma_SKU);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...incoming } as ISanPham;
      } else {
        state.items.unshift(incoming as ISanPham);
      }
      if (state.selected && state.selected.Ma_SKU === incoming.Ma_SKU) {
        state.selected = { ...state.selected, ...incoming } as ISanPham;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllSanPham.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchAllSanPham.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchAllSanPham.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách tuần thất bại";
      })
      // Fetch by id
      .addCase(fetchSanPhamById.pending, (state) => {
        state.loadingSelected = true;
        state.error = null;
      })
      .addCase(fetchSanPhamById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchSanPhamById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.error.message ?? "Tải tuần thất bại";
      })
      // Create
      .addCase(createSanPhamThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSanPhamThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createSanPhamThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Tạo tuần thất bại";
      })
      // Update
      .addCase(updateSanPhamThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSanPhamThunk.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((t) => t.Ma_SKU === action.payload.Ma_SKU);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selected && state.selected.Ma_SKU === action.payload.Ma_SKU) {
          state.selected = action.payload;
        }
      })
      .addCase(updateSanPhamThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Cập nhật tuần thất bại";
      })
      // Delete
      .addCase(deleteSanPhamThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteSanPhamThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((t) => t.Ma_SKU !== action.payload);
        if (state.selected && state.selected.Ma_SKU === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteSanPhamThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Xoá sản phẩm thất bại";
      });
  },
});

export const { setSelectedSanPham, upsertSanPham } = sanPhamSlice.actions;
export default sanPhamSlice.reducer;
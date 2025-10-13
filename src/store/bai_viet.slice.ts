import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBaiViet, BaiVietState } from "../types/bai_viet.type";
import { deleteBaiViet, getAllBaiViet, getBaiVietById, getBaiVietByTuanId } from "../services/bai_viet.service";

const initialState: BaiVietState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

export const fetchAllBaiViet = createAsyncThunk("bai_viet/fetchAll", async () => {
  const data = await getAllBaiViet();
  return data;
});

export const fetchBaiVietById = createAsyncThunk("bai_viet/fetchById", async (baiVietId: string) => {
  const data = await getBaiVietById(baiVietId);
  return data;
});

export const fetchBaiVietByTuanId = createAsyncThunk("bai_viet/fetchByTuanId", async (tuanId: string) => {
  const data = await getBaiVietByTuanId(tuanId);
  return data;
});

export const deleteBaiVietThunk = createAsyncThunk("bai_viet/delete", async (baiVietId: string) => {
  await deleteBaiViet(baiVietId);
  return baiVietId;
});

const baiVietSlice = createSlice({
  name: "bai_viet",
  initialState,
  reducers: {
    setSelectedBaiViet(state, action: PayloadAction<IBaiViet | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllBaiViet.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchAllBaiViet.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchAllBaiViet.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách bài viết thất bại";
      })
      // Fetch by id
      .addCase(fetchBaiVietById.pending, (state) => {
        state.loadingSelected = true;
        state.error = null;
      })
      .addCase(fetchBaiVietById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchBaiVietById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.error.message ?? "Tải tuần thất bại";
      })
      // Fetch by tuan id
      .addCase(fetchBaiVietByTuanId.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchBaiVietByTuanId.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload;
      })
      .addCase(fetchBaiVietByTuanId.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message ?? "Tải danh sách bài viết thất bại";
      })
      // Delete
      .addCase(deleteBaiVietThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteBaiVietThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((b) => b.Bai_viet_id !== action.payload);
        if (state.selected && state.selected.Bai_viet_id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteBaiVietThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Xoá tuần thất bại";
      });
  },
});

export const { setSelectedBaiViet } = baiVietSlice.actions;
export default baiVietSlice.reducer;
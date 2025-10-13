import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NenTangState } from "../types/nen_tang.type";
import { getAllDinhDang, getAllNenTang, getAllPhuongThucDang } from "../services/others.service";
import type { INenTang } from "../types/nen_tang.type";
import type { IPhuongThucDang, PhuongThucDangState } from "../types/phuong_thuc_dang.type";
import type { DinhDangState } from "../types/dinh_dang.type";

const initialState_nen_tang: NenTangState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

const initialState_phuong_thuc_dang: PhuongThucDangState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

const initialState_dinh_dang: DinhDangState = {
  items: [],
  selected: null,
  loadingList: false,
  loadingSelected: false,
  saving: false,
  error: null,
};

export const fetchAllNenTang = createAsyncThunk("nen_tang/fetchAll", async () => {
  const data = await getAllNenTang();
  return data;
});

export const fetchAllPhuongThucDang = createAsyncThunk("phuong_thuc_dang/fetchAll", async () => {
  const data = await getAllPhuongThucDang();
  return data;
});

export const fetchAllDinhDang = createAsyncThunk("dinh_dang/fetchAll", async () => {
  const data = await getAllDinhDang();
  return data;
});

const othersSlice = createSlice({
  name: "others",
  initialState: {
    nen_tang: initialState_nen_tang,
    phuong_thuc_dang: initialState_phuong_thuc_dang,
    dinh_dang: initialState_dinh_dang,
  },
  reducers: {
    setSelectedNenTang(state, action: PayloadAction<INenTang | null>) {
      state.nen_tang.selected = action.payload;
    },
    setSelectedPhuongThucDang(state, action: PayloadAction<IPhuongThucDang | null>) {
      state.phuong_thuc_dang.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllNenTang.pending, (state) => {
        state.nen_tang.loadingList = true;
        state.nen_tang.error = null;
      })
      .addCase(fetchAllNenTang.fulfilled, (state, action) => {
        state.nen_tang.loadingList = false;
        state.nen_tang.items = action.payload;
      })
      .addCase(fetchAllNenTang.rejected, (state, action) => {
        state.nen_tang.loadingList = false;
        state.nen_tang.error = action.error.message ?? "Tải danh sách nền tảng thất bại";
      })
      // Fetch all
      .addCase(fetchAllPhuongThucDang.pending, (state) => {
        state.phuong_thuc_dang.loadingList = true;
        state.phuong_thuc_dang.error = null;
      })
      .addCase(fetchAllPhuongThucDang.fulfilled, (state, action) => {
        state.phuong_thuc_dang.loadingList = false;
        state.phuong_thuc_dang.items = action.payload;
      })
      .addCase(fetchAllPhuongThucDang.rejected, (state, action) => {
        state.phuong_thuc_dang.loadingList = false;
        state.phuong_thuc_dang.error = action.error.message ?? "Tải danh sách phương thức đăng thất bại";
      })
  },
});

export const { setSelectedNenTang, setSelectedPhuongThucDang } = othersSlice.actions;
export default othersSlice.reducer;
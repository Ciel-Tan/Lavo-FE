import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import tuanReducer from "./tuan.slice";
import baiVietReducer from "./bai_viet.slice";
import othersReducer from "./others.slice";
import tuanSanPhamReducer from "./tuan_san_pham.slice";
import dongSanPhamReducer from "./dong_san_pham.slice";
import sanPhamReducer from "./san_pham.slice";
import n8nReducer from "./n8n.slice";

export const store = configureStore({
  reducer: {
    tuan: tuanReducer,
    bai_viet: baiVietReducer,
    others: othersReducer,
    tuan_san_pham: tuanSanPhamReducer,
    dong_san_pham: dongSanPhamReducer,
    san_pham: sanPhamReducer,
    n8n: n8nReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
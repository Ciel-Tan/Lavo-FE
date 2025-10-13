import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { IDongSanPhamRow } from "../types/dong_san_pham.type";
import {
  createDongSanPhamThunk,
  fetchAllDongSanPham,
} from "../store/dong_san_pham.slice";

export function useDongSanPhamList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.dong_san_pham.items);
  const loading = useAppSelector((s) => s.dong_san_pham.loadingList);
  const error = useAppSelector((s) => s.dong_san_pham.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllDongSanPham());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllDongSanPham()) };
}

export function useDongSanPhamActions() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.dong_san_pham.saving);
  const error = useAppSelector((s) => s.dong_san_pham.error);

  return useMemo(
    () => ({
      saving,
      error,
      create: (payload: IDongSanPhamRow) => dispatch(createDongSanPhamThunk(payload)),
    }),
    [dispatch, saving, error]
  );
}
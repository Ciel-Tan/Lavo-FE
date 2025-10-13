import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { ITuanSanPham } from "../types/tuan_san_pham.type";
import {
  createTuanSanPhamThunk,
  fetchAllTuanSanPham,
} from "../store/tuan_san_pham.slice";
import { createBulkTuanSanPham } from "../services/tuan_san_pham.service";

export function useTuanSanPhamList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.tuan_san_pham.items);
  const loading = useAppSelector((s) => s.tuan_san_pham.loadingList);
  const error = useAppSelector((s) => s.tuan_san_pham.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllTuanSanPham());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllTuanSanPham()) };
}

export function useTuanSanPhamActions() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.tuan_san_pham.saving);
  const error = useAppSelector((s) => s.tuan_san_pham.error);

  return useMemo(
    () => ({
      saving,
      error,
      create: (payload: ITuanSanPham) => dispatch(createTuanSanPhamThunk(payload)),
      createBulk: (items: ITuanSanPham[]) => createBulkTuanSanPham(items),
    }),
    [dispatch, saving, error]
  );
}
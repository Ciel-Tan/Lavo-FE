import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { ISanPham } from "../types/san_pham.type";
import {
  createSanPhamThunk,
  deleteSanPhamThunk,
  fetchAllSanPham,
  fetchSanPhamById,
  updateSanPhamThunk,
} from "../store/san_pham.slice";

export function useSanPhamList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.san_pham.items);
  const loading = useAppSelector((s) => s.san_pham.loadingList);
  const error = useAppSelector((s) => s.san_pham.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllSanPham());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllSanPham()) };
}

export function useSanPhamSelected(sanPhamId?: string) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.san_pham.selected);
  const loading = useAppSelector((s) => s.san_pham.loadingSelected);
  const error = useAppSelector((s) => s.san_pham.error);

  useEffect(() => {
    if (sanPhamId) {
      dispatch(fetchSanPhamById(sanPhamId));
    }
  }, [sanPhamId, dispatch]);

  return { selected, loading, error, refetch: () => sanPhamId && dispatch(fetchSanPhamById(sanPhamId)) };
}

export function useSanPhamActions() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.san_pham.saving);
  const error = useAppSelector((s) => s.san_pham.error);

  return useMemo(
    () => ({
      saving,
      error,
      create: (payload: ISanPham) => dispatch(createSanPhamThunk(payload)),
      update: (payload: ISanPham) => dispatch(updateSanPhamThunk(payload)),
      remove: (sanPhamId: string) => dispatch(deleteSanPhamThunk(sanPhamId)),
    }),
    [dispatch, saving, error]
  );
}
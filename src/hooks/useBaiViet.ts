import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";

import {
    fetchAllBaiViet,
    fetchBaiVietById,
    fetchBaiVietByTuanId,
    deleteBaiVietThunk,
} from "../store/bai_viet.slice";

export function useBaiVietList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.bai_viet.items);
  const loading = useAppSelector((s) => s.bai_viet.loadingList);
  const error = useAppSelector((s) => s.bai_viet.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllBaiViet());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllBaiViet()) };
}

export function useBaiVietSelected(baiVietId?: string) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.bai_viet.selected);
  const loading = useAppSelector((s) => s.bai_viet.loadingSelected);
  const error = useAppSelector((s) => s.bai_viet.error);

  useEffect(() => {
    if (baiVietId) {
      dispatch(fetchBaiVietByTuanId(baiVietId));
    }
  }, [baiVietId, dispatch]);

  return { selected, loading, error, refetch: () => baiVietId && dispatch(fetchBaiVietById(baiVietId)) };
}

export function useBaiVietActions() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.bai_viet.saving);
  const error = useAppSelector((s) => s.bai_viet.error);

  return useMemo(
    () => ({
      saving,
      error,
      remove: (baiVietId: string) => dispatch(deleteBaiVietThunk(baiVietId)),
    }),
    [dispatch, saving, error]
  );
}
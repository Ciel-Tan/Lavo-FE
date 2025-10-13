import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { ITuan } from "../types/tuan.type";
import {
  createTuanThunk,
  deleteTuanThunk,
  fetchAllTuan,
  fetchTuanById,
  updateTuanThunk,
} from "../store/tuan.slice";

export function useTuanList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.tuan.items);
  const loading = useAppSelector((s) => s.tuan.loadingList);
  const error = useAppSelector((s) => s.tuan.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllTuan());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllTuan()) };
}

export function useTuanSelected(tuanId?: string) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.tuan.selected);
  const loading = useAppSelector((s) => s.tuan.loadingSelected);
  const error = useAppSelector((s) => s.tuan.error);

  useEffect(() => {
    if (tuanId) {
      dispatch(fetchTuanById(tuanId));
    }
  }, [tuanId, dispatch]);

  return { selected, loading, error, refetch: () => tuanId && dispatch(fetchTuanById(tuanId)) };
}

export function useTuanActions() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.tuan.saving);
  const error = useAppSelector((s) => s.tuan.error);

  return useMemo(
    () => ({
      saving,
      error,
      create: (payload: ITuan) => dispatch(createTuanThunk(payload)),
      update: (payload: ITuan) => dispatch(updateTuanThunk(payload)),
      remove: (tuanId: string) => dispatch(deleteTuanThunk(tuanId)),
    }),
    [dispatch, saving, error]
  );
}
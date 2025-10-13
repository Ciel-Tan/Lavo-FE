import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchAllNenTang,
  fetchAllPhuongThucDang,
  fetchAllDinhDang,
} from "../store/others.slice";

export function useNenTangList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.others.nen_tang.items);
  const loading = useAppSelector((s) => s.others.nen_tang.loadingList);
  const error = useAppSelector((s) => s.others.nen_tang.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllNenTang());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllNenTang()) };
}

export function usePhuongThucDangList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.others.phuong_thuc_dang.items);
  const loading = useAppSelector((s) => s.others.phuong_thuc_dang.loadingList);
  const error = useAppSelector((s) => s.others.phuong_thuc_dang.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllPhuongThucDang());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllPhuongThucDang()) };
}

export function useDinhDangList(autoFetch: boolean = true) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.others.dinh_dang.items);
  const loading = useAppSelector((s) => s.others.dinh_dang.loadingList);
  const error = useAppSelector((s) => s.others.dinh_dang.error);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchAllDinhDang());
    }
  }, [autoFetch, dispatch]);

  return { items, loading, error, refetch: () => dispatch(fetchAllDinhDang()) };
}
import { api } from "../config/axios";
import type { ITuanSanPham } from "../types/tuan_san_pham.type";

const BASE_PATH = "/tuan-san-pham";

export async function getAllTuanSanPham(): Promise<ITuanSanPham[]> {
  const response = await api.get(BASE_PATH);
  return response.data?.data as ITuanSanPham[];
}

export async function getTuanSanPhamById(tuanId: string): Promise<ITuanSanPham> {
  const response = await api.get(`${BASE_PATH}/${tuanId}`);
  return response.data?.data as ITuanSanPham;
}

export async function createTuanSanPham(payload: ITuanSanPham): Promise<ITuanSanPham> {
  const response = await api.post(BASE_PATH, payload);
  return response.data?.data as ITuanSanPham;
}

export async function createBulkTuanSanPham(items: ITuanSanPham[]): Promise<ITuanSanPham[]> {
  const response = await api.post(`${BASE_PATH}/bulk`, { items });
  return response.data?.data as ITuanSanPham[];
}
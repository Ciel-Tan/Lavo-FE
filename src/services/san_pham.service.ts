import { api } from "../config/axios";
import type { ISanPham } from "../types/san_pham.type";

const BASE_PATH = "/san-pham";

export async function getAllSanPham(): Promise<ISanPham[]> {
  const response = await api.get(BASE_PATH);
  return response.data?.data as ISanPham[];
}

export async function getSanPhamById(sanPhamId: string): Promise<ISanPham> {
  const response = await api.get(`${BASE_PATH}/${sanPhamId}`);
  return response.data?.data as ISanPham;
}

export async function createSanPham(payload: ISanPham): Promise<ISanPham> {
  const response = await api.post(BASE_PATH, payload);
  return response.data?.data as ISanPham;
}

export async function updateSanPham(payload: ISanPham): Promise<ISanPham> {
  const response = await api.put(`${BASE_PATH}/${payload.Ma_SKU}`, payload);
  return response.data?.data as ISanPham;
}

export async function deleteSanPham(sanPhamId: string): Promise<{ deletedId: string }> {
  await api.delete(`${BASE_PATH}/${sanPhamId}`);
  return { deletedId: sanPhamId };
}
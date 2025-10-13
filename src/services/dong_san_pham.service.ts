import { api } from "../config/axios";
import type { IDongSanPhamRow } from "../types/dong_san_pham.type";

const BASE_PATH = "/dong-san-pham";

export async function getAllDongSanPham(): Promise<IDongSanPhamRow[]> {
  const response = await api.get(BASE_PATH);
  return response.data?.data as IDongSanPhamRow[];
}

export async function createDongSanPham(payload: IDongSanPhamRow): Promise<IDongSanPhamRow> {
  const response = await api.post(BASE_PATH, payload);
  return response.data?.data as IDongSanPhamRow;
}
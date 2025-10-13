import { api } from "../config/axios";
import type { IBaiViet } from "../types/bai_viet.type";

const BASE_PATH = "/bai-viet";

export async function getAllBaiViet(): Promise<IBaiViet[]> {
  const response = await api.get(BASE_PATH);
  return response.data?.data as IBaiViet[];
}

export async function getBaiVietById(baiVietId: string): Promise<IBaiViet> {
  const response = await api.get(`${BASE_PATH}/${baiVietId}`);
  return response.data?.data as IBaiViet;
}

export async function getBaiVietByTuanId(tuanId: string): Promise<IBaiViet[]> {
  const response = await api.get(`${BASE_PATH}/tuan/${tuanId}`);
  return response.data?.data as IBaiViet[];
}

export async function deleteBaiViet(baiVietId: string): Promise<{ deletedId: string }> {
  await api.delete(`${BASE_PATH}/${baiVietId}`);
  return { deletedId: baiVietId };
}
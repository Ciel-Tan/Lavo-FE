import { api } from "../config/axios";
import type { ITuan } from "../types/tuan.type";

const BASE_PATH = "/tuan";

export async function getAllTuan(): Promise<ITuan[]> {
  const response = await api.get(BASE_PATH);
  return response.data?.data as ITuan[];
}

export async function getTuanById(tuanId: string): Promise<ITuan> {
  const response = await api.get(`${BASE_PATH}/${tuanId}`);
  return response.data?.data as ITuan;
}

export async function createTuan(payload: ITuan): Promise<ITuan> {
  const response = await api.post(BASE_PATH, payload);
  return response.data?.data as ITuan;
}

export async function updateTuan(payload: ITuan): Promise<ITuan> {
  const response = await api.put(`${BASE_PATH}/${payload.Tuan_id}`, payload);
  return response.data?.data as ITuan;
}

export async function deleteTuan(tuanId: string): Promise<{ deletedId: string }> {
  await api.delete(`${BASE_PATH}/${tuanId}`);
  return { deletedId: tuanId };
}
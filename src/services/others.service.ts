import { api } from "../config/axios";
import type { IDinhDang } from "../types/dinh_dang.type";
import type { INenTang } from "../types/nen_tang.type";
import type { IPhuongThucDang } from "../types/phuong_thuc_dang.type";

const BASE_PATH_DINH_DANG = "/dinh-dang";
const BASE_PATH_NEN_TANG = "/nen-tang";
const BASE_PATH_PHUONG_THUC_DANG = "/phuong-thuc-dang";

export async function getAllDinhDang(): Promise<IDinhDang[]> {
  const response = await api.get(BASE_PATH_DINH_DANG);
  return response.data?.data as IDinhDang[];
}

export async function getAllNenTang(): Promise<INenTang[]> {
  const response = await api.get(BASE_PATH_NEN_TANG);
  return response.data?.data as INenTang[];
}

export async function getAllPhuongThucDang(): Promise<IPhuongThucDang[]> {
  const response = await api.get(BASE_PATH_PHUONG_THUC_DANG);
  return response.data?.data as IPhuongThucDang[];
}

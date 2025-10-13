export interface ITuan {
    Tuan_id: string;
    Tuan_nd: string;
    Tieu_de: string;
    Ngay_bat_dau: string;
    Ngay_ket_thuc: string;
    Phan_hoi_noi_bo: string;
    Muc_tieu: string;
    Su_cu_the: string;
    Tinh_kha_thi: string;
    Muc_do_lien_quan: string;
    Trang_thai: number;
}

export interface TuanState {
  items: ITuan[];
  selected: ITuan | null;
  loadingList: boolean;
  loadingSelected: boolean;
  saving: boolean;
  error: string | null;
}
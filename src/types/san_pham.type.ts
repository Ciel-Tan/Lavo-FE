export interface IDongSanPham {
    Dong_sp_id: string;
    Ten_dong_sp: string;
}

export interface ISanPham {
    Ma_SKU: string;
    Dong_san_pham: IDongSanPham;
    Ten: string;
    Gia_ban: number;
    Chan_dung_KH: string;
    Mo_ta: string;
    Thong_so_ky_thuat: string;
    Tinh_nang: string;
    Loi_ich: string;
    Diem_ban_hang_doc_nhat_USP: string;
    Chinh_sach: string;
    Link_hinh_anh: string;
}

export interface SanPhamState {
    items: ISanPham[];
    selected: ISanPham | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}
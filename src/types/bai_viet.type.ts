import type { IDinhDang } from "./dinh_dang.type";

export interface IBaiViet {
    Bai_viet_id: string;
    Tuan_id: string | null;
    Dinh_dang: IDinhDang;
    Tieu_de: string | null;
    Ngay_tao: string | null; // ISO date string
    Y_tuong_de_xuat: string | null;
    Ly_do_lua_chon: string | null;
    Noi_dung: string | null;
    Trang_thai: number | null;
    Media: Record<string, unknown> | unknown[] | null; // jsonb can be object or array
    Nen_tang_id: number | null;
    Ptd_id: number | null;
    Mo_ta_media: string | null;
    Tu_khoa: string | null;
    Noi_dung_phan_giai: string | null;
    Goc_tiep_can: string | null;
    SKU: string | null;
    Ten_sp: string | null;
}

export interface BaiVietState {
    items: IBaiViet[];
    selected: IBaiViet | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}

export interface SEOContentRequest {
    Bai_viet_id: string;
    Tieu_de: string;
    Tu_khoa: string;
    Y_tuong_de_xuat: string;
    Ly_do_lua_chon: string;
}

export interface PostAndVideoContentRequest {
    Bai_viet_id: string;
    Goc_tiep_can: string;
    Noi_dung_phan_giai: string;
    Tieu_de: string;
    Y_tuong_de_xuat: string;
    Ly_do_lua_chon: string;
}

export interface SEOFeedbackRequest {
    Bai_viet_id: string;
    Noi_dung: string;
    Mo_ta_media: string;
    Feedback: string;
}

export interface PostFeedbackRequest {
    Bai_viet_id: string;
    Noi_dung: string;
    Feedback: string;
}

export interface VideoFeedbackRequest {
    Bai_viet_id: string;
    Tieu_de: string;
    Mo_ta_media: string;
    Noi_dung: string;
    Feedback: string;
}
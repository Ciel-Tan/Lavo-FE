export interface ITuanSanPham {
    Tuan_id: string;
    Ma_SKU: string;
}

export interface TuanSanPhamState {
    items: ITuanSanPham[];
    selected: ITuanSanPham | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}
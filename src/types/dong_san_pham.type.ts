export interface IDongSanPhamRow {
    Dong_sp_id: string;
    Ten_dong_sp: string | null;
}

export interface DongSanPhamState {
    items: IDongSanPhamRow[];
    selected: IDongSanPhamRow | null;
    loadingList: boolean;
    saving: boolean;
    error: string | null;
}
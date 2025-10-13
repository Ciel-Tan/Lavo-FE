export interface IPhuongThucDang {
    Ptd_id: number;
    Loai_dang: string | null;
}

export interface PhuongThucDangState {
    items: IPhuongThucDang[];
    selected: IPhuongThucDang | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}

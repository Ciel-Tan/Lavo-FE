export interface IDinhDang {
    Dinh_dang_id: number;
    Loai: string | null;
}

export interface DinhDangState {
    items: IDinhDang[];
    selected: IDinhDang | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}

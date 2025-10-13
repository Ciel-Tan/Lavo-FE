export interface INenTang {
    Nen_tang_id: number;
    Loai: string | null;
}

export interface NenTangState {
    items: INenTang[];
    selected: INenTang | null;
    loadingList: boolean;
    loadingSelected: boolean;
    saving: boolean;
    error: string | null;
}

import type { INenTang } from "../../../../types/nen_tang.type";
import type { IDinhDang } from "../../../../types/dinh_dang.type";

interface PostItem {
    Bai_viet_id: string;
    Tieu_de: string | null;
    Nen_tang_id: number;
    Dinh_dang: IDinhDang;
    Dinh_dang_id: number;
}

interface PlatformGroupGridProps {
    posts: PostItem[];
    platforms: INenTang[];
    formats: IDinhDang[];
    statusLabelOf: (post: PostItem) => string;
}

export default function PlatformGroupGrid(props: PlatformGroupGridProps) {
    const { posts, platforms, formats, statusLabelOf } = props;

    const platformMeta: Record<number, { border: string; header: string; text: string }> = {
        2: { border: 'border-blue-300', header: 'bg-blue-500/30', text: 'text-blue-200' },
        1: { border: 'border-orange-300', header: 'bg-orange-500/30', text: 'text-orange-200' },
        3: { border: 'border-red-300', header: 'bg-rose-500/30', text: 'text-rose-200' },
        4: { border: 'border-green-300', header: 'bg-green-500/30', text: 'text-green-200' },
    };

    const formatLabelOf = (post: PostItem): string => {
        const byNestedId = formats.find(f => f.Dinh_dang_id === post.Dinh_dang?.Dinh_dang_id)?.Loai ?? undefined;
        if (byNestedId) return byNestedId;
        const byFlatId = formats.find(f => f.Dinh_dang_id === Number(post.Dinh_dang_id))?.Loai ?? undefined;
        if (byFlatId) return byFlatId;
        return post.Dinh_dang?.Loai ?? 'Khác';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {platforms.map((pl, pIndex) => {
                const items = posts.filter(p => p.Nen_tang_id === pl.Nen_tang_id);
                const meta = platformMeta[pl.Nen_tang_id] ?? { border: 'border-gray-600', header: 'bg-gray-800/40', text: 'text-gray-300' };
                return (
                    <div key={pl.Nen_tang_id} className={`rounded-xl overflow-hidden border ${meta.border} bg-[#161616] animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${pIndex * 120}ms` }}>
                        <div className={`px-4 py-3 ${meta.header} flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold ${meta.text}`}>{pl.Loai}</span>
                            </div>
                            <span className="text-gray-300 text-sm">({items.length})</span>
                        </div>
                        <div className="p-3 space-y-3">
                            {items.length === 0 && (
                                <div className="text-gray-500 text-sm">Không có bài đăng</div>
                            )}
                            {items.map((post, iIndex) => (
                                <div key={post.Bai_viet_id} className={`rounded-xl border ${meta.border} bg-[#242424] p-4 shadow-md hover:shadow-lg hover:bg-white/5 transition-colors animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${iIndex * 80}ms` }}>
                                    <div className="flex items-start justify-between">
                                        <div className="text-white font-medium leading-snug line-clamp-2">{post.Tieu_de}</div>
                                        <div className="text-xs text-gray-400 ml-3 shrink-0">ID: {post.Bai_viet_id}</div>
                                    </div>
                                    <div className="mt-3 space-y-1 text-sm">
                                        <div className="text-gray-300"><span className="text-gray-400">Trạng thái:</span> {statusLabelOf(post)}</div>
                                        <div className="text-gray-300"><span className="text-gray-400">Định dạng:</span> {formatLabelOf(post)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}



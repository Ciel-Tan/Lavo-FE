import type { INenTang } from "../../../../types/nen_tang.type";
import type { IDinhDang } from "../../../../types/dinh_dang.type";

interface PostItem {
    Bai_viet_id: string;
    Tieu_de: string | null;
    Nen_tang_id: number;
    Dinh_dang: IDinhDang;
    Dinh_dang_id: number;
}

const StatusGroupGrid = ({ filteredPosts, statusColumns, statusKeyOf, statusLabelOf, platformsFromApi, formatsFromApi }: { filteredPosts: PostItem[], statusColumns: { key: string; label: string; color: string; header: string }[], statusKeyOf: (post: PostItem) => string, statusLabelOf: (post: PostItem) => string, platformsFromApi: INenTang[], formatsFromApi: IDinhDang[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {statusColumns.map((st, sIndex) => {
                const posts = filteredPosts.filter(p => statusKeyOf(p as any) === st.key);
                return (
                    <div key={st.key} className={`rounded-xl overflow-hidden border ${st.color} bg-[#161616] animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${sIndex * 120}ms` }}>
                        <div className={`px-4 py-3 ${st.header} flex items-center justify-between`}>
                            <span className="font-semibold text-gray-200">{st.label}</span>
                            <span className="text-gray-300 text-sm">({posts.length})</span>
                        </div>
                        <div className="p-3 space-y-3">
                            {posts.length === 0 && (
                                <div className="text-gray-500 text-sm">Không có bài đăng</div>
                            )}
                            {posts.map((post, pIndex) => (
                                <div key={post.Bai_viet_id} className={`rounded-xl border ${st.color} bg-gradient-to-r from-white/5 via-white/0 to-white/5 p-4 shadow-md hover:shadow-lg hover:from-white/10 hover:to-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${pIndex * 80}ms` }}>
                                    <div className="flex items-start justify-between">
                                        <div className="text-white font-medium leading-snug line-clamp-2">{post.Tieu_de}</div>
                                        <div className="text-xs text-gray-400 ml-3 shrink-0">{platformsFromApi.find(pl => pl.Nen_tang_id === post.Nen_tang_id)?.Loai}</div>
                                    </div>
                                    <div className="mt-3 space-y-1 text-sm">
                                        <div className="text-gray-300"><span className="text-gray-400">Trạng thái:</span> {statusLabelOf(post as any)}</div>
                                        <div className="text-gray-300"><span className="text-gray-400">Định dạng:</span> {formatsFromApi.find(f => f.Dinh_dang_id === post.Dinh_dang?.Dinh_dang_id)?.Loai ?? 'Khác'}</div>
                                        <div className="text-gray-500">ID: {post.Bai_viet_id}</div>
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
 
export default StatusGroupGrid;
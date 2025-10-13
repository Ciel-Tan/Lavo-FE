import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PostGridTable from '../PostGridTable';
import PlatformGroupGrid from './PlatformGroupGrid';
import { useBaiVietList } from '../../../../hooks/useBaiViet';
import { LoadingOverlay } from '../../../ui/loading';
import { useNenTangList } from '../../../../hooks/useOther';
import { useDinhDangList } from '../../../../hooks/useOther';
import type { IBaiViet } from '../../../../types/bai_viet.type';
import StatusGroupGrid from './StatusGroupGrid';

export default function ContentOverview() {
    const [groupMode, setGroupMode] = useState<'platform' | 'status' | 'all'>('platform');
    const [searchTerm, setSearchTerm] = useState('');

    const { items: postsFromApi, loading: loadingPosts, error: errorPosts } = useBaiVietList(false);
    const { items: platformsFromApi, loading: loadingPlatforms, error: errorPlatforms } = useNenTangList();
    const { items: formatsFromApi, loading: loadingFormats, error: errorFormats } = useDinhDangList();

    type PostStatusKey = 'posted' | 'pendingPost' | 'proposal' | 'generating' | 'generated' | 'assetGenerating' | 'assetGenerated' | 'finalGenerating' | 'finalGenerated' | 'waitingSchedule';

    const statusColumns: { key: PostStatusKey; label: string; color: string; header: string }[] = [
        { key: 'posted', label: 'Đã đăng bài', color: 'border-purple-300', header: 'bg-purple-500/30' },
        { key: 'pendingPost', label: 'Đang chờ đăng', color: 'border-pink-300', header: 'bg-pink-500/30' },
        { key: 'waitingSchedule', label: 'Đang chờ xếp lịch', color: 'border-indigo-300', header: 'bg-indigo-500/30' },
        { key: 'finalGenerated', label: 'Đã tạo Final Video', color: 'border-blue-300', header: 'bg-blue-500/30' },
        { key: 'finalGenerating', label: 'Đang tạo Final Video', color: 'border-yellow-300', header: 'bg-yellow-500/30' },
        { key: 'assetGenerated', label: 'Đã tạo hình/Video demo', color: 'border-sky-300', header: 'bg-sky-500/30' },
        { key: 'assetGenerating', label: 'Đang tạo hình/video', color: 'border-amber-300', header: 'bg-amber-500/30' },
        { key: 'generated', label: 'Đã tạo nội dung', color: 'border-blue-300', header: 'bg-blue-500/30' },
        { key: 'generating', label: 'Đang tạo nội dung', color: 'border-amber-300', header: 'bg-amber-500/30' },
        { key: 'proposal', label: 'Đã tạo đề xuất', color: 'border-green-300', header: 'bg-green-500/30' }
    ];

    const mapNumberToStatus = (n: number): PostStatusKey => {
        switch (n) {
            case 1: return 'proposal';
            case 2: return 'generating';
            case 3: return 'generated';
            case 4: return 'assetGenerating';
            case 5: return 'assetGenerated';
            case 6: return 'finalGenerating';
            case 7: return 'finalGenerated';
            case 8: return 'waitingSchedule';
            case 9: return 'pendingPost';
            case 10: return 'posted';
            default: return 'proposal';
        }
    };

    const statusKeyOf = (post: IBaiViet): PostStatusKey => mapNumberToStatus(Number(post.Trang_thai ?? 0));

    const statusLabelOf = (post: IBaiViet): string => {
        const key = statusKeyOf(post);
        const typeFromId = formatsFromApi.find(f => f.Dinh_dang_id === post.Dinh_dang?.Dinh_dang_id)?.Loai;
        const isVideo = (post as any).Dinh_dang?.Loai === 'Short Video' || typeFromId === 'Short Video';
        if (key === 'posted') return 'Đã đăng bài';
        if (key === 'pendingPost') return 'Đang chờ đăng';
        if (key === 'assetGenerating') return isVideo ? 'Đang tạo Video demo' : 'Đang tạo hình ảnh';
        if (key === 'assetGenerated') return isVideo ? 'Đã tạo Video demo' : 'Đã tạo hình ảnh';
        if (key === 'finalGenerating') return 'Đang tạo Final Video';
        if (key === 'finalGenerated') return 'Đã tạo Final Video';
        if (key === 'generating') return 'Đang tạo nội dung';
        if (key === 'generated') return 'Đã tạo nội dung';
        if (key === 'waitingSchedule') return 'Đang chờ xếp lịch';
        return 'Đã tạo đề xuất';
    };

    const normalizeVi = (input: string): string => {
        return input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // remove diacritics
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .trim();
    };

    const filteredPosts = postsFromApi.filter(p => {
        const haystack = normalizeVi(p.Tieu_de ?? '');
        const needle = normalizeVi(searchTerm);
        return haystack.includes(needle);
    });

    return (
        <div className="space-y-4 relative">
            <LoadingOverlay show={!!(loadingPosts || loadingPlatforms || loadingFormats)} />
            
            {(errorPosts || errorPlatforms || errorFormats) && (
                <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 text-red-300 px-4 py-3 space-y-1">
                    {errorPosts && <div>Lỗi tải bài viết: {String(errorPosts)}</div>}
                    {errorPlatforms && <div>Lỗi tải nền tảng: {String(errorPlatforms)}</div>}
                    {errorFormats && <div>Lỗi tải định dạng: {String(errorFormats)}</div>}
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Bài đăng</h2>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#1b1b1b] rounded-xl p-1 border border-[#39FF14]/20">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${groupMode === 'platform' ? 'bg-[#39FF14] text-black' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setGroupMode('platform')}
                        >
                            Theo nền tảng
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${groupMode === 'status' ? 'bg-[#39FF14] text-black' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setGroupMode('status')}
                        >
                            Theo trạng thái
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm ${groupMode === 'all' ? 'bg-[#39FF14] text-black' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => setGroupMode('all')}
                        >
                            Tất cả
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm bài đăng"
                                className="bg-[#1b1b1b] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/40"
                            />
                        </div>
                        <button className="p-2 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {groupMode === 'platform' && (
                <PlatformGroupGrid
                    posts={filteredPosts as any}
                    platforms={platformsFromApi as any}
                    formats={formatsFromApi as any}
                    statusLabelOf={(post: any) => statusLabelOf(post as any)}
                />
            )}

            {groupMode === 'status' && (
                <StatusGroupGrid
                    filteredPosts={filteredPosts as any}
                    statusColumns={statusColumns as any}
                    statusKeyOf={(post: any) => statusKeyOf(post as any)}
                    statusLabelOf={(post: any) => statusLabelOf(post as any)}
                    platformsFromApi={platformsFromApi as any}
                    formatsFromApi={formatsFromApi as any}
                />
            )}

            {groupMode === 'all' && (
                <PostGridTable
                    posts={filteredPosts as any}
                    platforms={platformsFromApi as any}
                    formatLabelOf={(post: any) => {
                        const byNestedId = formatsFromApi.find(f => f.Dinh_dang_id === post.Dinh_dang?.Dinh_dang_id)?.Loai;
                        if (byNestedId) return byNestedId;
                        const byFlatId = formatsFromApi.find(f => f.Dinh_dang_id === Number(post.Dinh_dang_id))?.Loai;
                        if (byFlatId) return byFlatId;
                        return post?.Dinh_dang?.Loai ?? 'Khác';
                    }}
                    statusLabelOf={(post: any) => statusLabelOf(post as any)}
                    showId
                    showPlatform
                />
            )}
        </div>
    );
}



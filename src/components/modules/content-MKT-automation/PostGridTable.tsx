import { Calendar as CalendarIcon, FileText, Image as ImageIcon, Check, RefreshCw, Circle } from 'lucide-react';

interface Platform { Nen_tang_id: number; Loai: string }

interface PostItem {
  Bai_viet_id: string;
  Ngay_tao: string;
  Tieu_de: string;
  Dinh_dang?: { Loai: string };
  Dinh_dang_id?: number;
  Nen_tang_id?: number;
  Trang_thai?: number;
}

interface PostGridTableProps {
  posts: PostItem[];
  platforms?: Platform[];
  formatLabelOf: (post: PostItem) => string;
  statusLabelOf: (post: PostItem) => string;
  showId?: boolean;
  showPlatform?: boolean;
}

export default function PostGridTable({ posts, platforms = [], formatLabelOf, statusLabelOf, showId = false, showPlatform = false }: PostGridTableProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className={`relative grid gap-4 px-8 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 border-b border-blue-400/30`} style={{ gridTemplateColumns: `repeat(${4 + (showId ? 1 : 0) + (showPlatform ? 1 : 0)}, minmax(0, 1fr))` }}>
        <div className="text-white font-bold flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4" />
          <span>Ngày khởi tạo</span>
        </div>
        {showId && <div className="text-white font-bold flex items-center">ID</div>}
        <div className="text-white font-bold flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Tiêu đề</span>
        </div>
        <div className="text-white font-bold flex items-center space-x-2 justify-center">
          <ImageIcon className="w-4 h-4" />
          <span>Định dạng</span>
        </div>
        {showPlatform && <div className="text-white font-bold flex items-center space-x-2 justify-center"><span>Nền tảng</span></div>}
        <div className="text-white font-bold flex items-center space-x-2 justify-center">
          <Check className="w-4 h-4" />
          <span>Trạng thái</span>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm">
        {posts.map((post, index) => {
          const formatLabel = formatLabelOf(post);
          const formatClass =
            formatLabel === 'Image Post'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
              : formatLabel === 'SEO Blog'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-500/30'
              : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/30';
          // Platform color should be consistent per platform (not reuse format color)
          const platformId = Number(post.Nen_tang_id);
          const platformClass =
            platformId === 2
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
              : platformId === 1
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/30'
              : platformId === 3
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30'
              : platformId === 4
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
              : 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-gray-500/30';
          const platformName = platforms.find(pl => pl.Nen_tang_id === post.Nen_tang_id)?.Loai ?? '—';
          return (
            <div
              key={`${post.Bai_viet_id}-${index}`}
              className="grid gap-4 px-8 py-5 border-b border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ gridTemplateColumns: `repeat(${4 + (showId ? 1 : 0) + (showPlatform ? 1 : 0)}, minmax(0, 1fr))`, animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">
                  {new Date(post.Ngay_tao).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
              {showId && <div className="text-gray-400 font-mono flex items-center">{post.Bai_viet_id}</div>}
              <div className="text-white font-semibold">{post.Tieu_de}</div>
              <div className="justify-center items-center flex">
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${formatClass}`}>
                  {formatLabel}
                </span>
              </div>
              {showPlatform && (
                <div className="justify-center items-center flex">
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${platformClass}`}>
                    {platformName}
                  </span>
                </div>
              )}
              <div className="justify-center items-center flex">
                {(() => {
                  const status = Number(post.Trang_thai ?? 1);
                  const statusLabel = statusLabelOf(post);
                  const isGenerating = status === 2 || status === 4 || status === 6;
                  const isCompleted = status === 10;
                  
                  return (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 font-semibold text-sm">
                      {isGenerating && <RefreshCw className="w-3.5 h-3.5 mr-2 inline-block animate-spin" strokeWidth={2.5} />}
                      {isCompleted && <Check className="w-3.5 h-3.5 mr-2 inline-block" strokeWidth={2.5} />}
                      {!isGenerating && !isCompleted && <Circle className="w-3.5 h-3.5 mr-2 inline-block" strokeWidth={2.5} />}
                      {statusLabel}
                    </span>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



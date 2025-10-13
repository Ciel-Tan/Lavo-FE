import { Check, RefreshCw, Clock, Calendar } from 'lucide-react';

type PostContentStatus = 'proposal' | 'generating' | 'generated' | 'assetGenerating' | 'assetGenerated' | 'finalGenerating' | 'finalGenerated' | 'waitingSchedule' | 'pendingPost';

interface StatusBadgeProps {
  status: PostContentStatus;
  isVideo: boolean;
  index?: number;
}

export default function StatusBadge({ status, isVideo, index }: StatusBadgeProps) {
  if (status === 'generating') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-generating-${index}` : undefined}>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Đang tạo nội dung
      </span>
    );
  }
  if (status === 'assetGenerating') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-asset-generating-${index}` : undefined}>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        {isVideo ? 'Đang tạo Video demo' : 'Đang tạo hình ảnh'}
      </span>
    );
  }
  if (status === 'generated') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-generated-${index}` : undefined}>
        <Check className="w-4 h-4 mr-2" />
        Đã tạo nội dung
      </span>
    );
  }
  if (status === 'waitingSchedule') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 text-purple-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-waiting-schedule-${index}` : undefined}>
        <Calendar className="w-4 h-4 mr-2" />
        Đang chờ xếp lịch
      </span>
    );
  }
  if (status === 'pendingPost') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-pink-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-pending-post-${index}` : undefined}>
        <Clock className="w-4 h-4 mr-2" />
        Đang chờ đăng
      </span>
    );
  }
  if (status === 'assetGenerated') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-asset-generated-${index}` : undefined}>
        <Check className="w-4 h-4 mr-2" />
        {isVideo ? 'Đã tạo Video demo' : 'Đã tạo hình ảnh'}
      </span>
    );
  }
  if (status === 'finalGenerating') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-final-generating-${index}` : undefined}>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Đang tạo Final Video
      </span>
    );
  }
  if (status === 'finalGenerated') {
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-final-generated-${index}` : undefined}>
        <Check className="w-4 h-4 mr-2" />
        Đã tạo Final Video
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 font-semibold text-sm" data-testid={typeof index === 'number' ? `badge-status-proposal-${index}` : undefined}>
      <Check className="w-4 h-4 mr-2" />
      Đã tạo đề xuất
    </span>
  );
}



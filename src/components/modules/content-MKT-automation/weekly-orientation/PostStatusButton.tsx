import { Button } from '../../../ui/button';
import { Check, RefreshCw } from 'lucide-react';

type PostContentStatus =
  | 'proposal'
  | 'generating'
  | 'generated'
  | 'assetGenerating'
  | 'assetGenerated'
  | 'finalGenerating'
  | 'finalGenerated'
  | 'waitingSchedule'
  | 'pendingPost';

interface PostStatusButtonProps {
  status: PostContentStatus;
  isVideo: boolean;
}

export default function PostStatusButton(props: PostStatusButtonProps) {
  const { status, isVideo } = props;

  if (status === 'generating') {
    return (
      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3" data-testid="button-status-generating" disabled>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Đang tạo nội dung
      </Button>
    );
  }

  if (status === 'assetGenerating') {
    return (
      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3" data-testid="button-status-asset-generating" disabled>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        {isVideo ? 'Đang tạo Video demo' : 'Đang tạo hình ảnh'}
      </Button>
    );
  }

  if (status === 'waitingSchedule') {
    return (
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3" data-testid="button-status-waiting-schedule">
        <RefreshCw className="w-4 h-4 mr-2" />
        Đang chờ xếp lịch
      </Button>
    );
  }
  if (status === 'pendingPost') {
    return (
      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3" data-testid="button-status-pending-post">
        <Check className="w-4 h-4 mr-2" />
        Đang chờ đăng
      </Button>
    );
  }

  if (status === 'assetGenerated') {
    return (
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3" data-testid="button-status-asset-generated">
        <Check className="w-4 h-4 mr-2" />
        {isVideo ? 'Đã tạo Video demo' : 'Đã tạo hình ảnh'}
      </Button>
    );
  }

  if (status === 'finalGenerating') {
    return (
      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3" data-testid="button-status-final-generating" disabled>
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Đang tạo Final Video
      </Button>
    );
  }

  if (status === 'finalGenerated') {
    return (
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3" data-testid="button-status-final-generated">
        <Check className="w-4 h-4 mr-2" />
        Đã tạo Final Video
      </Button>
    );
  }

  if (status === 'generated') {
    return (
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3" data-testid="button-status-generated">
        <Check className="w-4 h-4 mr-2" />
        Đã tạo nội dung
      </Button>
    );
  }

  return (
    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3" data-testid="button-status-approved">
      <Check className="w-4 h-4 mr-2" />
      Đã tạo đề xuất
    </Button>
  );
}



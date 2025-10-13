import { Textarea } from '../../../ui/textarea';
import { FileText, CheckCircle2, Edit3 } from 'lucide-react';

type PostContentStatus =
  | 'proposal'
  | 'generating'
  | 'generated'
  | 'assetGenerating'
  | 'assetGenerated'
  | 'finalGenerating'
  | 'finalGenerated'
  | 'waitingSchedule';

interface PostDraftLabelProps {
  status: PostContentStatus;
  value: string;
}

export default function PostDraftLabel(props: PostDraftLabelProps) {
  const { status, value } = props;
  
  const getLabelInfo = (): { text: string; icon: React.ReactNode; iconColor: string } => {
    if (status === 'assetGenerated' || status === 'finalGenerating' || status === 'finalGenerated' || status === 'waitingSchedule') {
      return {
        text: 'Bản thảo đã duyệt',
        icon: <CheckCircle2 className="w-4 h-4" />,
        iconColor: 'text-green-400'
      };
    }
    if (status === 'generated' || status === 'assetGenerating') {
      return {
        text: 'Bản thảo / Kịch bản',
        icon: <Edit3 className="w-4 h-4" />,
        iconColor: 'text-blue-400'
      };
    }
    return {
      text: 'Ý tưởng/ Cốt truyện đề xuất',
      icon: <FileText className="w-4 h-4" />,
      iconColor: 'text-purple-400'
    };
  };

  const labelInfo = getLabelInfo();

  return (
    <div className="space-y-2">
      <label className={`text-gray-400 text-sm font-medium flex items-center gap-2 ${labelInfo.iconColor}`}>
        {labelInfo.icon}
        {labelInfo.text}
      </label>
      <Textarea 
        value={value} 
        readOnly 
        className="bg-gray-800/50 border border-gray-700 text-gray-200 min-h-[120px] resize-none hover:border-purple-500/50 transition-colors" 
      />
    </div>
  );
}



import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Globe, Send, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface PlatformItem { Nen_tang_id: number; Loai: string }
interface PostingMethodItem { Ptd_id: number; Loai_dang: string }

interface ScheduleFormProps {
  platforms: PlatformItem[];
  postingMethods: PostingMethodItem[];
  platformValue?: number;
  methodValue?: number;
  dateValue?: string;
  timeValue?: string;
  scheduledAt?: string;
  onPlatformChange: (value: number) => void;
  onMethodChange: (value: number) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export default function ScheduleForm(props: ScheduleFormProps) {
  const {
    platforms,
    postingMethods,
    platformValue,
    methodValue,
    dateValue,
    timeValue,
    scheduledAt,
    onPlatformChange,
    onMethodChange,
    onDateChange,
    onTimeChange,
  } = props;

  return (
    <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            Chọn nền tảng
          </label>
          <Select
            value={platformValue ? String(platformValue) : undefined}
            onValueChange={(val) => onPlatformChange(Number(val))}
          >
            <SelectTrigger className="bg-gray-800/50 border border-gray-700 text-gray-200 hover:border-blue-500/50 transition-colors">
              <SelectValue placeholder="Chọn nền tảng" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p.Nen_tang_id} value={String(p.Nen_tang_id)}>{p.Loai}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Send className="w-4 h-4 text-purple-400" />
            Chọn phương thức đăng
          </label>
          <Select
            value={methodValue ? String(methodValue) : undefined}
            onValueChange={(val) => onMethodChange(Number(val))}
          >
            <SelectTrigger className="bg-gray-800/50 border border-gray-700 text-gray-200 hover:border-purple-500/50 transition-colors">
              <SelectValue placeholder="Chọn phương thức đăng" />
            </SelectTrigger>
            <SelectContent>
              {postingMethods.map((m) => (
                <SelectItem key={m.Ptd_id} value={String(m.Ptd_id)}>{m.Loai_dang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-400" />
            Chọn ngày
          </label>
          <input
            type="date"
            className="w-full h-10 rounded-lg border border-gray-700 bg-gray-800/50 px-3 text-gray-200 hover:border-green-500/50 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            value={dateValue || ''}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Chọn giờ
          </label>
          <input
            type="time"
            className="w-full h-10 rounded-lg border border-gray-700 bg-gray-800/50 px-3 text-gray-200 hover:border-yellow-500/50 transition-colors focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
            value={timeValue || ''}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>

      {scheduledAt && (
        <div className="flex items-center gap-2 text-sm text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 mt-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu lịch: {new Date(scheduledAt).toLocaleString('vi-VN')}</span>
        </div>
      )}
    </div>
  );
}



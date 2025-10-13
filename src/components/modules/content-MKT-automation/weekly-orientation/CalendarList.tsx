import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Calendar as CalendarIcon, RefreshCw, Check, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useAppDispatch } from '../../../../store';
import { upsertTuan } from '../../../../store/tuan.slice';
import { useTuanActions } from '../../../../hooks/useTuan';
import { useTuanSanPhamActions } from '../../../../hooks/useTuanSanPham';
import type { ITuan } from '../../../../types/tuan.type';
import type { ITuanSanPham } from '../../../../types/tuan_san_pham.type';
import CreateWeekDialog from './CreateWeekDialog';

interface CalendarListProps {
  weeklyContent: any[];
  onClickWeek: (weekId: string) => void;
}

export default function CalendarList(props: CalendarListProps) {
  const { weeklyContent, onClickWeek } = props;

  const [isCreateWeekDialogOpen, setIsCreateWeekDialogOpen] = useState<boolean>(false);

  const { create } = useTuanActions();
  const { createBulk } = useTuanSanPhamActions();

  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  const handleCreateWeek = (newWeek: ITuan, selectedSkus: string[]) => {
    create(newWeek)
    
    const items: ITuanSanPham[] = selectedSkus.map((sku) => ({
        Tuan_id: newWeek.Tuan_id,
        Ma_SKU: sku,
    }));
    
    createBulk(items);
  };

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (payload: any) => {
      if (!payload || !payload.Tuan_id) return;
      dispatch(upsertTuan(payload));
    };
    socket.on('tuan:update', onUpdate);
    return () => {
      socket.off('tuan:update', onUpdate);
    };
  }, [socket, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => setIsCreateWeekDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5" data-testid="button-create-week">
          <span className="text-xl mr-2">+</span> Tạo tuần mới
        </Button>
        <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-6 py-3 rounded-xl font-medium transition-all duration-200" data-testid="button-filter" >
          Lọc
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-6 px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
          <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider">Ngày khởi tạo</div>
          <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider">Tuần nội dung</div>
          <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider text-center">Trạng thái</div>
        </div>

        {weeklyContent.map((week, index) => {
          const currentStatus = week.Trang_thai;
          return (
            <Card
              key={week.Tuan_id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#242424] border-gray-700/50 hover:border-[#39FF14]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#39FF14]/10 hover:-translate-y-1 group animate-in fade-in slide-in-from-left-4"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`row-week-${index}`}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div>
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 group-hover:from-gray-600/50 group-hover:to-gray-500/50" data-testid={`text-date-${index}`}>
                      <CalendarIcon className="w-4 h-4 text-[#39FF14]" />
                      <span>{new Date(week.Ngay_bat_dau).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => onClickWeek(week.Tuan_id)}
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium text-lg transition-colors duration-200 group/link"
                      data-testid={`link-week-${index}`}
                    >
                      <span className="border-b-2 border-transparent group-hover/link:border-blue-400 transition-all duration-200">{week.Tuan_nd}</span>
                      <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <div
                      className={`inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        currentStatus === 2
                          ? 'bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-600/50 text-yellow-300'
                          : currentStatus === 3
                          ? 'bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 text-green-300'
                          : 'bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-600/50 text-red-300'
                      }`}
                      data-testid={`text-status-${index}`}
                    >
                      {currentStatus === 2 && <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin text-current" strokeWidth={2.5} aria-hidden="true" />}
                      {currentStatus === 3 && <Check className="w-4 h-4 mr-2 inline-block text-current" strokeWidth={2.5} aria-hidden="true" />}
                      {currentStatus !== 2 && currentStatus !== 3 && <Circle className="w-4 h-4 mr-2 inline-block text-current" strokeWidth={2.5} aria-hidden="true" />}
                      {currentStatus === 2 ? 'Đang thực hiện' : currentStatus === 3 ? 'Hoàn thành' : 'Chưa bắt đầu'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CreateWeekDialog
        open={isCreateWeekDialogOpen}
        onOpenChange={setIsCreateWeekDialogOpen}
        onCreateWeek={handleCreateWeek}
      />

    </div>
  );
}
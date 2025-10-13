import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import { useBaiVietList } from '../../../../hooks/useBaiViet';
import { LoadingOverlay } from '../../../ui/loading';
import type { IBaiViet } from '../../../../types/bai_viet.type';
import { parseLocalDateTime } from '../../../../utils/formatters';
import ScheduleDialog from './scheduleDialog';

export default function ScheduleCalendar() {
    const calendarRef = useRef<FullCalendar | null>(null);

    const { items: baiVietList, loading } = useBaiVietList()

    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedBaiViet, setSelectedBaiViet] = useState<IBaiViet | null>(null);

    const handleSelect = (selectInfo: DateSelectArg) => {
        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const found = baiVietList.find((bv) => String(bv.Bai_viet_id) === String(clickInfo.event.id)) || null;
        setSelectedBaiViet(found);
        setDetailDialogOpen(true);
    };

    return (
        <div className="rounded-xl border border-[#39FF14]/20 bg-[#1a1a1a] p-3 relative">
            <LoadingOverlay show={!!loading} />
            <FullCalendar
                ref={calendarRef as any}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="timeGridWeek"
                selectable
                editable
                selectMirror
                dayMaxEvents
                select={handleSelect}
                eventClick={handleEventClick}
                events={baiVietList.filter((bv) => bv.Trang_thai === 9 || bv.Trang_thai === 10).map((baiViet) => {
                    const start = parseLocalDateTime(baiViet.Ngay_tao);
                    const end = new Date(start.getTime() + 60 * 30 * 1000);
                    const isPending = Number(baiViet.Trang_thai) === 9; // 9: Đang chờ đăng, 10: Đã đăng bài
                    return {
                        id: String(baiViet.Bai_viet_id),
                        title: baiViet.Tieu_de ?? '',
                        start,
                        end,
                        allDay: false,
                        backgroundColor: isPending ? '#ec4899' : '#8b5cf6', // pink-500 vs violet-500
                        borderColor: isPending ? '#be185d' : '#6d28d9',      // pink-700 vs violet-700
                        textColor: '#ffffff',
                    } as EventInput;
                })}
                locale={viLocale}
                height="auto"
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                weekNumbers
                nowIndicator
                themeSystem="standard"
                dayHeaderClassNames="text-black"
                weekNumberClassNames="text-black"
            />

            {/* Dialog chi tiết bài viết khi click event */}
            <ScheduleDialog
                detailDialogOpen={detailDialogOpen}
                setDetailDialogOpen={setDetailDialogOpen}
                selectedBaiViet={selectedBaiViet}
                setSelectedBaiViet={setSelectedBaiViet}
            />
        </div>
    );
}



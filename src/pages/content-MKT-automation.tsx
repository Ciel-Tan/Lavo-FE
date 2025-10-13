import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Factory
} from 'lucide-react';
import SelectedWeekView from '../components/modules/content-MKT-automation/weekly-orientation/SelectedWeekView';
// Removed direct usage; now encapsulated inside ContentOverview
import ContentOverview from '../components/modules/content-MKT-automation/content-overview/ContentOverview';
import CalendarList from '../components/modules/content-MKT-automation/weekly-orientation/CalendarList';
import { useTuanList } from '../hooks/useTuan';
import ScheduleCalendar from '../components/modules/content-MKT-automation/schedule/ScheduleCalendar';

export default function ContentMKTAutomationPage() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
    const { items: weeks } = useTuanList();

    const handleWeekClick = (weekId: string) => {
        setSelectedWeekId(weekId);
        setActiveTab('calendar');
    };

    return (
        <div className="min-h-screen bg-[#121212] p-6 space-y-6">
            {/* Page Header */}
            <div className="border-b border-[#39FF14]/20 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                            <Factory className="w-8 h-8 text-[#39FF14]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Tự động hóa nội dung MKT</h1>
                            <p className="text-gray-400">Dây chuyền sản xuất nội dung marketing khép kín</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm">AI Content Engine Active</span>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#262626] border-[#39FF14]/30 grid grid-cols-5 w-full">
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black">
                        Định hướng tuần
                    </TabsTrigger>
                    <TabsTrigger value="planning" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black">
                        Tổng quan nội dung
                    </TabsTrigger>
                    <TabsTrigger value="creation" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black">
                        Lên lịch đăng
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="space-y-6">
                    {selectedWeekId ? (
                        <SelectedWeekView
                            selectedWeek={selectedWeekId}
                            onBack={() => setSelectedWeekId(null)}
                        />
                    ) : (
                        <CalendarList
                            weeklyContent={weeks}
                            onClickWeek={handleWeekClick}
                        />
                    )}
                </TabsContent>

                {/* Tab 2: Tổng quan nội dung */}
                <TabsContent value="planning" className="space-y-6">
                    <ContentOverview />
                </TabsContent>

                {/* Tab 3: Lên lịch đăng */}
                <TabsContent value="creation" className="space-y-6">
                    <ScheduleCalendar />
                </TabsContent>
            </Tabs>
        </div>
    );
}
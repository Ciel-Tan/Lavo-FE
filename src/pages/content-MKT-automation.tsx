import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Factory
} from 'lucide-react';
import SelectedWeekView from '../components/modules/content-MKT-automation/weekly-orientation/SelectedWeekView';
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
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <div className="border-b border-gray-200 pb-6 bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 gradient-ocean rounded-lg ai-glow">
                            <Factory className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Tự động hóa nội dung MKT</h1>
                            <p className="text-gray-600">Dây chuyền sản xuất nội dung marketing khép kín</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-sky-50 rounded-full border border-sky-200">
                        <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                        <span className="text-sky-700 text-sm font-medium">AI Content Engine Active</span>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border border-gray-200 grid grid-cols-5 w-full shadow-sm">
                    <TabsTrigger value="calendar" className="data-[state=active]:gradient-ocean data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700">
                        Định hướng tuần
                    </TabsTrigger>
                    <TabsTrigger value="planning" className="data-[state=active]:gradient-ocean data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700">
                        Tổng quan nội dung
                    </TabsTrigger>
                    <TabsTrigger value="creation" className="data-[state=active]:gradient-ocean data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700">
                        Lên lịch đăng
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

                <TabsContent value="planning" className="space-y-6">
                    <ContentOverview />
                </TabsContent>

                <TabsContent value="creation" className="space-y-6">
                    <ScheduleCalendar />
                </TabsContent>
            </Tabs>
        </div>
    );
}

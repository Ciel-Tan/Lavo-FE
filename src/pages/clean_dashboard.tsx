import { useQuery } from '@tanstack/react-query';
// import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { Badge } from '../components/ui/badge';
import { 
//   BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Bell,
  Zap,
  Brain,
//   Eye,
  Target
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { CardHeader, CardTitle } from '../components/ui/card';

export default function CleanDashboard() {
  // Fetch dashboard data
  const { isLoading } = useQuery({
    queryKey: ["/api/dashboard-overview"],
    refetchInterval: 30000,
  });
  
  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-intelligence"],
    refetchInterval: 45000,
  }) as { data: any[] };

  const { data: partnerData = [] } = useQuery({
    queryKey: ["/api/partner-data"],
    refetchInterval: 120000,
  }) as { data: any[] };

  // Brands tracking
  const brands = [
    { name: "LAVOX", performance: 94.2, trend: "up", revenue: "15.2B" },
    { name: "X.PROS", performance: 88.7, trend: "up", revenue: "12.8B" },
    { name: "SEBAS", performance: 91.3, trend: "down", revenue: "9.4B" },
    { name: "M.PROS", performance: 87.1, trend: "up", revenue: "8.1B" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900">Đang tải LAVO Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow ai-glow" data-testid="card-revenue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doanh Thu</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-revenue">45.2B</p>
                <p className="text-sky-600 text-sm font-medium">+18.5% tháng này</p>
              </div>
              <div className="p-3 bg-sky-50 rounded-full">
                <DollarSign className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow relative z-10" data-testid="card-partners">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">NPP Active (DMS)</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-partners">{partnerData.length}</p>
                <p className="text-emerald-600 text-sm font-medium">Hiệu suất 94.2%</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow ai-glow" data-testid="card-ai-content">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">AI Content</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-ai-content">156</p>
                <p className="text-violet-600 text-sm font-medium">+24 hôm nay</p>
              </div>
              <div className="p-3 bg-violet-50 rounded-full">
                <Brain className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow" data-testid="card-alerts">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Market Alerts</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-alerts">{marketData.length}</p>
                <p className="text-amber-600 text-sm font-medium">{marketData.filter(m => m.alertLevel === 'critical').length} critical</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <Bell className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Performance */}
      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow" data-testid="card-brand-performance">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <div className="p-2 bg-sky-50 rounded-lg mr-3">
              <Target className="w-6 h-6 text-sky-600" />
            </div>
            Brand Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow" data-testid={`brand-${brand.name.toLowerCase()}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{brand.name}</h3>
                  <TrendingUp className={`w-4 h-4 ${
                    brand.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`} />
                </div>
                <p className="text-gray-600 text-sm">Performance: {brand.performance}%</p>
                <p className="text-gray-600 text-sm">Revenue: {brand.revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow" data-testid="card-market-alerts">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-amber-50 rounded-lg mr-2">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              Market Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketData.slice(0, 3).map((alert, index) => (
              <div key={index} className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-500" data-testid={`alert-${index}`}>
                <p className="font-medium text-gray-900 text-sm">{alert.competitorName || alert.source}</p>
                <p className="text-gray-600 text-sm">{alert.insight}</p>
                <p className="text-amber-700 text-xs mt-1 font-medium">{alert.alertLevel}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow ai-glow" data-testid="card-ai-activity">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-violet-50 rounded-lg mr-2">
                <Brain className="w-5 h-5 text-violet-600" />
              </div>
              AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-50 border-l-4 border-emerald-500" data-testid="activity-content-generation">
              <p className="font-medium text-gray-900 text-sm">Content Generation</p>
              <p className="text-gray-600 text-sm">24 bài viết được tạo hôm nay</p>
              <p className="text-emerald-700 text-xs mt-1 font-medium">Active</p>
            </div>

            <div className="p-3 rounded-lg bg-sky-50 border-l-4 border-sky-500" data-testid="activity-market-analysis">
              <p className="font-medium text-gray-900 text-sm">Market Analysis</p>
              <p className="text-gray-600 text-sm">Phân tích 156 mentions</p>
              <p className="text-sky-700 text-xs mt-1 font-medium">Completed</p>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500" data-testid="activity-campaign-optimization">
              <p className="font-medium text-gray-900 text-sm">Campaign Optimization</p>
              <p className="text-gray-600 text-sm">ROI cải thiện 12.3%</p>
              <p className="text-blue-700 text-xs mt-1 font-medium">In Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
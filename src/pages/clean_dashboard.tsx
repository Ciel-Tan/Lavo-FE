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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Đang tải LAVO Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-6 space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-revenue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Doanh Thu</p>
                <p className="text-2xl font-bold text-white" data-testid="text-revenue">45.2B</p>
                <p className="text-[#39FF14] text-sm">+18.5% tháng này</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#39FF14]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#39FF14]/20 relative z-10" data-testid="card-partners">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">NPP Active (DMS)</p>
                <p className="text-2xl font-bold text-white" data-testid="text-partners">{partnerData.length}</p>
                <p className="text-[#39FF14] text-sm">Hiệu suất 94.2%</p>
              </div>
              <Users className="w-8 h-8 text-[#39FF14]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-ai-content">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Content</p>
                <p className="text-2xl font-bold text-white" data-testid="text-ai-content">156</p>
                <p className="text-[#39FF14] text-sm">+24 hôm nay</p>
              </div>
              <Brain className="w-8 h-8 text-[#39FF14]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-alerts">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Market Alerts</p>
                <p className="text-2xl font-bold text-white" data-testid="text-alerts">{marketData.length}</p>
                <p className="text-yellow-400 text-sm">{marketData.filter(m => m.alertLevel === 'critical').length} critical</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Performance */}
      <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-brand-performance">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Target className="w-6 h-6 text-[#39FF14] mr-3" />
            Brand Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="p-4 rounded-lg bg-[#262626] border border-[#39FF14]/10" data-testid={`brand-${brand.name.toLowerCase()}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">{brand.name}</h3>
                  <TrendingUp className={`w-4 h-4 ${
                    brand.trend === 'up' ? 'text-[#39FF14]' : 'text-red-400'
                  }`} />
                </div>
                <p className="text-gray-400 text-sm">Performance: {brand.performance}%</p>
                <p className="text-gray-400 text-sm">Revenue: {brand.revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-market-alerts">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <Zap className="w-5 h-5 text-[#39FF14] mr-2" />
              Market Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketData.slice(0, 3).map((alert, index) => (
              <div key={index} className="p-3 rounded bg-[#262626] border-l-4 border-yellow-400" data-testid={`alert-${index}`}>
                <p className="font-medium text-white text-sm">{alert.competitorName || alert.source}</p>
                <p className="text-gray-400 text-sm">{alert.insight}</p>
                <p className="text-yellow-400 text-xs mt-1">{alert.alertLevel}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#39FF14]/20" data-testid="card-ai-activity">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <Brain className="w-5 h-5 text-[#39FF14] mr-2" />
              AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded bg-[#262626] border-l-4 border-[#39FF14]" data-testid="activity-content-generation">
              <p className="font-medium text-white text-sm">Content Generation</p>
              <p className="text-gray-400 text-sm">24 bài viết được tạo hôm nay</p>
              <p className="text-[#39FF14] text-xs mt-1">Active</p>
            </div>
            
            <div className="p-3 rounded bg-[#262626] border-l-4 border-[#39FF14]" data-testid="activity-market-analysis">
              <p className="font-medium text-white text-sm">Market Analysis</p>
              <p className="text-gray-400 text-sm">Phân tích 156 mentions</p>
              <p className="text-[#39FF14] text-xs mt-1">Completed</p>
            </div>
            
            <div className="p-3 rounded bg-[#262626] border-l-4 border-blue-400" data-testid="activity-campaign-optimization">
              <p className="font-medium text-white text-sm">Campaign Optimization</p>
              <p className="text-gray-400 text-sm">ROI cải thiện 12.3%</p>
              <p className="text-blue-400 text-xs mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
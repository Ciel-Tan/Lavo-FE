import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  // LayoutDashboard, 
  Brain, 
  Users, 
  // BarChart3, 
  Eye, 
  // Crown,
  Menu, 
  X,
  Bell,
  Settings,
  Zap,
  ShoppingCart,
  Lightbulb
} from 'lucide-react';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

export default function UnifiedLayout({ children }: UnifiedLayoutProps) {
  // const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Main navigation routes
  // const mainRoutes = [
  //   { 
  //     name: "Dashboard", 
  //     href: "/", 
  //     icon: LayoutDashboard,
  //     description: "Tổng quan hệ thống"
  //   },
  //   { 
  //     name: "Enhanced Analytics", 
  //     href: "/enhanced", 
  //     icon: BarChart3,
  //     description: "Phân tích nâng cao"
  //   },
  //   { 
  //     name: "CEO Dashboard", 
  //     href: "/ceo", 
  //     icon: Crown,
  //     description: "Báo cáo cấp cao"
  //   }
  // ];

  // Module navigation with dedicated pages
  const modules = [
    { 
      name: "Tự động hóa nội dung MKT", 
      id: "content-MKT-automation",
      href: "/content-MKT-automation",
      icon: Brain, 
      description: "Dây chuyền sản xuất nội dung MKT",
      count: 4,
      color: "emerald"
    },
    { 
      name: "Điều Phối Chiến Dịch 360°", 
      id: "campaign-center", 
      href: "/campaign-center",
      icon: Zap, 
      description: "Quản lý chiến dịch tập trung",
      count: 6,
      color: "blue"
    },
    { 
      name: "Đối Tác 360°", 
      id: "partner-360",
      href: "/partner-360",
      icon: Users, 
      description: "Chăm sóc đối tác salon",
      count: 15,
      color: "purple"
    },
    { 
      name: "Market Intelligence", 
      id: "market",
      href: "/market-intelligence",
      icon: Eye, 
      description: "Tình báo thị trường",
      count: 2,
      color: "orange"
    },
    { 
      name: "Trung Tâm TMĐT", 
      id: "ecommerce-hub",
      href: "/ecommerce-hub",
      icon: ShoppingCart, 
      description: "E-commerce Hub",
      count: 12,
      color: "green"
    },
    { 
      name: "Phòng Sáng Tạo AI", 
      id: "ai-concept-lab",
      href: "/ai-concept-lab",
      icon: Lightbulb, 
      description: "AI Concept Lab",
      count: 9,
      color: "purple"
    }
  ];

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      emerald: isActive 
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
        : 'hover:bg-emerald-500/10 hover:border-emerald-500/20',
      blue: isActive 
        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
        : 'hover:bg-blue-500/10 hover:border-blue-500/20',
      purple: isActive 
        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
        : 'hover:bg-purple-500/10 hover:border-purple-500/20',
      orange: isActive 
        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
        : 'hover:bg-orange-500/10 hover:border-orange-500/20'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 hover:bg-sky-50"
              data-testid="mobile-menu-toggle"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Link href="/" className="flex items-center space-x-3">
              <div className="gradient-ocean text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg ai-glow">
                LAVO
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
                <p className="text-gray-600 text-sm">Trung tâm điều hành thông minh</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              <span className="text-sky-700 text-sm font-medium">AI Online</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-700 hover:bg-sky-50"
              data-testid="notifications-button"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0 border-0 shadow-lg">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-sky-50"
              data-testid="settings-button"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static z-40 w-72 h-screen bg-white border-r border-gray-200 transition-transform duration-300 overflow-y-auto flex-shrink-0 shadow-lg`}>
          
          {/* Main Navigation */}
          {/* <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#39FF14]">NAVIGATION</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-[#39FF14]/10"
                data-testid="close-sidebar"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <nav className="space-y-2">
              {mainRoutes.map((route) => {
                const isActive = location === route.href;
                const Icon = route.icon;
                
                return (
                  <Link key={route.href} href={route.href}>
                    <div
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30' 
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                      data-testid={`nav-${route.href === '/' ? 'dashboard' : route.href.slice(1)}`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="flex-1">
                        <div className="font-medium">{route.name}</div>
                        <div className="text-xs opacity-70">{route.description}</div>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-[#39FF14] rounded-full"></div>}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div> */}

          {/* Modules Section */}
          <div className="px-6 pb-6 mt-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold ocean-text mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                MODULES
              </h3>
              
              <div className="space-y-3 mb-6">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const colorClasses = getColorClasses(module.color);
                  
                  const iconColorMap = {
                    emerald: 'text-emerald-600',
                    blue: 'text-sky-600',
                    purple: 'text-violet-600',
                    orange: 'text-orange-600'
                  };
                  
                  const badgeColorMap = {
                    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
                    blue: 'bg-sky-100 text-sky-700 border-sky-300',
                    purple: 'bg-violet-100 text-violet-700 border-violet-300',
                    orange: 'bg-orange-100 text-orange-700 border-orange-300'
                  };
                  
                  return (
                    <Link key={module.id} href={module.href}>
                      <div
                        onClick={() => setSidebarOpen(false)}
                        className={`p-3 rounded-lg bg-white border border-gray-200 transition-all cursor-pointer hover:shadow-md hover:border-sky-300 ${colorClasses}`}
                        data-testid={`module-${module.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${iconColorMap[module.color as keyof typeof iconColorMap]}`} />
                          <Badge className={`${badgeColorMap[module.color as keyof typeof badgeColorMap]} border text-xs`}>
                            {module.count}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">{module.name}</h4>
                        <p className="text-gray-600 text-xs mt-1">{module.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* System Status */}
              <div className="border-t border-gray-200 pt-4">
                <div className="ocean-bg rounded-lg p-4 border border-sky-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-900 text-sm font-medium">Hệ thống</span>
                  </div>
                  <div className="text-gray-700 text-xs">
                    Hoạt động ổn định
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50 lg:ml-0 ml-0">
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
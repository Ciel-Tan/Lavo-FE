// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import UnifiedLayout from './components/layout/unified-layout';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/queryClient';
import CleanDashboard from './pages/clean_dashboard';
import ContentMKTAutomationPage from './pages/content-MKT-automation';

function Router() {
  return (
    <Switch>
      <Route path="/" component={CleanDashboard} />
      <Route path="/content-MKT-automation" component={ContentMKTAutomationPage} />
      {/* <Route path="/enhanced" component={EnhancedDashboard} />
      <Route path="/ceo" component={CEODashboard} />
      <Route path="/content-factory" component={ContentFactoryPage} />
      <Route path="/campaign-center" component={CampaignCenterPage} />
      <Route path="/partner-360" component={Partner360Page} />
      <Route path="/market-intelligence" component={MarketIntelligencePage} />
      <Route path="/ecommerce-hub" component={EcommerceHubPage} />
      <Route path="/ai-concept-lab" component={AIConceptLabPage} />
      <Route component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UnifiedLayout>
          <Router />
        </UnifiedLayout>
        <Toaster /> 
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App

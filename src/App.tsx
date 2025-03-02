import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import FundAllocationPage from '@/pages/FundAllocation';
import SalesRevenue from '@/pages/SalesRevenue';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';

// Layout
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Auth Guard
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="investor-portal-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fund-allocation" element={<FundAllocationPage />} />
                <Route path="/sales-revenue" element={<SalesRevenue />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
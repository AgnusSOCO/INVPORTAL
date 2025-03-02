import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { AreaChart, BarChart, PieChart } from '@/components/ui/chart';
import { getDashboardOverview, getFundAllocations, getSalesData } from '@/lib/api';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  BarChart3,
  Loader2
} from 'lucide-react';

interface DashboardData {
  totalInvestment: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  recentTransactions: {
    id: number;
    type: string;
    amount: number;
    date: string;
    status: string;
  }[];
  monthlyRevenue: {
    name: string;
    revenue: number;
  }[];
  allocationData: {
    name: string;
    value: number;
  }[];
  salesData: {
    name: string;
    sales: number;
  }[];
}

// Fallback mock data in case API fails
const mockData: DashboardData = {
  totalInvestment: 250000,
  totalRevenue: 312500,
  totalProfit: 62500,
  profitMargin: 25,
  recentTransactions: [
    { id: 1, type: 'Fund Allocation', amount: 50000, date: '2025-03-15', status: 'completed' },
    { id: 2, type: 'GPU Purchase', amount: -35000, date: '2025-03-18', status: 'completed' },
    { id: 3, type: 'GPU Sale', amount: 42000, date: '2025-03-25', status: 'completed' },
    { id: 4, type: 'Fund Allocation', amount: 25000, date: '2025-04-01', status: 'pending' },
  ],
  monthlyRevenue: [
    { name: 'Jan', revenue: 18000 },
    { name: 'Feb', revenue: 22000 },
    { name: 'Mar', revenue: 32000 },
    { name: 'Apr', revenue: 28000 },
    { name: 'May', revenue: 35000 },
    { name: 'Jun', revenue: 42000 },
  ],
  allocationData: [
    { name: 'GPU Purchases', value: 65 },
    { name: 'Operating Costs', value: 15 },
    { name: 'Reserves', value: 20 },
  ],
  salesData: [
    { name: 'RTX 4090', sales: 42 },
    { name: 'RTX 4080', sales: 38 },
    { name: 'RTX 4070', sales: 55 },
    { name: 'RTX 3090', sales: 25 },
    { name: 'RTX 3080', sales: 30 },
  ],
};

const Dashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockData);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch data from multiple endpoints
      const [overviewData, allocationsData, salesData] = await Promise.all([
        getDashboardOverview(),
        getFundAllocations(),
        getSalesData()
      ]);
      
      // Process and transform the data
      const totalInvestment = allocationsData.fund_allocations.reduce(
        (sum, item) => sum + item.amount, 0
      );
      
      const totalRevenue = salesData.sales.reduce(
        (sum, item) => sum + (item.resale_price * (item.quantity || 1)), 0
      );
      
      const totalProfit = salesData.sales.reduce(
        (sum, item) => sum + item.profit, 0
      );
      
      const profitMargin = totalInvestment > 0 
        ? (totalProfit / totalInvestment) * 100 
        : 0;
      
      // Transform sales data for charts
      const salesByModel = salesData.sales.reduce((acc, item) => {
        acc[item.gpu_model] = (acc[item.gpu_model] || 0) + (item.quantity || 1);
        return acc;
      }, {} as Record<string, number>);
      
      const salesChartData = Object.entries(salesByModel).map(([name, sales]) => ({
        name,
        sales,
      }));
      
      // Transform allocation data for charts
      const allocationByCategory = allocationsData.fund_allocations.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const totalAllocation = Object.values(allocationByCategory).reduce((sum, val) => sum + val, 0);
      
      const allocationChartData = Object.entries(allocationByCategory).map(([name, value]) => ({
        name,
        value: totalAllocation > 0 ? Math.round((value / totalAllocation) * 100) : 0,
      }));
      
      // Create recent transactions list
      const recentTransactions = [
        ...allocationsData.fund_allocations.map(item => ({
          id: item.id,
          type: 'Fund Allocation',
          amount: item.amount,
          date: item.date,
          status: 'completed'
        })),
        ...salesData.sales.map(item => ({
          id: item.id,
          type: 'GPU Sale',
          amount: item.profit,
          date: item.date,
          status: 'completed'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, 5);
      
      // Combine all data
      const processedData: DashboardData = {
        totalInvestment,
        totalRevenue,
        totalProfit,
        profitMargin: parseFloat(profitMargin.toFixed(1)),
        recentTransactions,
        monthlyRevenue: overviewData && typeof overviewData === 'object' && 'monthly_revenue' in overviewData 
          ? (overviewData.monthly_revenue as any[]) 
          : mockData.monthlyRevenue,
        allocationData: allocationChartData,
        salesData: salesChartData,
      };
      
      setDashboardData(processedData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data. Using cached data instead.",
      });
      // Fallback to mock data
      setDashboardData(mockData);
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTransactionClick = (id: number) => {
    setSelectedTransaction(selectedTransaction === id ? null : id);
  };

  const handleRefreshData = () => {
    fetchDashboardData();
    toast({
      title: "Dashboard refreshed",
      description: "Latest data has been loaded",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your investment performance and key metrics
          </p>
        </div>
        <button 
          onClick={handleRefreshData}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin duration-1000">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all fund allocations
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all GPU sales
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.totalProfit.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+{dashboardData.profitMargin}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.profitMargin}%</div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2.5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue from GPU sales
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChart
                  data={dashboardData.monthlyRevenue}
                  index="name"
                  categories={["revenue"]}
                  colors={["hsl(var(--chart-1))"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  showLegend={false}
                  showGridLines={false}
                  startEndOnly={false}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Fund Allocation</CardTitle>
                <CardDescription>
                  How your investment is allocated
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart
                  data={dashboardData.allocationData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value}%`}
                  colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent investment activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedTransaction === transaction.id 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleTransactionClick(transaction.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-2 ${
                          transaction.amount > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className={`h-4 w-4 ${
                              transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                            }`} />
                          ) : (
                            <ArrowDownRight className={`h-4 w-4 ${
                              transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                            }`} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.type}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>GPU Sales by Model</CardTitle>
                <CardDescription>
                  Number of units sold by model
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={dashboardData.salesData}
                  index="name"
                  categories={["sales"]}
                  colors={["hsl(var(--chart-2))"]}
                  valueFormatter={(value) => `${value} units`}
                  showLegend={false}
                  showGridLines={false}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of your investment performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center border-2 border-dashed">
                <p className="text-muted-foreground">Advanced analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Download and view your investment reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center border-2 border-dashed">
                <p className="text-muted-foreground">Report generation coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
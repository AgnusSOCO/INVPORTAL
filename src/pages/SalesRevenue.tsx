import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart } from '@/components/ui/chart';
import { getSalesData, addSaleRecord, Sale } from '@/lib/api';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';

// Fallback mock data
const mockSales: Sale[] = [
  { 
    id: 1, 
    date: '2025-03-20', 
    gpu_model: 'RTX 4090', 
    purchase_price: 1200, 
    resale_price: 1450, 
    quantity: 5,
    profit: 1250,
    profit_margin: 20.8,
    customer: 'TechCorp Inc.',
    notes: 'Bulk order for new gaming cafe' 
  },
  { 
    id: 2, 
    date: '2025-03-25', 
    gpu_model: 'RTX 4080', 
    purchase_price: 950, 
    resale_price: 1150, 
    quantity: 8,
    profit: 1600,
    profit_margin: 21.1,
    customer: 'GameStation',
    notes: 'Regular client, repeat order' 
  },
  { 
    id: 3, 
    date: '2025-04-02', 
    gpu_model: 'RTX 4070', 
    purchase_price: 700, 
    resale_price: 850, 
    quantity: 12,
    profit: 1800,
    profit_margin: 21.4,
    customer: 'MiningOps LLC',
    notes: 'New client, potential for larger orders' 
  },
  { 
    id: 4, 
    date: '2025-04-10', 
    gpu_model: 'RTX 3090', 
    purchase_price: 800, 
    resale_price: 950, 
    quantity: 6,
    profit: 900,
    profit_margin: 18.8,
    customer: 'VR Solutions',
    notes: 'For VR development workstations' 
  },
  { 
    id: 5, 
    date: '2025-04-15', 
    gpu_model: 'RTX 4090', 
    purchase_price: 1200, 
    resale_price: 1500, 
    quantity: 4,
    profit: 1200,
    profit_margin: 25.0,
    customer: 'AI Research Lab',
    notes: 'Premium pricing for urgent delivery' 
  },
];

const gpuModels = [
  'RTX 4090',
  'RTX 4080',
  'RTX 4070',
  'RTX 3090',
  'RTX 3080',
  'RTX 3070',
];

const saleSchema = z.object({
  gpuModel: z.string().min(1, { message: 'GPU model is required' }),
  purchasePrice: z.coerce.number().positive({ message: 'Purchase price must be positive' }),
  salePrice: z.coerce.number().positive({ message: 'Sale price must be positive' }),
  quantity: z.coerce.number().int().positive({ message: 'Quantity must be a positive integer' }),
  customer: z.string().min(1, { message: 'Customer name is required' }),
  notes: z.string().optional(),
});

type SaleFormValues = z.infer<typeof saleSchema>;

const SalesRevenue = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<number | null>(null);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      gpuModel: '',
      purchasePrice: undefined,
      salePrice: undefined,
      quantity: undefined,
      customer: '',
      notes: '',
    },
  });

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSalesData();
      setSales(data.sales || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sales data. Using cached data instead.",
      });
      // Fallback to mock data
      setSales(mockSales);
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const onSubmit = async (data: SaleFormValues) => {
    setIsSubmitting(true);
    try {
      await addSaleRecord(data);
      
      // Calculate profit and margin for the new sale
      const totalPurchase = data.purchasePrice * data.quantity;
      const totalSale = data.salePrice * data.quantity;
      const profit = totalSale - totalPurchase;
      const profitMargin = (profit / totalPurchase) * 100;
      
      // Create a new sale object to add to the local state
      const newSale: Sale = {
        id: Date.now(), // Temporary ID until we refresh
        gpu_model: data.gpuModel,
        purchase_price: data.purchasePrice,
        resale_price: data.salePrice,
        quantity: data.quantity,
        profit: profit,
        profit_margin: parseFloat(profitMargin.toFixed(1)),
        customer: data.customer,
        date: new Date().toISOString().split('T')[0],
        notes: data.notes || ''
      };
      
      // Update local state with the new sale
      setSales([newSale, ...sales]);
      
      toast({
        title: "Sale recorded",
        description: `${data.quantity} ${data.gpuModel} units sold to ${data.customer}`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Error adding sale:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record sale",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchSales();
    toast({
      title: "Data refreshed",
      description: "Latest sales data has been loaded",
    });
  };

  const handleRowClick = (id: number) => {
    setSelectedSale(selectedSale === id ? null : id);
  };

  // Calculate summary data
  const totalRevenue = sales.reduce((sum, item) => sum + (item.resale_price * item.quantity), 0);
  const totalProfit = sales.reduce((sum, item) => sum + item.profit, 0);
  const totalUnits = sales.reduce((sum, item) => sum + item.quantity, 0);
  const avgProfitMargin = sales.length > 0 
    ? sales.reduce((sum, item) => sum + item.profit_margin, 0) / sales.length 
    : 0;
  
  // Prepare chart data
  const salesByModel = sales.reduce((acc, item) => {
    acc[item.gpu_model] = (acc[item.gpu_model] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);
  
  const salesChartData = Object.entries(salesByModel).map(([name, sales]) => ({
    name,
    sales,
  }));
  
  // Profit trend data (simplified for demo)
  const profitTrendData = sales
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(sale => ({
      date: sale.date,
      profit: sale.profit,
    }));

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
          <h1 className="text-3xl font-bold tracking-tight">Sales & Revenue</h1>
          <p className="text-muted-foreground">
            Track GPU sales and monitor revenue performance
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin duration-1000">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Refresh Data
        </button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add">Record Sale</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From {sales.length} sales
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. margin: {avgProfitMargin.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <p className="text-xs text-muted-foreground">
                  Across all GPU models
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Sale</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${sales[0]?.resale_price.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {sales[0]?.gpu_model || 'No sales yet'} ({sales[0]?.quantity || 0} units)
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Sales by GPU Model</CardTitle>
                <CardDescription>
                  Number of units sold by model
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {salesChartData.length > 0 ? (
                  <BarChart
                    data={salesChartData}
                    index="name"
                    categories={["sales"]}
                    colors={["hsl(var(--chart-1))"]}
                    valueFormatter={(value) => `${value} units`}
                    showLegend={false}
                    showGridLines={false}
                    className="h-[300px]"
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">No sales data</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
                <CardDescription>
                  Profit over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {profitTrendData.length > 0 ? (
                  <LineChart
                    data={profitTrendData}
                    index="date"
                    categories={["profit"]}
                    colors={["hsl(var(--chart-2))"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    showLegend={false}
                    showGridLines={false}
                    className="h-[300px]"
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">No profit data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Your most recent GPU sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>GPU Model</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.slice(0, 5).map((sale) => (
                    <TableRow 
                      key={sale.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedSale === sale.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleRowClick(sale.id)}
                    >
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: hoveredModel === sale.gpu_model || selectedSale === sale.id 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'transparent',
                            color: 'var(--primary)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={() => setHoveredModel(sale.gpu_model)}
                          onMouseLeave={() => setHoveredModel(null)}
                        >
                          {sale.gpu_model}
                        </span>
                      </TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${sale.resale_price.toLocaleString()}</TableCell>
                      <TableCell>${(sale.resale_price * sale.quantity).toLocaleString()}</TableCell>
                      <TableCell>${sale.profit.toLocaleString()}</TableCell>
                      <TableCell>{sale.profit_margin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  {sales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No sales found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
              <CardDescription>
                Add details of a new GPU sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gpuModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPU Model</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select GPU model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gpuModels.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price (per unit)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Cost price per GPU unit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price (per unit)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1200" {...field} />
                          </FormControl>
                          <FormDescription>
                            Selling price per GPU unit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer name or company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about the sale (optional)"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Record Sale
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>
                Complete history of your GPU sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>GPU Model</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow 
                      key={sale.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedSale === sale.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleRowClick(sale.id)}
                    >
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: hoveredModel === sale.gpu_model || selectedSale === sale.id 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'transparent',
                            color: 'var(--primary)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={() => setHoveredModel(sale.gpu_model)}
                          onMouseLeave={() => setHoveredModel(null)}
                        >
                          {sale.gpu_model}
                        </span>
                      </TableCell>
                      <TableCell>{sale.customer}</TableCell>
                 <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${sale.resale_price.toLocaleString()}</TableCell>
                      <TableCell>${(sale.resale_price * sale.quantity).toLocaleString()}</TableCell>
                      <TableCell>${sale.profit.toLocaleString()}</TableCell>
                      <TableCell>{sale.profit_margin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  {sales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No sales found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing {sales.length} sales
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesRevenue;
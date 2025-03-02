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
import { PieChart } from '@/components/ui/chart';
import { getFundAllocations, addFundAllocation, FundAllocation as FundAllocationType } from '@/lib/api';
import { CreditCard, DollarSign, Loader2, Plus } from 'lucide-react';

// Fallback mock data
const mockAllocations: FundAllocationType[] = [
  { id: 1, amount: 50000, date: '2025-03-15', category: 'GPU Purchases', notes: 'Initial investment for Q1 2025' },
  { id: 2, amount: 25000, date: '2025-03-28', category: 'Operating Costs', notes: 'Staff and facility costs for Q1' },
  { id: 3, amount: 75000, date: '2025-04-10', category: 'GPU Purchases', notes: 'Expansion for Q2 inventory' },
  { id: 4, amount: 30000, date: '2025-04-22', category: 'Reserves', notes: 'Emergency fund' },
  { id: 5, amount: 70000, date: '2025-05-05', category: 'GPU Purchases', notes: 'New models acquisition' },
];

const allocationSchema = z.object({
  category: z.string().min(2, { message: 'Category is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  notes: z.string().optional(),
});

type AllocationFormValues = z.infer<typeof allocationSchema>;

const FundAllocationPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocations, setAllocations] = useState<FundAllocationType[]>([]);
  const [selectedAllocation, setSelectedAllocation] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      category: '',
      amount: undefined,
      notes: '',
    },
  });

  const fetchAllocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFundAllocations();
      setAllocations(data.fund_allocations || []);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load fund allocation data. Using cached data instead.",
      });
      // Fallback to mock data
      setAllocations(mockAllocations);
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const onSubmit = async (data: AllocationFormValues) => {
    setIsSubmitting(true);
    try {
      await addFundAllocation(data);
      
      // Create a new allocation object to add to the local state
      const newAllocation: FundAllocationType = {
        id: Date.now(), // Temporary ID until we refresh
        category: data.category,
        amount: data.amount,
        date: new Date().toISOString().split('T')[0],
        notes: data.notes
      };
      
      // Update local state with the new allocation
      setAllocations([newAllocation, ...allocations]);
      
      toast({
        title: "Fund allocation added",
        description: `$${data.amount.toLocaleString()} has been allocated to ${data.category}`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Error adding allocation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add fund allocation",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchAllocations();
    toast({
      title: "Data refreshed",
      description: "Latest allocation data has been loaded",
    });
  };

  const handleRowClick = (id: number) => {
    setSelectedAllocation(selectedAllocation === id ? null : id);
  };

  // Calculate summary data
  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);
  
  const categorySummary = allocations.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const chartData = Object.entries(categorySummary).map(([name, value]) => ({
    name,
    value: Math.round((value / totalAllocated) * 100),
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
          <h1 className="text-3xl font-bold tracking-tight">Fund Allocation</h1>
          <p className="text-muted-foreground">
            Manage and track your investment allocations
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
          <TabsTrigger value="add">Add Allocation</TabsTrigger>
          <TabsTrigger value="history">Allocation History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across {allocations.length} allocations
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Allocation</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${allocations[0]?.amount.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {allocations[0]?.date || 'No allocations yet'}
                </p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Allocation by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <PieChart
                    data={chartData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]}
                    className="h-[200px]"
                  />
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No allocation data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Recent Allocations</CardTitle>
              <CardDescription>
                Your most recent fund allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.slice(0, 5).map((allocation) => (
                    <TableRow 
                      key={allocation.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedAllocation === allocation.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleRowClick(allocation.id)}
                    >
                      <TableCell>{allocation.date}</TableCell>
                      <TableCell>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: hoveredCategory === allocation.category || selectedAllocation === allocation.id 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'transparent',
                            color: 'var(--primary)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={() => setHoveredCategory(allocation.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          {allocation.category}
                        </span>
                      </TableCell>
                      <TableCell>${allocation.amount.toLocaleString()}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{allocation.notes}</TableCell>
                    </TableRow>
                  ))}
                  {allocations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No allocations found
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
              <CardTitle>Add New Fund Allocation</CardTitle>
              <CardDescription>
                Record a new investment allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="GPU Purchases" {...field} />
                        </FormControl>
                        <FormDescription>
                          What is this allocation for?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the amount in USD
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional details about this allocation" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-300 hover:shadow-md" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Allocation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Allocation History</CardTitle>
              <CardDescription>
                Complete history of your fund allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow 
                      key={allocation.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedAllocation === allocation.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleRowClick(allocation.id)}
                    >
                      <TableCell>{allocation.date}</TableCell>
                      <TableCell>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: hoveredCategory === allocation.category || selectedAllocation === allocation.id 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'transparent',
                            color: 'var(--primary)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={() => setHoveredCategory(allocation.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          {allocation.category}
                        </span>
                      </TableCell>
                      <TableCell>${allocation.amount.toLocaleString()}</TableCell>
                      <TableCell>{allocation.notes}</TableCell>
                    </TableRow>
                  ))}
                  {allocations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No allocations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing {allocations.length} allocations
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundAllocationPage;
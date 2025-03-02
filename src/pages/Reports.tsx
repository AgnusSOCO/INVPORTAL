import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getReports, addReport, Report } from '@/lib/api';
import { FileText, Loader2, Download } from 'lucide-react';

// Fallback mock data
const mockReports = [
  { 
    id: 1, 
    title: 'Q1 2025 Financial Summary', 
    type: 'quarterly', 
    date: '2025-03-31',
    status: 'published',
    content: 'Summary of Q1 2025 financial performance including revenue, expenses, and profit analysis.',
    url: '#'
  },
  { 
    id: 2, 
    title: 'GPU Market Analysis - March 2025', 
    type: 'market', 
    date: '2025-03-15',
    status: 'published',
    content: 'Analysis of current GPU market trends, pricing fluctuations, and future projections.',
    url: '#'
  },
  { 
    id: 3, 
    title: 'Investor Profit Distribution - Q1', 
    type: 'financial', 
    date: '2025-04-05',
    status: 'draft',
    content: 'Detailed breakdown of Q1 profit distribution among investors based on allocation percentages.',
    url: '#'
  },
  { 
    id: 4, 
    title: 'Strategic Outlook - 2025', 
    type: 'strategic', 
    date: '2025-01-10',
    status: 'published',
    content: 'Long-term strategic plan for 2025, including market positioning, growth targets, and risk assessment.',
    url: '#'
  },
  { 
    id: 5, 
    title: 'April 2025 Performance Update', 
    type: 'monthly', 
    date: '2025-05-01',
    status: 'draft',
    content: 'Monthly performance update for April 2025, highlighting key achievements and challenges.',
    url: '#'
  },
];

const reportTypes = [
  'monthly',
  'quarterly',
  'financial',
  'market',
  'strategic',
  'operational',
];

const reportSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  type: z.string().min(1, { message: 'Report type is required' }),
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters' }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ExtendedReport extends Report {
  url?: string;
}

const Reports = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<ExtendedReport[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      type: '',
      summary: '',
    },
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getReports();
        setReports(data.reports || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reports. Using cached data instead.",
        });
        // Fallback to mock data
        setReports(mockReports);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [token, toast]);

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      await addReport(data);
      
      // Create a new report object to add to the local state
      const newReport: ExtendedReport = {
        id: Date.now(), // Temporary ID until we refresh
        title: data.title,
        type: data.type,
        content: data.summary,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        url: '#'
      };
      
      // Update local state with the new report
      setReports([newReport, ...reports]);
      
      toast({
        title: "Report created",
        description: "Your report has been saved as a draft",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create report",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return <Badge className="bg-green-500">Published</Badge>;
    } else if (status === 'draft') {
      return <Badge variant="outline">Draft</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">
          Create and manage investor financial reports
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="create">Create Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>
                View and manage all financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={report.url || '#'} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Published Reports</CardTitle>
              <CardDescription>
                View all published financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.status === 'published')
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell className="capitalize">{report.type}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={report.url || '#'} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {reports.filter(report => report.status === 'published').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No published reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Reports</CardTitle>
              <CardDescription>
                View and edit draft reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.status === 'draft')
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell className="capitalize">{report.type}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={report.url || '#'} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {reports.filter(report => report.status === 'draft').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No draft reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Report</CardTitle>
              <CardDescription>
                Create a new financial report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type} value={type} className="capitalize">
                                {type}
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
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter report summary"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Report
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
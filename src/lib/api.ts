import { toast } from "@/components/ui/use-toast";

const API_URL = 'https://api.obsidiancapital.org';

// Generic API request function with authentication
export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<T> {
  const token = localStorage.getItem('token');
  
  if (requiresAuth && !token) {
    throw new Error('Authentication required');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    toast({
      variant: "destructive",
      title: "API Request Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  }
}

// Authentication API
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{ message: string }>('/register', 'POST', data, false);
}

export async function loginUser(email: string, password: string) {
  // Create form data with username (email) and password
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  try {
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Login failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    toast({
      variant: "destructive",
      title: "Login Failed",
      description: error instanceof Error ? error.message : "Invalid credentials",
    });
    throw error;
  }
}

// Dashboard API
export async function getDashboardOverview() {
  return apiRequest('/dashboard/overview', 'GET');
}

// Fund Allocation API
export interface FundAllocation {
  id: number;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

export async function getFundAllocations() {
  return apiRequest<{ fund_allocations: FundAllocation[] }>('/investors/fund-allocation', 'GET');
}

export async function addFundAllocation(data: {
  category: string;
  amount: number;
  notes?: string;
}) {
  return apiRequest<{ message: string }>('/investors/fund-allocation', 'POST', {
    ...data,
    date: new Date().toISOString().split('T')[0],
  });
}

// Sales & Revenue API
export interface Sale {
  id: number;
  gpu_model: string;
  purchase_price: number;
  resale_price: number;
  quantity: number;
  profit: number;
  profit_margin: number;
  customer: string;
  date: string;
  notes?: string;
}

export async function getSalesData() {
  return apiRequest<{ sales: Sale[] }>('/sales/revenue', 'GET');
}

export async function addSaleRecord(data: {
  gpuModel: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  customer: string;
  notes?: string;
}) {
  const totalPurchase = data.purchasePrice * data.quantity;
  const totalSale = data.salePrice * data.quantity;
  const profit = totalSale - totalPurchase;
  const profitMargin = (profit / totalPurchase) * 100;
  
  return apiRequest<{ message: string }>('/sales/revenue', 'POST', {
    gpu_model: data.gpuModel,
    purchase_price: data.purchasePrice,
    resale_price: data.salePrice,
    quantity: data.quantity,
    profit: profit,
    profit_margin: parseFloat(profitMargin.toFixed(1)),
    customer: data.customer,
    notes: data.notes,
    date: new Date().toISOString().split('T')[0],
  });
}

// Reports API
export interface Report {
  id: number;
  title: string;
  content: string;
  type: string;
  date: string;
  status: string;
}

export async function getReports() {
  return apiRequest<{ reports: Report[] }>('/reports', 'GET');
}

export async function addReport(data: {
  title: string;
  type: string;
  summary: string;
}) {
  return apiRequest<{ message: string }>('/reports', 'POST', {
    title: data.title,
    content: data.summary,
    type: data.type,
    date: new Date().toISOString().split('T')[0],
  });
}
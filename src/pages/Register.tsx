import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BarChart3, Loader2, Lock, Mail, Shield, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const success = await register(data.email, data.password, data.name);
    if (success) {
      navigate('/login');
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-background min-h-screen w-full flex flex-col">
      <header className="flex h-16 items-center px-6 lg:px-8 z-10">
        <Link to="/" className={`flex items-center gap-2 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          <BarChart3 className="h-6 w-6 text-emerald-500" />
          <span className="text-lg tracking-tight">Obsidian Capital</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 relative">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[100px] opacity-10"></div>
        </div>
        
        <div className="w-full max-w-md mx-auto relative z-10">
          <Card className={isDark 
            ? "border-0 bg-black/40 backdrop-blur-xl shadow-2xl" 
            : "border border-gray-200 bg-white/90 backdrop-blur-xl shadow-xl"}>
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create an account</CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-gray-500"}>
                Apply for membership in our exclusive investor collective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className={`absolute left-3 top-2.5 h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            <Input 
                              placeholder="John Doe" 
                              className={isDark 
                                ? "pl-10 bg-gray-900/50 border-gray-800 text-white" 
                                : "pl-10 bg-white border-gray-200 text-gray-900"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-2.5 h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            <Input 
                              placeholder="name@example.com" 
                              className={isDark 
                                ? "pl-10 bg-gray-900/50 border-gray-800 text-white" 
                                : "pl-10 bg-white border-gray-200 text-gray-900"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className={`absolute left-3 top-2.5 h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className={isDark 
                                ? "pl-10 bg-gray-900/50 border-gray-800 text-white" 
                                : "pl-10 bg-white border-gray-200 text-gray-900"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? "text-gray-300" : "text-gray-700"}>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className={`absolute left-3 top-2.5 h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className={isDark 
                                ? "pl-10 bg-gray-900/50 border-gray-800 text-white" 
                                : "pl-10 bg-white border-gray-200 text-gray-900"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full glow-effect bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-medium py-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Apply for Membership'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className={`flex flex-col space-y-4 border-t ${isDark 
              ? "border-gray-800 bg-black/20" 
              : "border-gray-200 bg-gray-50/50"} rounded-b-lg`}>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} pt-2`}>
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 underline-offset-4 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="h-3 w-3" />
              <span>Secure, encrypted connection</span>
            </div>
            <p>© 2025 Obsidian Capital Collective. All rights reserved.</p>
            <p className="mt-1">By registering, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
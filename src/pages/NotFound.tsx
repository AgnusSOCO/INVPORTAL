import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const NotFound = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center text-center ${isDark 
      ? "bg-gradient-to-br from-black via-gray-900 to-gray-800" 
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className={`text-5xl font-bold tracking-tighter ${isDark ? "text-white" : "text-gray-900"} sm:text-6xl`}>404</h1>
          <p className="text-2xl font-semibold text-emerald-500">Page Not Found</p>
          <p className={`mx-auto max-w-[600px] ${isDark ? "text-gray-400" : "text-gray-600"} md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button 
            variant="outline" 
            asChild 
            className={isDark 
              ? "border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white" 
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}
          >
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center text-xs text-gray-500">
        <p>© 2025 Obsidian Capital Collective. All rights reserved.</p>
      </div>
    </div>
  );
};

export default NotFound;
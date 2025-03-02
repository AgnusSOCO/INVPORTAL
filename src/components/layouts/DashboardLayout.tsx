import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import {
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { path: '/fund-allocation', label: 'Fund Allocation', icon: <CreditCard className="h-5 w-5" /> },
  { path: '/sales-revenue', label: 'Sales & Revenue', icon: <DollarSign className="h-5 w-5" /> },
  { path: '/reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={`flex min-h-screen flex-col ${isDark 
      ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" 
      : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}>
      {/* Mobile Header */}
      <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b ${isDark 
        ? "border-gray-800 bg-gray-950/80" 
        : "border-gray-200 bg-white/80"} backdrop-blur-md px-4 md:hidden`}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={`md:hidden ${isDark 
                ? "border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800" 
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className={`w-[280px] border-r ${isDark 
              ? "border-gray-800 bg-gray-950" 
              : "border-gray-200 bg-white"} p-0`}
          >
            <div className={`flex h-16 items-center border-b ${isDark 
              ? "border-gray-800" 
              : "border-gray-200"} px-6`}>
              <div className={`flex items-center gap-2 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                <BarChart3 className="h-6 w-6 text-emerald-500" />
                <span>Obsidian Capital</span>
              </div>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive 
                        ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-600 font-medium" 
                        : isDark 
                          ? "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                  {item.path === '/dashboard' && (
                    <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-600">
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className={`mt-auto border-t ${isDark ? "border-gray-800" : "border-gray-200"} p-4`}>
              <Button 
                variant="outline" 
                className={`w-full justify-start gap-2 ${isDark 
                  ? "border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white" 
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`} 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className={`flex-1 text-center text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          <span className="text-emerald-500">Obsidian</span> Capital
        </div>
        <UserMenu userInitials={userInitials} handleLogout={handleLogout} isDark={isDark} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className={`hidden w-64 flex-col border-r ${isDark 
          ? "border-gray-800 bg-gray-950" 
          : "border-gray-200 bg-white"} md:flex`}>
          <div className={`flex h-16 items-center border-b ${isDark 
            ? "border-gray-800" 
            : "border-gray-200"} px-6`}>
            <div className={`flex items-center gap-2 font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span>Obsidian Capital</span>
            </div>
          </div>
          <nav className="flex-1 overflow-auto py-6 px-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive 
                        ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 text-emerald-600 font-medium" 
                        : isDark 
                          ? "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                  {item.path === '/dashboard' && (
                    <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-600">
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
          <div className={`border-t ${isDark ? "border-gray-800" : "border-gray-200"} p-4`}>
            <Button 
              variant="outline" 
              className={`w-full justify-start gap-2 ${isDark 
                ? "border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white" 
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`} 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 ${isDark 
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}>
          {/* Desktop Header */}
          <header className={`sticky top-0 z-30 hidden h-16 items-center justify-between border-b ${isDark 
            ? "border-gray-800 bg-gray-950/80" 
            : "border-gray-200 bg-white/80"} backdrop-blur-md px-6 md:flex`}>
            <div></div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserMenu userInitials={userInitials} handleLogout={handleLogout} isDark={isDark} />
            </div>
          </header>

          {/* Page content */}
          <div className="container py-6 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function UserMenu({ userInitials, handleLogout, isDark }: { userInitials: string; handleLogout: () => void; isDark: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`relative h-9 w-9 rounded-full ${isDark 
            ? "border border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800" 
            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          <Avatar className={`h-9 w-9 ${isDark ? "border border-emerald-500/20" : "border border-emerald-500/30"}`}>
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`w-56 ${isDark 
          ? "border-gray-800 bg-gray-950 text-gray-300" 
          : "border-gray-200 bg-white text-gray-700"}`}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className={`text-sm font-medium leading-none ${isDark ? "text-white" : "text-gray-900"}`}>My Account</p>
            <p className="text-xs leading-none text-gray-500">Investor Profile</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={isDark ? "bg-gray-800" : "bg-gray-200"} />
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${isDark 
            ? "text-gray-300 focus:bg-gray-800 focus:text-white" 
            : "text-gray-700 focus:bg-gray-100 focus:text-gray-900"}`}
        >
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${isDark 
            ? "text-gray-300 focus:bg-gray-800 focus:text-white" 
            : "text-gray-700 focus:bg-gray-100 focus:text-gray-900"}`} 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardLayout;
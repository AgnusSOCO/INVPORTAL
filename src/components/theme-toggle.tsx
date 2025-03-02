import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={theme === 'dark' 
            ? "border border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white" 
            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          }
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={theme === 'dark' 
          ? "border-gray-800 bg-gray-950 text-gray-300" 
          : "border-gray-200 bg-white text-gray-700"
        }
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={theme === 'dark' 
            ? "focus:bg-gray-800 focus:text-white" 
            : "focus:bg-gray-100"
          }
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={theme === 'dark' 
            ? "focus:bg-gray-800 focus:text-white" 
            : "focus:bg-gray-100"
          }
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={theme === 'dark' 
            ? "focus:bg-gray-800 focus:text-white" 
            : "focus:bg-gray-100"
          }
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
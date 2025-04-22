import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { motion, Variants } from "framer-motion";
import { memo, useCallback } from "react";

/**
 * Theme Toggle Component
 * 
 * Animated toggle button that switches between light and dark themes
 * with smooth transitions and animations
 */
export const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  // Handle theme toggle with callback to prevent rerenders
  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  // Animation variants for icons
  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce effect
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* sun icon for light mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* moon icon for dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

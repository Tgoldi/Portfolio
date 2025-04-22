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
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full h-10 w-10 relative overflow-hidden focus-visible:ring-offset-2"
    >
      <div className="relative w-full h-full">
        {/* Sun icon for light theme */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate={!isDark ? "visible" : "exit"}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={isDark}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
        </motion.div>
        
        {/* Moon icon for dark theme */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate={isDark ? "visible" : "exit"}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={!isDark}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
        </motion.div>
      </div>
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

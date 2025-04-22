import { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Menu, X, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAccessibility } from "@/App";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Settings, 
  EyeIcon, 
  Activity 
} from "lucide-react";

/**
 * Header component props
 */
interface HeaderProps {
  /** Whether the page has been scrolled */
  scrolled: boolean;
}

/**
 * Navigation item type
 */
interface NavItem {
  path: string;
  label: string;
}

// Navigation items configuration
const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { path: "/experience", label: "Experience" },
  { path: "/contact", label: "Contact" }
];

/**
 * Header Component
 * 
 * Responsive header with desktop and mobile navigation
 */
const Header = ({ scrolled }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu handler
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Toggle mobile menu handler
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  // Handle clicks outside of mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  // Control body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when mobile menu is closed
      document.body.style.overflow = "auto";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Animation variants
  const navItemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const mobileNavItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { 
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const logoVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Skip to content link for keyboard users
  const SkipToContent = () => (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-crimson"
    >
      Skip to content
    </a>
  );

  // Add Accessibility Menu component
  const AccessibilityMenu = () => {
    const { 
      reducedMotion, 
      toggleReducedMotion, 
      highContrast, 
      toggleHighContrast 
    } = useAccessibility();

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            aria-label="Accessibility Options"
            className="rounded-full mr-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Accessibility Settings</h3>
            
            <div className="flex items-center justify-between">
              <label 
                htmlFor="high-contrast" 
                className="text-sm flex items-center gap-2"
              >
                <EyeIcon className="h-4 w-4" />
                High Contrast
              </label>
              <Toggle 
                id="high-contrast"
                aria-label="Toggle high contrast mode"
                pressed={highContrast}
                onPressedChange={toggleHighContrast}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label 
                htmlFor="reduced-motion" 
                className="text-sm flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Reduced Motion
              </label>
              <Toggle 
                id="reduced-motion"
                aria-label="Toggle reduced motion mode"
                pressed={reducedMotion}
                onPressedChange={toggleReducedMotion}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <SkipToContent />
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          variants={logoVariants}
          initial="initial"
          animate="animate"
        >
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tight relative"
            onClick={closeMobileMenu}
            aria-label="Tomer - Homepage"
          >
            <span className="text-crimson">T</span>omer
            <motion.span 
              className="text-crimson"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
                transition: { 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }
              }}
              aria-hidden="true"
            >
              .
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_ITEMS.map((item, i) => (
            <DesktopNavItem key={item.path} item={item} index={i} />
          ))}
          
          <motion.div
            custom={NAV_ITEMS.length}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
          >
            <div className="flex items-center gap-2">
              <AccessibilityMenu />
              <ThemeToggle />
            </div>
          </motion.div>
          
          <motion.div
            custom={NAV_ITEMS.length + 1}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Button 
              asChild
              variant="default" 
              size="sm"
              className="bg-crimson hover:bg-crimson/90"
            >
              <a
                href="https://github.com/Tgoldi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          </motion.div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md md:hidden pt-16"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Mobile navigation"
          >
            {/* Close button at the top right */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="text-foreground hover:bg-background/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
            
            <nav className="container-custom flex flex-col items-center gap-8 py-8">
              {/* Add mobile title/logo */}
              <motion.div
                variants={mobileNavItemVariants}
                className="mb-8"
              >
                <Link 
                  to="/" 
                  className="text-3xl font-bold tracking-tight relative"
                  onClick={closeMobileMenu}
                  aria-label="Tomer - Homepage"
                >
                  <span className="text-crimson">T</span>omer
                  <motion.span 
                    className="text-crimson"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1],
                      transition: { 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }
                    }}
                    aria-hidden="true"
                  >
                    .
                  </motion.span>
                </Link>
              </motion.div>
              
              {NAV_ITEMS.map((item) => (
                <MobileNavItem 
                  key={item.path} 
                  item={item} 
                  onClose={closeMobileMenu} 
                />
              ))}
              
              <motion.div
                variants={mobileNavItemVariants}
                className="mt-4"
              >
                <Button 
                  asChild
                  size="lg"
                  className="w-full bg-crimson hover:bg-crimson/90 gap-2"
                >
                  <a
                    href="https://github.com/Tgoldi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    onClick={closeMobileMenu}
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/**
 * Desktop Navigation Item Component
 */
interface DesktopNavItemProps {
  item: NavItem;
  index: number;
}

const DesktopNavItem = ({ item, index }: DesktopNavItemProps) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: -10 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      })
    }}
  >
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors relative group",
          isActive ? "text-crimson" : "text-foreground/70 hover:text-foreground"
        )
      }
    >
      {item.label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson group-hover:w-full transition-all duration-300 ease-in-out" />
    </NavLink>
  </motion.div>
);

/**
 * Mobile Navigation Item Component
 */
interface MobileNavItemProps {
  item: NavItem;
  onClose: () => void;
}

const MobileNavItem = ({ item, onClose }: MobileNavItemProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }}
    className="w-full"
  >
    <NavLink
      to={item.path}
      onClick={(e) => {
        // Ensure the menu closes
        onClose();
        // Add focus for better accessibility and user feedback
        e.currentTarget.blur();
      }}
      className={({ isActive }) =>
        cn(
          "text-2xl font-bold w-full block text-center py-2 transition-colors",
          isActive ? "text-crimson" : "text-foreground/80 hover:text-foreground"
        )
      }
    >
      {item.label}
    </NavLink>
  </motion.div>
);

export default Header;

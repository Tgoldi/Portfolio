import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Particles from "../ui/particles";

/**
 * Root Layout Component
 * 
 * Main layout wrapper that provides the structure for all pages
 * Includes animated background, header, content area with page transitions, and footer
 */
const RootLayout = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Handle scroll events for header transparency
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Animation variants for background elements
  const backgroundVariants: Variants = {
    initial: { 
      opacity: 0,
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Page transition variants
  const pageVariants: Variants = {
    initial: { 
      opacity: 0,
      y: 15
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -15, 
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header scrolled={scrolled} />
      
      <main className="flex-1 relative">
        {/* Animated background container */}
        <motion.div
          variants={backgroundVariants}
          initial="initial"
          animate="animate"
          className={cn(
            "fixed inset-0 -z-10 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
            "from-crimson/[0.04] via-background to-background"
          )}
          aria-hidden="true"
        >
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 bg-grid-small-white/[0.2] -z-10 dark:bg-grid-small-white/[0.05]" 
            aria-hidden="true"
          />
          
          {/* Particles animation (homepage only) */}
          {isHomePage && (
            <Particles 
              className="absolute inset-0 z-0"
              quantity={80}
              staticity={25}
              ease={60}
            />
          )}
          
          {/* Animated decorative circles */}
          <BackgroundCircles />
          
          {/* Gradient fade-out at bottom */}
          <div 
            className="absolute h-32 w-full bg-gradient-to-b from-background to-transparent bottom-0 left-0 z-10" 
            aria-hidden="true"
          />
        </motion.div>
        
        {/* Page content with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

/**
 * Background Circles Component
 * 
 * Animated decorative circles that add visual interest to the background
 * Extracted as a separate component to improve readability
 */
const BackgroundCircles = memo(() => (
  <>
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full bg-crimson/5 blur-3xl -top-32 -right-32"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.2, 0.3],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      aria-hidden="true"
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full bg-crimson/5 blur-3xl bottom-32 -left-32"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.15, 0.3],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse",
        delay: 2,
      }}
      aria-hidden="true"
    />
  </>
));

BackgroundCircles.displayName = 'BackgroundCircles';

export default RootLayout;

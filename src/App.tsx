/**
 * App.tsx
 * 
 * This is the root component for the Crimson Portfolio Builder application.
 * It sets up global providers and routing while implementing performance optimizations
 * including code-splitting, lazy loading, and preloading of critical assets.
 * 
 * Key features:
 * - Error boundary for graceful error handling
 * - React Query for data fetching and caching
 * - Theme provider with light/dark mode support
 * - SEO optimization with react-helmet-async
 * - Optimized loading strategy with preloading
 * 
 * @author Tomer Goldstein
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { memo, lazy, Suspense, useEffect, useState, createContext, useContext } from "react";
import RootLayout from "./components/layout/RootLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { SEOProvider } from "./providers/SEOProvider";
import LoadingScreen from "./components/LoadingScreen";
import { lazyLoad } from "./lib/utils";

// Lazy load page components for better performance and code splitting
// This reduces initial bundle size and improves First Contentful Paint
const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching when window regains focus
      retry: 1, // Limit retry attempts to reduce unnecessary network requests
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    },
  },
});

// Create a context for accessibility settings
export const AccessibilityContext = createContext<{
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  announce: (message: string, assertive?: boolean) => void;
}>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  announce: () => {},
});

// Create a provider for the accessibility settings
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  
  // Check for high contrast preference
  const [highContrast, setHighContrast] = useState(
    window.matchMedia("(prefers-contrast: more)").matches
  );
  
  // Toggle functions
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  
  // Screen reader announcements
  const announce = (message: string, assertive = false) => {
    const announcer = document.getElementById(
      assertive ? "assertive-announcer" : "polite-announcer"
    );
    
    if (announcer) {
      announcer.textContent = message;
      
      // Clear the announcement after 3 seconds
      setTimeout(() => {
        announcer.textContent = "";
      }, 3000);
    }
  };
  
  return (
    <AccessibilityContext.Provider 
      value={{ 
        reducedMotion, 
        toggleReducedMotion, 
        highContrast, 
        toggleHighContrast,
        announce
      }}
    >
      {/* Screen reader announcement containers */}
      <div 
        id="assertive-announcer" 
        role="alert" 
        aria-live="assertive" 
        className="sr-only"
      ></div>
      <div 
        id="polite-announcer" 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      ></div>
      
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using accessibility settings
export const useAccessibility = () => useContext(AccessibilityContext);

/**
 * Error logging function for production monitoring
 * In a production environment, this would send errors to a monitoring service
 */
const logError = (error: Error) => {
  // In a real app, you would send this to your error tracking service
  // like Sentry, LogRocket, or custom backend endpoint
  console.error("Application error:", error);
  
  // Add error context and user info
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
  
  // Example error logging
  if (process.env.NODE_ENV === 'production') {
    // sendErrorToAnalytics(errorData);
  }
};

/**
 * Main App Component
 * 
 * Sets up the application with providers and routing
 * Implements optimized asset loading strategy
 */
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Add resource hints for critical assets 
  useEffect(() => {
    // Add preconnect for external resources
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
    
    // Preload profile image
    const imagePreload = document.createElement('link');
    imagePreload.rel = 'preload';
    imagePreload.href = '/images/profile.jpg';
    imagePreload.as = 'image';
    document.head.appendChild(imagePreload);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(preconnect);
      document.head.removeChild(imagePreload);
    };
  }, []);

  useEffect(() => {
    // Preload critical assets
    const preloadAssets = async () => {
      try {
        // Preload critical images
        lazyLoad.images([
          '/images/profile.jpg',
          '/tech/react.svg',
          '/tech/javascript.svg',
          '/tech/java.svg'
        ]);
        
        // Initialize lazy loading for remaining images
        lazyLoad.setupNativeLazyLoading();
        
        // Load non-critical resources
        setTimeout(() => {
          lazyLoad.images([
            '/tech/typescript.svg',
            '/tech/spring-boot.svg',
            '/tech/git.svg',
            '/tech/github.svg'
          ], true);
        }, 2000);
        
        // Show content after loading is complete
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error preloading assets:", error);
        setIsLoading(false);
      }
    };
    
    preloadAssets();
  }, []);

  return (
    <ErrorBoundary onError={logError}>
      <QueryClientProvider client={queryClient}>
        <SEOProvider>
          <ThemeProvider defaultTheme="dark">
            <AccessibilityProvider>
              <TooltipProvider>
                <LoadingScreen isLoading={isLoading} />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<LoadingScreen isLoading={true} />}>
                    <Routes>
                      <Route path="/" element={<RootLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/experience" element={<ExperiencePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </SEOProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Memoize the App component to prevent unnecessary re-renders
export default memo(App);

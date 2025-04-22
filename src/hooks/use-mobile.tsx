import { useState, useEffect, useCallback } from "react";

/**
 * Mobile breakpoint in pixels
 * Matches the md breakpoint in Tailwind CSS
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook that detects if the current viewport is mobile-sized
 * 
 * This hook:
 * - Uses CSS media queries for better performance
 * - Properly handles server-side rendering
 * - Returns a stable boolean value
 * - Updates on window resize
 * 
 * @returns {boolean} True if viewport width is below the mobile breakpoint
 * 
 * @example
 * ```tsx
 * const Component = () => {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? <MobileView /> : <DesktopView />}
 *     </div>
 *   );
 * };
 * ```
 */
export function useIsMobile(): boolean {
  // Start with undefined to handle SSR properly
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  // Memoize the handler for better performance
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    // Use matchMedia for better performance
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Set initial value
    handleResize();

    // Modern event listener approach
    const onChange = () => handleResize();
    mediaQuery.addEventListener("change", onChange);
    
    // Clean up the listener on unmount
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [handleResize]);

  // Convert undefined to false for SSR
  // This ensures a stable boolean return value
  return isMobile ?? false;
}

/**
 * Custom hook that detects if the current device is touch-enabled
 * 
 * @returns {boolean} True if the device supports touch events
 * 
 * @example
 * ```tsx
 * const Component = () => {
 *   const isTouchDevice = useIsTouchDevice();
 *   
 *   return (
 *     <div>
 *       {isTouchDevice ? 'Touch enabled' : 'No touch support'}
 *     </div>
 *   );
 * };
 * ```
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for touch capability
    const hasTouch = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - Microsoft-specific property
      navigator.msMaxTouchPoints > 0;
    
    setIsTouch(hasTouch);
  }, []);
  
  return isTouch;
}

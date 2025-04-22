/**
 * use-mobile.ts
 * 
 * A custom React hook for responsively detecting mobile devices
 * with proper resize handling and performance optimizations.
 * 
 * @module hooks/use-mobile
 * @author Tomer Goldstein
 */

import { useState, useEffect } from 'react';
import { debounce } from '@/lib/utils';

/**
 * A hook that detects if the current viewport is mobile-sized
 * 
 * Features:
 * - Responsive breakpoint detection
 * - Debounced resize listener to prevent performance issues
 * - Proper cleanup on unmount
 * 
 * @param breakpoint - Optional breakpoint in pixels (default: 768)
 * @returns Boolean indicating if the viewport is mobile-sized
 * 
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div>
 *     {isMobile ? (
 *       <MobileNavigation />
 *     ) : (
 *       <DesktopNavigation />
 *     )}
 *   </div>
 * );
 * 
 * // With custom breakpoint
 * const isSmallScreen = useIsMobile(640);
 * ```
 */
export const useIsMobile = (breakpoint = 768): boolean => {
    // State to track if viewport is mobile-sized
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Check if window is mobile-sized
        const checkMobile = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth < breakpoint);
        };
        
        // Initial check
        checkMobile();
        
        // Create debounced handler for resize events
        const handleResize = debounce(checkMobile, 200);
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
};

/**
 * Returns common breakpoint values for responsive design
 * 
 * @returns Object with breakpoint values
 * 
 * @example
 * ```tsx
 * const { sm, md, lg, xl, isSmall, isMedium, isLarge, isXLarge } = useBreakpoints();
 * 
 * return (
 *   <div>
 *     {isSmall && <SmallLayout />}
 *     {isMedium && <MediumLayout />}
 *     {isLarge && <LargeLayout />}
 *     {isXLarge && <XLargeLayout />}
 *   </div>
 * );
 * ```
 */
export const useBreakpoints = () => {
    const [windowSize, setWindowSize] = useState<{
        width: number;
        height: number;
    }>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        // Handle resize with debouncing
        const handleResize = debounce(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 200);

        window.addEventListener('resize', handleResize);

        // Initial setup
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Common breakpoints (can be customized based on design system)
    const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    };

    return {
        width: windowSize.width,
        height: windowSize.height,
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        '2xl': breakpoints['2xl'],
        isSmall: windowSize.width < breakpoints.md,
        isMedium: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
        isLarge: windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl,
        isXLarge: windowSize.width >= breakpoints.xl,
        isPortrait: windowSize.height > windowSize.width,
        isLandscape: windowSize.width > windowSize.height,
    };
};

export default useIsMobile; 
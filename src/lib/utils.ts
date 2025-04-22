/**
 * utils.ts
 * 
 * A collection of essential utility functions used throughout the application.
 * This module exports optimized helper functions for common tasks.
 * 
 * @module utils
 * @author Tomer Goldstein
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Add custom type definition for requestIdleCallback
interface Window {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: {timeout: number}
  ) => number;
}

/**
 * Combines multiple class names into a single string
 * Provides proper merging of Tailwind CSS classes
 * 
 * @param inputs - Array of class name values to be merged
 * @returns Merged class names string with proper Tailwind precedence
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a localized format
 * 
 * @param date - Date string or Date object
 * @param locale - Optional locale string (defaults to browser locale)
 * @param options - Optional Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date, 
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options
  };
  
  return dateObj.toLocaleDateString(locale || navigator.language, defaultOptions);
}

/**
 * Truncates a string to a specified maximum length
 * 
 * @param text - String to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - Custom ellipsis string (default: "...")
 * @returns Truncated string with ellipsis if needed
 */
export function truncateText(
  text: string, 
  maxLength: number,
  ellipsis = "..."
): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + ellipsis;
}

/**
 * Scrolls to an element smoothly
 * 
 * @param elementId - ID of the element to scroll to
 * @param options - Optional ScrollIntoViewOptions
 * @returns Promise that resolves when scrolling is complete
 */
export function scrollToElement(
  elementId: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" }
): Promise<void> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Element with id '${elementId}' not found`);
      resolve();
      return;
    }
    
    // If ScrollBehavior API is supported
    if ('scrollBehavior' in document.documentElement.style) {
      element.scrollIntoView(options);
      
      // Approximate scroll completion time based on behavior
      const scrollDuration = options.behavior === 'smooth' ? 500 : 0;
      setTimeout(resolve, scrollDuration);
    } else {
      // Fallback for browsers without smooth scrolling
      element.scrollIntoView(options.block === 'end' ? false : true);
      resolve();
    }
  });
}

/**
 * Checks if the current device is on a slow connection
 * Used to optimize loading strategies based on connection speed
 * 
 * @returns Boolean indicating if the connection is slow
 */
export const isSlowConnection = (): boolean => {
  try {
    // NetworkInformation API is not fully standardized
    // @ts-expect-error - Navigator doesn't have connection property in all TypeScript versions
    const connection = navigator.connection || 
      // @ts-expect-error - Webkit prefixed version
      navigator.mozConnection || 
      // @ts-expect-error - Mozilla prefixed version
      navigator.webkitConnection;
    
    if (!connection) return false;
    
    // Check effective connection type if available
    if ('effectiveType' in connection) {
      const effectiveType = connection.effectiveType as string;
      if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
        return true;
      }
    }
    
    // Check if data saver is enabled
    if ('saveData' in connection && connection.saveData === true) {
      return true;
    }
    
    return false;
  } catch (e) {
    // If any error occurs, assume not on slow connection
    return false;
  }
};

/**
 * Loads a script dynamically with proper timing to avoid blocking
 * 
 * @param src - The source URL of the script
 * @param options - Optional configuration options
 * @returns Promise that resolves when the script is loaded
 */
export const loadScript = (
  src: string, 
  options: {
    defer?: boolean;
    async?: boolean;
    id?: string;
    attributes?: Record<string, string>;
  } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (options.id && document.getElementById(options.id)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    
    // Apply options
    if (options.defer) script.defer = true;
    if (options.async) script.async = true;
    if (options.id) script.id = options.id;
    
    // Apply custom attributes
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
};

/**
 * A utility to manage lazy loading of images and other resources
 */
export const lazyLoad = {
  /**
   * Preloads a batch of images with priority order
   * 
   * @param urls - Array of image URLs to preload
   * @param lowPriority - Whether the images are low priority
   */
  images: (
    urls: string[], 
    lowPriority = false
  ): void => {
    // For slow connections, only preload high priority images
    if (isSlowConnection() && lowPriority) return;
    
    const loadImage = (url: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        // Skip empty URLs
        if (!url) {
          resolve();
          return;
        }
        
        const img = new Image();
        
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve to continue the queue
        img.src = url;
      });
    };
    
    // Load images
    urls.forEach((url, index) => {
      setTimeout(() => {
        loadImage(url).catch(() => {
          console.warn(`Failed to preload image: ${url}`);
        });
      }, index * 100); // 100ms delay between each image
    });
  },
  
  /**
   * Initializes native lazy loading for images when browser enters idle state
   */
  setupNativeLazyLoading: (): void => {
    // Use standard requestIdleCallback with fallback
    const requestIdleCallback = 
      (window.requestIdleCallback || 
      ((cb: IdleRequestCallback) => setTimeout(cb, 1))) as (
        callback: IdleRequestCallback,
        options?: {timeout: number}
      ) => number;
    
    requestIdleCallback(() => {
      // Select all lazy-loaded images
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // Force the browser to evaluate these images during idle time
        if (img.getAttribute('src')) {
          const currentSrc = img.getAttribute('src')!;
          img.setAttribute('src', currentSrc);
        }
      });
      
      // Also set up intersection observer for browsers that don't support loading="lazy"
      if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target as HTMLImageElement;
              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute('data-src');
              }
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
          lazyImageObserver.observe(img);
        });
      }
    }, { timeout: 2000 });
  }
};

/**
 * Debounces a function call
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

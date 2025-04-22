/**
 * Analytics Module
 * 
 * Provides a clean abstraction for tracking user events and interactions
 * Designed to work with multiple analytics providers while maintaining a consistent API
 */

// Supported analytics event types
export type EventType =
    | 'page_view'
    | 'button_click'
    | 'form_submit'
    | 'form_error'
    | 'link_click'
    | 'file_download'
    | 'search'
    | 'video_play'
    | 'video_complete'
    | 'error';

// Event data interface
export interface EventData {
    [key: string]: string | number | boolean | undefined;
}

// Provider interface for implementing different analytics tools
export interface AnalyticsProvider {
    /**
     * Initialize the analytics provider
     */
    init(): void;

    /**
     * Track an event
     * 
     * @param eventType - Type of event to track
     * @param data - Associated event data
     */
    trackEvent(eventType: EventType, data?: EventData): void;

    /**
     * Track a page view
     * 
     * @param path - Page path
     * @param title - Page title
     * @param data - Additional page data
     */
    trackPageView(path: string, title?: string, data?: EventData): void;
}

/**
 * ConsoleDevelopmentProvider
 * Simple provider that logs events to console for development
 */
class ConsoleDevelopmentProvider implements AnalyticsProvider {
    init(): void {
        console.info('Analytics initialized (Development Mode)');
    }

    trackEvent(eventType: EventType, data?: EventData): void {
        console.info(`[Analytics] Event: ${eventType}`, data ?? {});
    }

    trackPageView(path: string, title?: string, data?: EventData): void {
        console.info(`[Analytics] Page View: ${path}`, { title, ...data });
    }
}

// Create singleton instance of analytics service
class AnalyticsService {
    private providers: AnalyticsProvider[] = [];
    private initialized = false;
    private enabled = false;

    // For user consent/privacy
    private consentGiven = false;

    /**
     * Initialize analytics with the provided providers
     * 
     * @param providers - Array of analytics providers to use
     */
    init(providers: AnalyticsProvider[] = []): void {
        if (this.initialized) return;

        // In production, add actual providers
        if (process.env.NODE_ENV === 'production') {
            this.providers = providers;
        } else {
            // In development, just use console logger
            this.providers = [new ConsoleDevelopmentProvider()];
        }

        // Initialize each provider
        this.providers.forEach(provider => provider.init());
        this.initialized = true;

        // Check for user consent from localStorage
        this.checkConsent();

        // Track initial page view
        if (this.enabled && this.consentGiven) {
            this.trackPageView(window.location.pathname);
        }
    }

    /**
     * Track a custom event
     * 
     * @param eventType - Type of event
     * @param data - Associated event data
     */
    trackEvent(eventType: EventType, data?: EventData): void {
        if (!this.canTrack()) return;

        this.providers.forEach(provider => {
            provider.trackEvent(eventType, data);
        });
    }

    /**
     * Track a page view
     * 
     * @param path - Page path
     * @param title - Page title
     * @param data - Additional data
     */
    trackPageView(path: string, title?: string, data?: EventData): void {
        if (!this.canTrack()) return;

        this.providers.forEach(provider => {
            provider.trackPageView(path, title ?? document.title, data);
        });
    }

    /**
     * Set user consent status
     * 
     * @param consent - Whether user has given consent
     */
    setConsent(consent: boolean): void {
        this.consentGiven = consent;

        // Store consent in localStorage
        try {
            localStorage.setItem('analytics_consent', consent ? 'true' : 'false');
        } catch (e) {
            console.error('Failed to store analytics consent', e);
        }
    }

    /**
     * Enable or disable analytics tracking
     * 
     * @param enabled - Whether analytics should be enabled
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Check if analytics can track events
     * (initialized, enabled, and user has given consent)
     */
    private canTrack(): boolean {
        return this.initialized && this.enabled && this.consentGiven;
    }

    /**
     * Check for stored consent
     */
    private checkConsent(): void {
        try {
            const storedConsent = localStorage.getItem('analytics_consent');
            this.consentGiven = storedConsent === 'true';
            this.enabled = true;
        } catch (e) {
            this.consentGiven = false;
            this.enabled = false;
        }
    }
}

// Export a singleton instance
export const analytics = new AnalyticsService();

// For easier imports
export default analytics; 
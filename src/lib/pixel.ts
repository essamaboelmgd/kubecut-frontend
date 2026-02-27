/**
 * Meta Pixel (Facebook Pixel) helper
 * Provides type-safe wrappers for fbq() calls.
 */

// Extend the Window interface to include fbq
declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
    }
}

/**
 * Track a standard Meta Pixel event
 */
export function trackPixelEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.fbq) {
        if (params) {
            window.fbq('track', eventName, params);
        } else {
            window.fbq('track', eventName);
        }
    }
}

/**
 * Track a custom Meta Pixel event
 */
export function trackCustomPixelEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.fbq) {
        if (params) {
            window.fbq('trackCustom', eventName, params);
        } else {
            window.fbq('trackCustom', eventName);
        }
    }
}

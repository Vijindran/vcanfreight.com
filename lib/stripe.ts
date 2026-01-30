import Stripe from 'stripe';
import type { CloudflareEnv } from './cloudflare';

/**
 * Get Stripe instance lazily to avoid build-time errors
 * when environment variables are not yet available.
 */
export function getStripeInstance(env?: CloudflareEnv) {
    const processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {} as any;
    const secretKey = env?.STRIPE_SECRET_KEY || processEnv.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
        // Return a proxy or a placeholder during build time
        // to prevent the build process from crashing
        if (processEnv.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn('STRIPE_SECRET_KEY is not defined in environment variables.');
        }
        
        // Return a dummy instance for build-time analysis if key is missing
        return new Stripe('sk_test_placeholder', {
            apiVersion: '2025-11-17.clover' as any,
        });
    }

    return new Stripe(secretKey, {
        apiVersion: '2025-11-17.clover' as any,
    });
}

// Keep the constant for backward compatibility but initialize it safely
export const stripe = getStripeInstance();

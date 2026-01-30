'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isGuest: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    loginAsGuest: () => void;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get API base URL
function getApiUrl() {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

// Helper to get token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
}

// Helper to set token in localStorage
function setToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
}

// Helper to remove token from localStorage
function removeToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
}

// Helper to set guest mode
function setGuestMode(isGuest: boolean) {
    if (typeof window !== 'undefined') {
        if (isGuest) {
            localStorage.setItem('is_guest', 'true');
        } else {
            localStorage.removeItem('is_guest');
        }
    }
}

// Helper to get guest mode
function getGuestMode(): boolean {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('is_guest') === 'true';
    }
    return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const authChecked = React.useRef(false);
    const mountCount = React.useRef(0);

    // Check for existing auth on mount
    useEffect(() => {
        mountCount.current++;
        let token = getToken();
        
        console.log('[Auth] Auth check effect running', {
            hasToken: !!token,
            isGuest: getGuestMode(),
            mountCount: mountCount.current,
        });
        
        if (authChecked.current) {
            return;
        }
        authChecked.current = true;
        
        // Check for token in URL (from OAuth callback)
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token');
            if (urlToken) {
                setToken(urlToken);
                // Remove token from URL
                window.history.replaceState({}, '', window.location.pathname);
            }
        }

        // Check for guest mode
        const guestMode = getGuestMode();
        if (guestMode) {
            setIsGuest(true);
            setUser({
                id: 'guest',
                name: 'Guest User',
                email: '',
            });
            setIsLoading(false);
            return;
        }

        token = getToken();
        if (token) {
            // Verify token and get user info
            fetch(`${getApiUrl()}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(async (res) => {
                    console.log('[Auth] Auth API response:', { status: res.status, ok: res.ok });
                    
                    if (!res.ok) {
                        console.error('[Auth] Auth check failed:', { status: res.status, statusText: res.statusText });
                        throw new Error(`Auth failed with status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data: any) => {
                    if (data.user) {
                        setUser(data.user);
                        setIsGuest(false);
                    } else {
                        removeToken();
                    }
                })
                .catch((err) => {
                    console.warn('Session expired or invalid:', err.message);
                    removeToken();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        console.log('[Auth] Login initiated:', { email });
        try {
            const response = await fetch(`${getApiUrl()}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json() as any;
            console.log('[Auth] Login response:', { status: response.status, hasUser: !!data.user });

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setToken(data.token);
            setUser(data.user);
            setIsGuest(false);
            setGuestMode(false);
            router.push('/booking');
        } catch (error: any) {
            console.error("Login Failed:", error);
            alert("Login Failed. " + (error.message || 'Please check your credentials.'));
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            // Redirect to Google OAuth
            const response = await fetch(`${getApiUrl()}/api/auth/google`, {
                method: 'GET',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({})) as any;
                if (response.status === 503 || data.code === 'OAUTH_NOT_CONFIGURED') {
                    alert("Google Sign-In is not configured. Please use email/password login or continue as guest.");
                    return;
                }
                throw new Error(data.error || `Google Sign-In failed with status: ${response.status}`);
            }

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json() as any;
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Google Sign-In unavailable');
                }
            }
        } catch (error: any) {
            console.error("Google Login Failed:", error);
            alert("Google Sign-In is currently unavailable. " + (error.message || 'Please use another method.'));
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${getApiUrl()}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json() as any;

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setToken(data.token);
            setUser(data.user);
            setIsGuest(false);
            setGuestMode(false);
            router.push('/booking');
        } catch (error: any) {
            console.error("Registration Failed:", error);
            alert("Registration Failed. " + (error.message || 'Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsGuest = () => {
        console.log('[Auth] Login as guest');
        setGuestMode(true);
        setIsGuest(true);
        setUser({
            id: 'guest',
            name: 'Guest User',
            email: '',
        });
        router.push('/booking');
    };

    const logout = async () => {
        try {
            removeToken();
            setGuestMode(false);
            setUser(null);
            setIsGuest(false);
            router.push('/auth/login');
        } catch (error) {
            console.error("Logout Failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, login, register, loginAsGuest, loginWithGoogle, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

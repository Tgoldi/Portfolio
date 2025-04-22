import { FC, ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface SEOProviderProps {
    children: ReactNode;
}

/**
 * SEO Provider Component
 * 
 * Wraps the application in a HelmetProvider to enable SEO features
 * Used in conjunction with the SEO component
 */
export const SEOProvider: FC<SEOProviderProps> = ({ children }) => {
    return (
        <HelmetProvider>
            {children}
        </HelmetProvider>
    );
}; 
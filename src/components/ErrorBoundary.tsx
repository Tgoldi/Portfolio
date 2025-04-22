import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

/**
 * ErrorBoundary Props Interface
 */
interface ErrorBoundaryProps {
    /**
     * Content to render when no error occurs
     */
    children: ReactNode;

    /**
     * Optional custom fallback component to render when an error occurs
     * If not provided, the default error UI will be used
     */
    fallback?: ReactNode;

    /**
     * Optional callback function that is called when an error is caught
     */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;

    /**
     * Optional role for the error boundary container
     * Defaults to "alert" for accessibility
     */
    role?: string;
}

/**
 * ErrorBoundary State Interface
 */
interface ErrorBoundaryState {
    /**
     * Whether an error has been caught
     */
    hasError: boolean;

    /**
     * The caught error object, if any
     */
    error: Error | null;

    /**
     * Component stack trace information about the error
     */
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * A class component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the application.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => logErrorToService(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    /**
     * Initial state with no error
     */
    state: ErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    /**
     * Static method called during render phase
     * Used to derive state from an error that was caught
     */
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called after an error has been thrown
     * Used for side effects like logging the error
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to the console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Update state with error info for rendering
        this.setState({ errorInfo });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    /**
     * Reset the error boundary state
     * Can be called to retry rendering the component tree
     */
    resetErrorBoundary = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        const { children, fallback, role = 'alert' } = this.props;
        const { hasError, error, errorInfo } = this.state;

        // If there's no error, render children normally
        if (!hasError) {
            return children;
        }

        // If a custom fallback is provided, use it
        if (fallback) {
            return fallback;
        }

        // Default error UI
        return (
            <div role={role} className="p-4 my-8 w-full max-w-3xl mx-auto">
                <Card className="border-destructive/50">
                    <CardHeader className="bg-destructive/10">
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-6 w-6"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Something went wrong
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <div className="text-muted-foreground mb-4">
                            <p>An error occurred in the application.</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-md text-sm font-mono overflow-auto max-h-40 mb-4">
                            <p className="text-destructive">{error?.toString()}</p>
                            {errorInfo && (
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                        Component Stack Trace
                                    </summary>
                                    <pre className="mt-2 whitespace-pre-wrap text-xs">
                                        {errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-card/50">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                        <Button
                            onClick={this.resetErrorBoundary}
                        >
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default ErrorBoundary; 
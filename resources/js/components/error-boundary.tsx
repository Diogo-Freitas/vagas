import { AlertTriangle, RefreshCcw, RotateCcw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
    children: ReactNode;
};

type State = {
    error: Error | null;
};

/**
 * Catches uncaught rendering errors so a single component failure never
 * leaves the whole interface blank (the "black screen").
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = {
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('An uncaught error was caught by the error boundary:', {
            error,
            errorInfo,
        });
    }

    private readonly handleRetry = (): void => {
        this.setState({ error: null });
    };

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="size-6" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-base font-medium">
                            Something went wrong
                        </h2>
                        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                            An unexpected error occurred while rendering this
                            page. Your chats and messages are safe — you can try
                            again or reload the page.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCcw /> Reload page
                        </Button>

                        <Button onClick={this.handleRetry}>
                            <RotateCcw /> Try again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

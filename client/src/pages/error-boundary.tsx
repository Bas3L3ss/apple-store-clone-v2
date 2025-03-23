import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
          <div className="max-w-md w-full rounded-xl p-8">
            <div className="flex justify-center mb-6">
              {/* Apple-style warning icon */}
              <svg
                className="w-16 h-16 text-red-500"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 12C20.96 12 12 20.96 12 32C12 43.04 20.96 52 32 52C43.04 52 52 43.04 52 32C52 20.96 43.04 12 32 12Z"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M32 22V36"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="32" cy="42" r="2" fill="currentColor" />
              </svg>
            </div>

            <h1 className="text-2xl font-medium text-gray-900 mb-2 text-center">
              Something went wrong
            </h1>

            <p className="text-gray-500 mb-8 text-center text-sm leading-relaxed">
              We've encountered an unexpected error. Please try refreshing the
              page or returning to the home screen.
            </p>

            {this.state.error && (
              <div className="bg-gray-50 p-5 rounded-lg mb-8 overflow-auto max-h-32 font-mono text-xs text-gray-600">
                {this.state.error?.toString()}
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>

              <Link
                to="/"
                className="w-full py-3 px-4 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Go to Home Screen
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

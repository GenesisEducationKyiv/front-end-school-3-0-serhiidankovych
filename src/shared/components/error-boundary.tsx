"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  description?: string;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  description = "An unexpected error occurred",
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 text-center">{description}</p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  title?: string;
  description?: string;
}

export function ErrorBoundary({
  children,
  fallback: FallbackComponent = ErrorFallback,
  title,
  description,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <FallbackComponent {...props} title={title} description={description} />
      )}
      onError={(error, errorInfo) => {
        console.error("Error boundary caught an error:", error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

import React from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Show toast notification
    toast.error(
      "حدث خطأ غير متوقع. يرجى تحديث الصفحة أو الاتصال بالدعم الفني.",
      { autoClose: 10000 }
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-grayLight dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-grayTextDark dark:text-white mb-2">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-grayTextLight dark:text-gray-400 mb-6">
              نعتذر عن الإزعاج. يرجى تحديث الصفحة أو الاتصال بالدعم الفني.
            </p>
            
            {this.state.error && (
              <details className="text-left mb-4 p-3 bg-grayLight dark:bg-gray-700 rounded text-xs text-grayTextDark dark:text-gray-300">
                <summary className="cursor-pointer font-semibold mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-grayMedium text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                تحديث الصفحة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


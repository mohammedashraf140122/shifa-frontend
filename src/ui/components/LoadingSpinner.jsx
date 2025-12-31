/**
 * Reusable Loading Spinner Component
 * Used across the application for consistent loading states
 */

export default function LoadingSpinner({ 
  size = "md", 
  text = "جاري التحميل...",
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-grayMedium border-t-primary ${sizeClasses[size]}`}
      />
      {text && (
        <p className="mt-3 text-sm text-grayTextLight dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grayLight dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
}






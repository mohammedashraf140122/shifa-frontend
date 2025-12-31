import LoadingSpinner from "./LoadingSpinner";

/**
 * Page Loader Component
 * Used in Suspense boundaries for lazy-loaded routes
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grayLight dark:bg-gray-900">
      <LoadingSpinner size="lg" text="جاري التحميل..." />
    </div>
  );
}






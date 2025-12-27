import { useAlerts } from "./alerts.store";

export default function HeaderNotifications() {
  const { alerts, toggleAlert } = useAlerts();

  // نعرض بس الـ alerts الشغالة
  const activeAlerts = alerts.filter((a) => a.active);

  return (
    <div
      className="absolute right-0 mt-2 w-80
      bg-white dark:bg-gray-800
      border border-grayMedium dark:border-gray-700
      rounded-xl shadow-xl
      z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-grayMedium dark:border-gray-700">
        <p className="text-sm font-semibold text-grayText dark:text-gray-200">
          Notifications
        </p>
      </div>

      {/* Content */}
      {activeAlerts.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-gray-400">
          No notifications
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="px-4 py-3
              border-b last:border-b-0
              border-grayMedium dark:border-gray-700
              hover:bg-grayLight dark:hover:bg-gray-700
              transition"
            >
              <p className="text-sm font-medium text-grayText dark:text-gray-200">
                {alert.title}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {alert.message}
              </p>

              <button
                onClick={() => toggleAlert(alert.id)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Mark as read
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

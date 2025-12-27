import { useAlerts } from "./alerts.store";

export default function AlertsList() {
  const { alerts, toggleAlert, deleteAlert } = useAlerts();

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Alerts & Notifications</h1>
          <p className="text-sm text-gray-500">
            Manage and create alerts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-500">{a.message}</p>
              <p className="text-xs mt-1 text-gray-400">
                {a.active ? "Active" : "Stopped"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleAlert(a.id)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                {a.active ? "Stop" : "Resume"}
              </button>
              <button
                onClick={() => deleteAlert(a.id)}
                className="px-4 py-2 border rounded-lg text-sm text-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

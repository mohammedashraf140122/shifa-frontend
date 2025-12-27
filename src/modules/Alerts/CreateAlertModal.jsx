import { useState } from "react";
import { useAlerts } from "./alerts.store";

export default function CreateAlertModal({ onClose, editingAlert }) {
  const { addAlert, updateAlert } = useAlerts();

  const [title, setTitle] = useState(editingAlert?.title || "");
  const [message, setMessage] = useState(editingAlert?.message || "");
  const [unit, setUnit] = useState(editingAlert?.unit || "minutes");
  const [value, setValue] = useState(editingAlert?.value || 1);
  const [target, setTarget] = useState(editingAlert?.target || "all");

  const limits = { minutes: 60, hours: 24, days: 31 };

  const handleSubmit = () => {
    const durationMs =
      unit === "minutes"
        ? value * 60 * 1000
        : unit === "hours"
        ? value * 60 * 60 * 1000
        : value * 24 * 60 * 60 * 1000;

    const alertData = {
      id: editingAlert?.id || Date.now(),
      title,
      message,
      unit,
      value,
      target,
      active: true,
      expiresAt: Date.now() + durationMs,
    };

    editingAlert ? updateAlert(alertData) : addAlert(alertData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingAlert ? "Edit Alert" : "Create New Alert"}
        </h2>

        <input
          className="input w-full mb-3"
          placeholder="Alert title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea w-full mb-4"
          placeholder="Alert message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Target */}
        <p className="text-sm font-medium mb-2">Show alert to</p>
        <div className="flex gap-2 mb-4">
          {["all", "roles", "users"].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-4 py-2 rounded-lg border text-sm
                ${
                  target === t
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300"
                }`}
            >
              {t === "all"
                ? "All Users"
                : t === "roles"
                ? "By Role"
                : "Specific Users"}
            </button>
          ))}
        </div>

        {/* Duration */}
        <p className="text-sm font-medium mb-2">Visibility Duration</p>
        <div className="flex gap-2 mb-3">
          {["minutes", "hours", "days"].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-2 rounded-lg border text-sm
                ${
                  unit === u
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300"
                }`}
            >
              {u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="number"
          min={1}
          max={limits[unit]}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="input w-full"
        />

        <p className="text-xs text-gray-400 mt-1">
          Max {limits[unit]} {unit}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {editingAlert ? "Update Alert" : "Create Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}

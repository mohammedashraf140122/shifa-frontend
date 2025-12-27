import { useState } from "react";
import { useAlerts } from "./alerts.store";

export default function CreateAlert() {
  const { createAlert } = useAlerts();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(86400000); // 24h

  // Targeting
  const [targetType, setTargetType] = useState("all"); // all | role | user
  const [targetValue, setTargetValue] = useState("");

  const handleCreate = () => {
    if (!title || !message) return;

    createAlert({
      title,
      message,
      duration,
      targetType,
      targetValue,
    });

    // reset
    setTitle("");
    setMessage("");
    setDuration(86400000);
    setTargetType("all");
    setTargetValue("");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow max-w-xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Create Alert
        </h1>
        <p className="text-sm text-gray-500">
          Create alert and control who can see it
        </p>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="System Maintenance"
        />
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Message</label>
        <textarea
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="The system will be unavailable tonight"
        />
      </div>

      {/* Target */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Target</label>
        <select
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="role">By Role</option>
          <option value="user">Specific User</option>
        </select>
      </div>

      {targetType === "role" && (
        <div className="mb-4">
          <label className="block text-sm mb-1">Role Name</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Admin"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />
        </div>
      )}

      {targetType === "user" && (
        <div className="mb-4">
          <label className="block text-sm mb-1">User ID</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="1"
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
          />
        </div>
      )}

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Duration</label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDuration(86400000)}
            className={`px-4 py-2 text-sm rounded-md border ${
              duration === 86400000
                ? "bg-primary text-white border-primary"
                : ""
            }`}
          >
            24 Hours
          </button>

          <button
            onClick={() => setDuration(172800000)}
            className={`px-4 py-2 text-sm rounded-md border ${
              duration === 172800000
                ? "bg-primary text-white border-primary"
                : ""
            }`}
          >
            48 Hours
          </button>

          <button
            onClick={() => setDuration(604800000)}
            className={`px-4 py-2 text-sm rounded-md border ${
              duration === 604800000
                ? "bg-primary text-white border-primary"
                : ""
            }`}
          >
            1 Week
          </button>
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primaryDark text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          Create Alert
        </button>
      </div>
    </div>
  );
}

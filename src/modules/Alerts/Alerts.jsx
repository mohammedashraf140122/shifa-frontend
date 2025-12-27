import { useState } from "react";
import { useAlerts } from "./alerts.store";
import CreateAlertModal from "./CreateAlertModal";
import {
  IoPauseOutline,
  IoPlayOutline,
  IoTrashOutline,
  IoCreateOutline,
} from "react-icons/io5";

export default function Alerts() {
  const { alerts, toggleAlert, deleteAlert } = useAlerts();
  const [open, setOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
          <p className="text-sm text-gray-500">
            Manage and create alerts
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setEditingAlert(null);
            setOpen(true);
          }}
        >
          + Create New Alert
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
          <div className="col-span-3">Title</div>
          <div className="col-span-5">Message</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {alerts.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No alerts created
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-12 items-center px-4 py-4
              border-t border-gray-200 text-sm"
            >
              <div className="col-span-3 font-medium">
                {alert.title}
              </div>

              <div className="col-span-5 text-gray-500 truncate">
                {alert.message}
              </div>

              <div className="col-span-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs
                  ${
                    alert.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {alert.active ? "Active" : "Stopped"}
                </span>
              </div>

              <div className="col-span-2 flex justify-end gap-3">
                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingAlert(alert);
                    setOpen(true);
                  }}
                  className="text-gray-500 hover:text-primary"
                >
                  <IoCreateOutline size={18} />
                </button>

                {/* Stop / Resume */}
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="text-gray-500 hover:text-primary"
                >
                  {alert.active ? (
                    <IoPauseOutline size={18} />
                  ) : (
                    <IoPlayOutline size={18} />
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-gray-500 hover:text-danger"
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <CreateAlertModal
          editingAlert={editingAlert}
          onClose={() => {
            setOpen(false);
            setEditingAlert(null);
          }}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useAlerts } from "./alerts.store";
import CreateAlertModal from "./CreateAlertModal";
import {
  IoPauseOutline,
  IoPlayOutline,
  IoTrashOutline,
  IoCreateOutline,
} from "react-icons/io5";
import useRBAC from "../../hooks/useRBAC";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Alerts() {
  const { alerts, toggleAlert, deleteAlert } = useAlerts();
  const [open, setOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const { loading: authLoading } = useAuth();

  // RBAC permissions
  const rbac = useRBAC("Alerts", "Alerts");

  // Loading state
  if (authLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
        <p className="text-sm text-gray-500">Loading permissions...</p>
      </div>
    );
  }

  // Permission guard - check if user has Read permission
  if (!rbac.canRead) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          You don't have permission to view this page
        </p>
      </div>
    );
  }

  // Handler for opening modal (Create or Edit)
  const handleOpenModal = (alert = null) => {
    if (alert) {
      // Editing existing alert
      if (!rbac.canPerformEdit) {
        toast.error("You don't have permission to edit alerts");
        return;
      }
    } else {
      // Creating new alert
      if (!rbac.canPerformCreate) {
        toast.error("You don't have permission to create alerts");
        return;
      }
    }
    setEditingAlert(alert);
    setOpen(true);
  };

  // Handler for toggle alert
  const handleToggleAlert = (id) => {
    if (!rbac.canPerformEdit) {
      toast.error("You don't have permission to toggle alerts");
      return;
    }
    toggleAlert(id);
  };

  // Handler for delete alert
  const handleDeleteAlert = (id) => {
    if (!rbac.canPerformDelete) {
      toast.error("You don't have permission to delete alerts");
      return;
    }
    deleteAlert(id);
  };

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

        {rbac.showCreateButton && (
          <button
            className={`btn-primary ${!rbac.canPerformCreate ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleOpenModal(null)}
            disabled={!rbac.canPerformCreate}
          >
            + Create New Alert
          </button>
        )}
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
                {rbac.showEditButton && (
                  <button
                    onClick={() => handleOpenModal(alert)}
                    disabled={!rbac.canPerformEdit}
                    className={`${
                      rbac.canPerformEdit
                        ? "text-gray-500 hover:text-primary cursor-pointer"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                    }`}
                    title={rbac.canPerformEdit ? "Edit" : "No permission to edit"}
                  >
                    <IoCreateOutline size={18} />
                  </button>
                )}

                {/* Stop / Resume */}
                {rbac.showEditButton && (
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    disabled={!rbac.canPerformEdit}
                    className={`${
                      rbac.canPerformEdit
                        ? "text-gray-500 hover:text-primary cursor-pointer"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                    }`}
                    title={rbac.canPerformEdit ? (alert.active ? "Pause" : "Resume") : "No permission to toggle"}
                  >
                    {alert.active ? (
                      <IoPauseOutline size={18} />
                    ) : (
                      <IoPlayOutline size={18} />
                    )}
                  </button>
                )}

                {/* Delete */}
                {rbac.showDeleteButton && (
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={!rbac.canPerformDelete}
                    className={`${
                      rbac.canPerformDelete
                        ? "text-gray-500 hover:text-danger cursor-pointer"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                    }`}
                    title={rbac.canPerformDelete ? "Delete" : "No permission to delete"}
                  >
                    <IoTrashOutline size={18} />
                  </button>
                )}
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

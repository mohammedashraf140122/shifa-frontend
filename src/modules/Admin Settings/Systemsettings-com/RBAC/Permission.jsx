import { useEffect, useState } from "react";
import { IoCheckmarkDone, IoClose, IoTrashOutline } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  getPermissions,
  addPermissions,
  updatePermissions,
  deletePermissions,
} from "../../../../core/api/axios";
import { toast } from "react-toastify";
import { devError } from "../../../../core/utils/devLog";
import { useQueryClient } from "@tanstack/react-query";
import useRBAC from "../../../../hooks/useRBAC";
import { useAuth } from "../../../../context/AuthContext";

const PERMISSIONS_QUERY_KEY = ["permissions"];

export default function AccessName() {
  const queryClient = useQueryClient();
  const [accessList, setAccessList] = useState([]);
  const { loading: authLoading } = useAuth();

  // RBAC permissions
  const rbac = useRBAC("Admin Settings", "Permissions");

  const t = {
    title: "Access Types",
    desc: "Create custom access names.",
    add: "Add Access",
    access: "Access Name",
    placeholder: "Enter access name (e.g. View, Edit, Admin)",
  };

  /* ======================
     GET
  ====================== */
  useEffect(() => {
    // Only fetch if user has Read permission
    if (!authLoading && rbac.canRead) {
      fetchPermissions();
    }
  }, [authLoading, rbac.canRead]);

  const fetchPermissions = async () => {
    // Permission guard
    if (!rbac.canRead) {
      toast.error("You don't have permission to view permissions");
      return;
    }
    
    try {
      const res = await getPermissions();

      const formatted = res.data.Permissions.map(p => ({
        id: p.PermissionID,
        name: p.PermissionName,
        tempName: "",
        editing: false,
        isNew: false,
      }));

      setAccessList(formatted);
    } catch (err) {
      devError("Load permissions failed", err);
      toast.error("Failed to load permissions");
    }
  };

  /* ======================
     ADD (UI)
  ====================== */
  const addAccess = () => {
    // Permission guard
    if (!rbac.canPerformCreate) {
      toast.error("You don't have permission to add access type");
      return;
    }
    
    setAccessList(prev => [
      ...prev,
      {
        id: Date.now(), // مؤقت
        name: "",
        tempName: "",
        editing: true,
        isNew: true,
      },
    ]);
  };

  /* ======================
     EDIT
  ====================== */
  const startEdit = id => {
    // Permission guard
    if (!rbac.canPerformEdit) {
      toast.error("You don't have permission to edit access type");
      return;
    }
    
    setAccessList(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, editing: true, tempName: a.name }
          : a
      )
    );
  };

  const updateName = (id, value) => {
    setAccessList(prev =>
      prev.map(a =>
        a.id === id ? { ...a, tempName: value } : a
      )
    );
  };

  /* ======================
     SAVE
  ====================== */
  const saveAccess = async (id) => {
    const access = accessList.find(a => a.id === id);
    if (!access) return;

    // Permission guards
    if (access.isNew && !rbac.canPerformCreate) {
      toast.error("You don't have permission to add access type");
      return;
    }
    if (!access.isNew && !rbac.canPerformEdit) {
      toast.error("You don't have permission to edit access type");
      return;
    }

    try {
      // 🟢 ADD
      if (access.isNew) {
        const res = await addPermissions([
          { PermissionName: access.tempName },
        ]);

        const created = res.data.addedPermissions?.[0];

        setAccessList(prev =>
          prev.map(a =>
            a.id === id
              ? {
                  ...a,
                  id: created.PermissionID,
                  name: created.PermissionName,
                  editing: false,
                  isNew: false,
                }
              : a
          )
        );

        toast.success("Permission added successfully");
        
        // Invalidate permissions query cache to refresh in Add Role Modal
        queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      }
      // 🔵 UPDATE
      else {
        await updatePermissions([
          {
            PermissionID: access.id,
            NewName: access.tempName,
          },
        ]);

        setAccessList(prev =>
          prev.map(a =>
            a.id === id
              ? {
                  ...a,
                  name: access.tempName,
                  editing: false,
                }
              : a
          )
        );

        toast.success("Permission updated successfully");
        
        // Invalidate permissions query cache to refresh in Add Role Modal
        queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to save permission";

      toast.error(msg);
    }
  };

  /* ======================
     DELETE (TOAST CONFIRM)
  ====================== */
  const deleteAccess = (id) => {
    // Permission guard
    if (!rbac.canPerformDelete) {
      toast.error("You don't have permission to delete access type");
      return;
    }
    
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm">
            Are you sure you want to delete this permission?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                closeToast();

                // Double check permission before executing
                if (!rbac.canPerformDelete) {
                  toast.error("You don't have permission to delete access type");
                  return;
                }

                try {
                  await deletePermissions([id]);

                  setAccessList(prev =>
                    prev.filter(a => a.id !== id)
                  );

                  toast.success("Permission deleted successfully");
                  
                  // Invalidate permissions query cache to refresh in Add Role Modal
                  queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
                } catch (err) {
                  const msg =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "Failed to delete permission";

                  toast.error(msg);
                }
              }}
              className="px-3 py-1 text-xs rounded bg-red-500 text-white"
            >
              Delete
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  /* ======================
     CANCEL
  ====================== */
  const cancelEdit = id => {
    setAccessList(prev =>
      prev
        .filter(a => !(a.id === id && a.isNew))
        .map(a =>
          a.id === id
            ? {
                ...a,
                editing: false,
                tempName: a.name,
              }
            : a
        )
    );
  };

  /* ======================
     UI
  ====================== */
  
  // Loading state
  if (authLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-500">Loading permissions...</p>
      </div>
    );
  }

  // Permission guard - check if user has Read permission
  if (!rbac.canRead) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-500">
          You don't have permission to view this page
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-500">{t.desc}</p>
        </div>

        {rbac.showCreateButton && (
          <button
            onClick={addAccess}
            disabled={!rbac.canPerformCreate}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              rbac.canPerformCreate
                ? "bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {t.add}
          </button>
        )}
      </div>
 <div className="overflow-hidden rounded-lg border border-grayMedium">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-grayMedium">
            {accessList.map(a => {
              const canSave = a.tempName.trim() !== "";

              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {a.editing ? (
                      <input
                        placeholder={t.placeholder}
                        value={a.tempName}
                        onChange={e =>
                          updateName(a.id, e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <span className="font-medium">{a.name}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {a.editing ? (
                      <>
                        <button
                          disabled={!canSave}
                          onClick={() => saveAccess(a.id)}
                          className={
                            canSave
                              ? "text-emerald-500"
                              : "text-gray-300 cursor-not-allowed"
                          }
                        >
                          <IoCheckmarkDone className="text-xl" />
                        </button>

                        <button
                          onClick={() => cancelEdit(a.id)}
                          className="text-red-500"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </>
                    ) : (
                      <>
                        {rbac.showEditButton && (
                          <button
                            onClick={() => startEdit(a.id)}
                            disabled={!rbac.canPerformEdit}
                            className={`${
                              rbac.canPerformEdit
                                ? "text-emerald-500 hover:text-emerald-600 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed opacity-50"
                            }`}
                            title={rbac.canPerformEdit ? "Edit" : "No permission to edit"}
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>
                        )}

                        {rbac.showDeleteButton && (
                          <button
                            onClick={() => deleteAccess(a.id)}
                            disabled={!rbac.canPerformDelete}
                            className={`${
                              rbac.canPerformDelete
                                ? "text-red-500 hover:text-red-600 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed opacity-50"
                            }`}
                            title={rbac.canPerformDelete ? "Delete" : "No permission to delete"}
                          >
                            <IoTrashOutline className="text-lg" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

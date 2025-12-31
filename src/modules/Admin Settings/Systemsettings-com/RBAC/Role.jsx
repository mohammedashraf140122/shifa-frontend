import { useMemo, useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineCog6Tooth,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  deleteRoles,
} from "../../../../core/api/axios";
import useRBAC from "../../../../hooks/useRBAC";

import AddRoleModal from "./AddRoleModal/AddRoleModal";

// Query keys
const ROLES_QUERY_KEY = ["roles"];

export default function Role() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Permissions - Using unified RBAC hook
  const rbac = useRBAC("Admin Settings", "Roles");

  // Fetch roles using React Query
  const {
    data: rolesData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async () => {
      const res = await getRoles();
      const list = res?.data?.Roles || [];
      return list.map(r => ({
        id: r.RoleID,
        name: r.RoleName,
        createdAt: r.CreateDate,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error toast
  useEffect(() => {
    if (error) {
      const status = error?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = error?.response?.data?.message || "Service is temporarily unavailable. Please try again later.";
      } else if (status === 500) {
        msg = error?.response?.data?.message || "Server error. Please try again later.";
      } else {
        msg = error?.response?.data?.message || error?.message || "Failed to load roles";
      }
      
      toast.error(msg);
    }
  }, [error]);

  const roles = rolesData || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (roleId) => deleteRoles([roleId]),
    onSuccess: () => {
      toast.success("Role deleted successfully");
      // Invalidate and refetch roles
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to delete role";
      toast.error(msg);
    },
  });

  // Filtered roles
  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;

    return roles.filter(r =>
      r.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  // Delete handler
  const confirmDeleteRole = (role) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm">
            Are you sure you want to delete this role?
            <br />
            <strong>{role.name}</strong>
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                closeToast();
                deleteMutation.mutate(role.id);
              }}
              className="px-3 py-1 text-xs rounded bg-danger text-white"
            >
              Delete
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-200"
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

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl border">
        ⏳ Loading roles...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl border border-danger">
        <p className="text-danger">Failed to load roles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Role Management</h2>
          <p className="text-sm text-grayTextLight">
            Manage system roles
          </p>
        </div>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <HiOutlineMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search role..."
              className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300
              focus:outline-none focus:border-primary"
            />
          </div>

          {/* ADD */}
          {rbac.showCreateButton && (
            <button
              onClick={() => {
                if (rbac.canPerformCreate) {
                  setSelectedRole(null);
                  setOpenModal(true);
                }
              }}
              disabled={!rbac.canPerformCreate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                rbac.canPerformCreate
                  ? "bg-primary text-white hover:bg-primaryDark cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              <HiOutlinePlus />
              Add Role
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      {filteredRoles.length === 0 ? (
        <div className="text-center text-grayTextLight py-10">
          No roles found
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-grayLight">
              <tr>
                <th className="px-5 py-3 text-left font-medium">
                  Role Name
                </th>
                <th className="px-5 py-3 text-left font-medium">
                  Created
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-grayMedium">
              {filteredRoles.map(role => (
                <tr
                  key={role.id}
                  className="hover:bg-grayLight/50 transition"
                >
                  <td className="px-5 py-3">
                    {role.name}
                  </td>

                  <td className="px-5 py-3">
                    {role.createdAt
                      ? new Date(role.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      {/* EDIT */}
                      {rbac.showEditButton && (
                        <button
                          onClick={() => {
                            if (rbac.canPerformEdit) {
                              setSelectedRole(role);
                              setOpenModal(true);
                            }
                          }}
                          disabled={!rbac.canPerformEdit}
                          className={`${
                            rbac.canPerformEdit
                              ? "text-indigo-600 hover:text-indigo-800 cursor-pointer"
                              : "text-gray-300 cursor-not-allowed opacity-50"
                          }`}
                          title={rbac.canPerformEdit ? "Edit Role" : "No permission to edit"}
                        >
                          <HiOutlineCog6Tooth className="text-lg" />
                        </button>
                      )}

                      {/* DELETE */}
                      {rbac.showDeleteButton && (
                        <button
                          onClick={() => {
                            if (rbac.canPerformDelete) {
                              confirmDeleteRole(role);
                            }
                          }}
                          disabled={!rbac.canPerformDelete || deleteMutation.isPending}
                          className={`${
                            rbac.canPerformDelete
                              ? "text-danger hover:text-dangerDark cursor-pointer"
                              : "text-gray-300 cursor-not-allowed opacity-50"
                          }`}
                          title={rbac.canPerformDelete ? "Delete Role" : "No permission to delete"}
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {openModal && (
        <AddRoleModal
          open={openModal}
          role={selectedRole}
          onClose={() => {
            setOpenModal(false);
            setSelectedRole(null);
            // Invalidate and refetch roles
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
          }}
        />
      )}
    </div>
  );
}

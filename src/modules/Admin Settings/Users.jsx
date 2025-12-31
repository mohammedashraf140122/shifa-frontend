import { useEffect, useState, useMemo } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineKey,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-toastify";

import {
  getUsers,
  addUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../core/api/axios";

import AddUserModal from "./Systemsettings-com/User/AddUserModal";
import UpdatePasswordModal from "./Systemsettings-com/User/UpdatePasswordModal";
import AssignRolesModal from "./Systemsettings-com/User/RolesAssignModal";
import useRBAC from "../../hooks/useRBAC";
import { useAuth } from "../../context/AuthContext";
import ActionButtons from "../../components/RBAC/ActionButtons";

export default function Users() {
  const { loading } = useAuth();
  
  // Permissions - Using unified RBAC hook
  const rbac = useRBAC("Admin Settings", "Users");
  const [users, setUsers] = useState([]);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);

  const [openRolesModal, setOpenRolesModal] = useState(false);
  const [rolesUser, setRolesUser] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(
        res.data.Users.map(u => ({
          ...u,
          FullName: `${u.FirstName ?? ""} ${u.LastName ?? ""}`.trim(),
        }))
      );
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ADD / EDIT USER ================= */

  const saveUser = async (form) => {
    const payload = {
      UserId: form.UserId ?? undefined,
      Username: form.Username,
      Email: form.Email,
      ...(form.Password ? { Password: form.Password } : {}),
      HRID: form.HRID,
      FirstName: form.FirstName,
      LastName: form.LastName,
      FirstNameAr: form.FirstNameAr,
      LastNameAr: form.LastNameAr,
      PhoneNumber: form.PhoneNumber,
      Department: form.Department,
      Position: form.Position,
      PositionAr: form.PositionAr,
      Bio: form.Bio,
      ProfileImage: form.ProfileImage,
      ProfilePicture: form.ProfilePicture,
      IsActive: !!form.IsActive,
      IsAdmin: !!form.IsAdmin,
      IsManager: !!form.IsManager,
    };

    try {
      if (form.UserId) {
        await updateUserApi(payload);
        toast.success("User updated successfully");
      } else {
        await addUserApi(payload);
        
        toast.success("User added successfully", {
          autoClose: 3000,
        });
        
        // Show reminder to assign roles
        setTimeout(() => {
          toast.info(
            "Don't forget to assign roles to the new user so they can access the system.",
            {
              autoClose: 5000,
            }
          );
        }, 1000);
      }

      // Close modal first, then fetch users
      setOpenUserModal(false);
      setEditingUser(null);
      
      // Small delay to ensure modal is closed before fetching
      setTimeout(() => {
        fetchUsers();
      }, 100);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Operation failed");
      // Don't close modal on error so user can fix and retry
    }
  };

  /* ================= UPDATE PASSWORD ================= */

  const updatePassword = async ({ UserId, Password }) => {
    try {
      await updateUserApi({ UserId, Password });
      toast.success("Password updated successfully");
      setOpenPasswordModal(false);
      setPasswordUser(null);
    } catch {
      toast.error("Failed to update password");
    }
  };

  /* ================= DELETE USER ================= */

  const handleDelete = async (userId) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm">
            Are you sure you want to delete this user?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                closeToast();
                try {
                  await deleteUserApi(userId);
                  toast.success("User deleted successfully");
                  fetchUsers();
                } catch {
                  toast.error("Failed to delete user");
                }
              }}
              className="px-3 py-1 text-xs rounded bg-danger text-white"
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

  /* ================= FILTERS ================= */

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(users.map(u => u.Department).filter(Boolean))];
    return depts.sort();
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        !searchTerm ||
        user.Username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.HRID?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = 
        !filterDepartment || user.Department === filterDepartment;

      const matchesStatus = 
        !filterStatus || 
        (filterStatus === "active" && user.IsActive) ||
        (filterStatus === "inactive" && !user.IsActive);

      const matchesAdmin = 
        !filterAdmin ||
        (filterAdmin === "admin" && user.IsAdmin) ||
        (filterAdmin === "user" && !user.IsAdmin);

      return matchesSearch && matchesDepartment && matchesStatus && matchesAdmin;
    });
  }, [users, searchTerm, filterDepartment, filterStatus, filterAdmin]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterStatus("");
    setFilterAdmin("");
  };

  const hasActiveFilters = searchTerm || filterDepartment || filterStatus || filterAdmin;

  // Loading guard
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-grayMedium dark:border-gray-700 
        shadow-lg p-6 text-center">
        <p className="text-sm text-grayTextLight dark:text-gray-400">
          Loading permissions...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-grayMedium dark:border-gray-700 
      shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-grayMedium dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-grayTextDark dark:text-white">Users</h1>
          <p className="text-sm text-grayTextLight dark:text-gray-400 mt-1">
            Manage system users and their permissions
          </p>
        </div>
{rbac.showCreateButton && (
        <button
          onClick={() => {
            setEditingUser(null);
            setOpenUserModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5
          bg-gradient-to-r from-primary to-primaryDark hover:from-primaryDark hover:to-primaryDarker
          text-white text-sm font-semibold rounded-xl 
          shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
          <HiOutlinePlus className="text-lg" />
          Add User
        </button>
)}
      </div>

      {/* Filters Section */}
      <div className="mb-4 space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-grayTextLight dark:text-gray-400 text-base" />
            <input
              type="text"
              placeholder="Search by username, name, email, or HRID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border-2 border-grayMedium dark:border-gray-700 rounded-lg 
                bg-white dark:bg-gray-800 text-grayTextDark dark:text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                transition-all shadow-sm hover:shadow-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-grayLight dark:hover:bg-gray-700"
              >
                <HiOutlineXMark className="text-grayTextLight dark:text-gray-400" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border-2 transition-all font-medium
              ${showFilters || hasActiveFilters
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white dark:bg-gray-800 border-grayMedium dark:border-gray-700 text-grayTextDark dark:text-gray-300 hover:bg-grayLight dark:hover:bg-gray-700"}`}
          >
            <HiOutlineFunnel className="inline text-lg mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 dark:bg-white/10 rounded-full text-xs">
                {[filterDepartment, filterStatus, filterAdmin].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-grayLight/50 dark:bg-gray-800/50 border border-grayMedium dark:border-gray-700 
            animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department Filter */}
              <div>
                <label className="block text-xs font-semibold text-grayTextDark dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-grayMedium dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-800 text-grayTextDark dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    transition-all text-sm"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-grayTextDark dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-grayMedium dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-800 text-grayTextDark dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    transition-all text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Admin Filter */}
              <div>
                <label className="block text-xs font-semibold text-grayTextDark dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={filterAdmin}
                  onChange={(e) => setFilterAdmin(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-grayMedium dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-800 text-grayTextDark dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    transition-all text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-grayTextLight dark:text-gray-400 hover:text-primary 
                    font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-grayTextLight dark:text-gray-400">
          <span>
            Showing <strong className="text-grayTextDark dark:text-white">{filteredUsers.length}</strong> of{" "}
            <strong className="text-grayTextDark dark:text-white">{users.length}</strong> users
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary hover:text-primaryDark font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="relative overflow-x-auto border-2 border-grayMedium dark:border-gray-700 rounded-xl 
        shadow-inner bg-grayLight/30 dark:bg-gray-900/30">
        <table className="w-full table-auto text-xs">
          <thead className="bg-gradient-to-r from-grayLight to-gray dark:from-gray-800 dark:to-gray-700">
            <tr>
              {[
                "HRID",
                "Username",
                "Full Name",
                "Department",
                "Position",
                "Admin",
                "Status",
                "Created At",
                "Actions",
              ].map(h => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-[10px] font-semibold text-grayTextDark dark:text-gray-300 
                    whitespace-nowrap uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-grayMedium dark:divide-gray-700 bg-white dark:bg-gray-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3 opacity-50">🔍</div>
                    <p className="text-sm font-medium text-grayTextDark dark:text-gray-300">
                      No users found
                    </p>
                    <p className="text-xs text-grayTextLight dark:text-gray-400 mt-1">
                      {hasActiveFilters 
                        ? "Try adjusting your filters" 
                        : "No users in the system"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 px-4 py-2 text-sm text-primary hover:text-primaryDark font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr
                  key={user.UserId}
                  className="hover:bg-primaryLighter/30 dark:hover:bg-gray-700/50 transition-colors"
                >
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {user.HRID ?? "-"}
                </td>

                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {user.Username}
                </td>

                <td className="px-3 py-2 max-w-[200px] truncate text-xs">
                  {user.FullName}
                </td>

                <td className="px-3 py-2 max-w-[150px] truncate text-xs">
                  {user.Department ?? "-"}
                </td>

                <td className="px-3 py-2 max-w-[150px] truncate text-xs">
                  {user.Position ?? "-"}
                </td>

                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                    ${
                      user.IsAdmin
                        ? "bg-indigoKpi/10 text-indigoKpi border border-indigoKpi/20"
                        : "bg-grayMedium/30 text-grayText dark:text-gray-400 border border-grayMedium/50"
                    }`}
                  >
                    {user.IsAdmin ? "Admin" : "User"}
                  </span>
                </td>

                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                    ${
                      user.IsActive
                        ? "bg-successLight text-success border border-success/30"
                        : "bg-dangerLight text-danger border border-danger/30"
                    }`}
                  >
                    {user.IsActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {user.CreatedAt?.slice(0, 10)}
                </td>

                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    {/* Edit User Button */}
                    {rbac.showEditButton && (
                      <button
                        onClick={() => {
                          if (rbac.canPerformEdit) {
                            setEditingUser(user);
                            setOpenUserModal(true);
                          }
                        }}
                        disabled={!rbac.canPerformEdit}
                        className={`p-1.5 rounded-lg transition-all ${
                          rbac.canPerformEdit
                            ? "hover:bg-primaryLight dark:hover:bg-gray-700 text-grayText dark:text-gray-400 hover:text-primary cursor-pointer"
                            : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        title={rbac.canPerformEdit ? "Edit User" : "No permission to edit"}
                      >
                        <HiOutlinePencilSquare className="text-base" />
                      </button>
                    )}

                    {/* Change Password Button - Only if can edit */}
                    {rbac.showEditButton && (
                      <button
                        onClick={() => {
                          if (rbac.canPerformEdit) {
                            setPasswordUser(user);
                            setOpenPasswordModal(true);
                          }
                        }}
                        disabled={!rbac.canPerformEdit}
                        className={`p-1.5 rounded-lg transition-all ${
                          rbac.canPerformEdit
                            ? "hover:bg-blueSoft dark:hover:bg-blue/20 text-grayText dark:text-gray-400 hover:text-blue cursor-pointer"
                            : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        title={rbac.canPerformEdit ? "Update Password" : "No permission to update password"}
                      >
                        <HiOutlineKey className="text-base" />
                      </button>
                    )}

                    {/* Assign Roles Button - Only if can edit */}
                    {rbac.showEditButton && (
                      <button
                        onClick={() => {
                          if (rbac.canPerformEdit) {
                            setRolesUser(user);
                            setOpenRolesModal(true);
                          }
                        }}
                        disabled={!rbac.canPerformEdit}
                        className={`p-1.5 rounded-lg transition-all ${
                          rbac.canPerformEdit
                            ? "hover:bg-indigoKpi/10 dark:hover:bg-indigoKpi/20 text-grayText dark:text-gray-400 hover:text-indigoKpi cursor-pointer"
                            : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        title={rbac.canPerformEdit ? "Assign Roles" : "No permission to assign roles"}
                      >
                        <HiOutlineUserGroup className="text-base" />
                      </button>
                    )}

                    {/* Delete Button */}
                    {rbac.showDeleteButton && (
                      <button
                        onClick={() => {
                          if (rbac.canPerformDelete) {
                            handleDelete(user.UserId);
                          }
                        }}
                        disabled={!rbac.canPerformDelete}
                        className={`p-1.5 rounded-lg transition-all ${
                          rbac.canPerformDelete
                            ? "hover:bg-dangerLight dark:hover:bg-danger/20 text-grayText dark:text-gray-400 hover:text-danger cursor-pointer"
                            : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        title={rbac.canPerformDelete ? "Delete User" : "No permission to delete"}
                      >
                        <HiOutlineTrash className="text-base" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddUserModal
        open={openUserModal}
        user={editingUser}
        onClose={() => {
          setOpenUserModal(false);
          setEditingUser(null);
        }}
        onSave={saveUser}
      />

      <UpdatePasswordModal
        open={openPasswordModal}
        user={passwordUser}
        lang="en"
        onClose={() => {
          setOpenPasswordModal(false);
          setPasswordUser(null);
        }}
        onSave={updatePassword}
      />

      <AssignRolesModal
        open={openRolesModal}
        user={rolesUser}
        onClose={() => {
          setOpenRolesModal(false);
          setRolesUser(null);
        }}
      />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getModules,
  getSubModules,
  getPermissions,
  getRolePermissions,
  addRoles,
  updateRoles,
  addRolePermissions,
  deleteRolePermissions,
} from "../../../../../core/api/axios";
import { devError } from "../../../../../core/utils/devLog";
import { handleApiError } from "../../../../../core/utils/apiErrorHandler";
import Step1RoleName from "./Step1RoleName";
import Step2SelectModules from "./Step2SelectModules";
import Step3Permissions from "./Step3Permissions";

// Query keys
const MODULES_QUERY_KEY = ["modules"];
const SUB_MODULES_QUERY_KEY = ["subModules"];
const PERMISSIONS_QUERY_KEY = ["permissions"];
const ROLE_PERMISSIONS_QUERY_KEY = (roleId) => ["rolePermissions", roleId];

export default function AddRoleModal({ open, onClose, role }) {
  const queryClient = useQueryClient();
  
  /* ================= STATE ================= */
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [current, setCurrent] = useState({
    module: "",
    sub: "",
    permission: "",
  });

  /* ================= RESET ================= */
  const reset = () => {
    setStep(1);
    setRoleName("");
    setSelectedModules([]);
    setPermissions([]);
    setOriginalPermissions([]);
    setCurrent({ module: "", sub: "", permission: "" });
  };

  /* ================= OPEN ================= */
  useEffect(() => {
    if (!open) return;
    reset();
    if (role) setRoleName(role.name);
  }, [open, role]);

  /* ================= QUERIES ================= */
  // Fetch modules (step 2)
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
  } = useQuery({
    queryKey: MODULES_QUERY_KEY,
    queryFn: async () => {
      const res = await getModules();
      return res.data.Modules || [];
    },
    enabled: open && step === 2,
    staleTime: 5 * 60 * 1000,
  });

  // Show error toast for modules
  useEffect(() => {
    if (modulesError) {
      const status = modulesError?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = modulesError?.response?.data?.message || "Service is temporarily unavailable. Please try again later.";
      } else if (status === 500) {
        msg = modulesError?.response?.data?.message || "Server error. Please try again later.";
      } else {
        msg = modulesError?.response?.data?.message || modulesError?.message || "Failed to load modules";
      }
      
      toast.error(msg);
    }
  }, [modulesError]);

  const modules = modulesData || [];

  // Fetch role permissions (step 2, if editing)
  const {
    data: rolePermissionsData,
    isLoading: rolePermissionsLoading,
    error: rolePermissionsError,
  } = useQuery({
    queryKey: ROLE_PERMISSIONS_QUERY_KEY(role?.id),
    queryFn: async () => {
      const res = await getRolePermissions(role.id);
      return res.data.RolePermissions || [];
    },
    enabled: open && step === 2 && !!role?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Show error toast for role permissions
  useEffect(() => {
    if (rolePermissionsError) {
      const status = rolePermissionsError?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = rolePermissionsError?.response?.data?.message || "Service is temporarily unavailable. Please try again later.";
      } else if (status === 500) {
        msg = rolePermissionsError?.response?.data?.message || "Server error. Please try again later.";
      } else {
        msg = rolePermissionsError?.response?.data?.message || rolePermissionsError?.message || "Failed to load role permissions";
      }
      
      toast.error(msg);
    }
  }, [rolePermissionsError]);

  // Initialize permissions when role permissions load
  useEffect(() => {
    if (rolePermissionsData && role?.id && step === 2) {
      const mapped = rolePermissionsData.map(r => ({
        module: r.ModuleID,
        sub: r.SubModuleID,
        permission: r.PermissionID,
        moduleName: r.ModuleName || r.ModuleNameAr,
        subModuleName: r.SubModuleName || r.SubModuleNameAr,
        permissionName: r.PermissionName,
        rolePermissionID: r.RolePermissionID,
      }));

      setPermissions(mapped);
      setOriginalPermissions(mapped);

      // Extract unique modules
      const uniqueModules = [...new Set(mapped.map(p => p.module))];
      setSelectedModules(uniqueModules);
    }
  }, [rolePermissionsData, role?.id, step]);

  // Fetch sub modules and permissions (step 3)
  const {
    data: subModulesData,
    isLoading: subModulesLoading,
    error: subModulesError,
  } = useQuery({
    queryKey: SUB_MODULES_QUERY_KEY,
    queryFn: async () => {
      const res = await getSubModules();
      return res.data.SubModules || [];
    },
    enabled: open && step === 3 && selectedModules.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const allSubModules = subModulesData || [];

  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await getPermissions();
      return res.data.Permissions || [];
    },
    enabled: open && step === 3 && selectedModules.length > 0,
    staleTime: 0, // Always refetch to get latest permissions
    refetchOnMount: true, // Refetch when modal opens
  });

  // Show error toasts for sub modules and permissions
  useEffect(() => {
    if (subModulesError) {
      const status = subModulesError?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = subModulesError?.response?.data?.message || "Service is temporarily unavailable. Please try again later.";
      } else if (status === 500) {
        msg = subModulesError?.response?.data?.message || "Server error. Please try again later.";
      } else {
        msg = subModulesError?.response?.data?.message || subModulesError?.message || "Failed to load sub modules";
      }
      
      toast.error(msg);
    }
  }, [subModulesError]);

  useEffect(() => {
    if (permissionsError) {
      const status = permissionsError?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = permissionsError?.response?.data?.message || "Service is temporarily unavailable. Please try again later.";
      } else if (status === 500) {
        msg = permissionsError?.response?.data?.message || "Server error. Please try again later.";
      } else {
        msg = permissionsError?.response?.data?.message || permissionsError?.message || "Failed to load permissions";
      }
      
      toast.error(msg);
    }
  }, [permissionsError]);

  const permissionsList = permissionsData || [];

  // Loading state for step 2
  const loadingStep2 = modulesLoading || (role?.id && rolePermissionsLoading);

  // Loading state for step 3
  const loadingStep3 = subModulesLoading || permissionsLoading;

  // Filtered sub modules based on selected module
  const subModules = useMemo(() => {
    if (!current.module) return [];
    return allSubModules.filter(sm => sm.ModuleID === current.module);
  }, [current.module, allSubModules]);

  /* ================= MUTATIONS ================= */
  const addRoleMutation = useMutation({
    mutationFn: (name) => addRoles([{ RoleName: name }]),
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to add role";
      toast.error(msg);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, name }) =>
      updateRoles([{ RoleID: roleId, NewName: name }]),
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to update role";
      toast.error(msg);
    },
  });

  const addRolePermissionsMutation = useMutation({
    mutationFn: (rolePermissions) => addRolePermissions(rolePermissions),
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to add permissions";
      toast.error(msg);
    },
  });

  const deleteRolePermissionsMutation = useMutation({
    mutationFn: (ids) => deleteRolePermissions(ids),
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to delete permissions";
      toast.error(msg);
    },
  });

  /* ================= HELPERS ================= */
  const addPermission = (permissionData) => {
    // Check if permission already exists
    const exists = permissions.some(
      p =>
        p.module === permissionData.module &&
        p.sub === permissionData.sub &&
        p.permission === permissionData.permission
    );

    if (exists) return;

    setPermissions(prev => [
      ...prev,
      permissionData,
    ]);
  };

  const removePermission = index =>
    setPermissions(p => p.filter((_, i) => i !== index));

  /* ================= SAVE ================= */
  const handleSave = async () => {
    let roleId = role?.id;

    try {
      // Add or update role
      if (!role) {
        const res = await addRoleMutation.mutateAsync(roleName);
        roleId = res.data?.addedRoles?.[0]?.RoleID;
      } else {
        await updateRoleMutation.mutateAsync({
          roleId: role.id,
          name: roleName,
        });
      }

      // Delete old permissions if editing
      if (originalPermissions.length) {
        const ids = originalPermissions
          .map(p => p.rolePermissionID)
          .filter(Boolean);

        if (ids.length) {
          await deleteRolePermissionsMutation.mutateAsync(ids);
        }
      }

      // Add new permissions
      if (permissions.length) {
        await addRolePermissionsMutation.mutateAsync(
          permissions.map(p => ({
            RoleID: roleId,
            PermissionID: p.permission,
            SubModuleID: p.sub,
          }))
        );
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      if (roleId) {
        queryClient.invalidateQueries({ queryKey: ROLE_PERMISSIONS_QUERY_KEY(roleId) });
      }

      toast.success(role ? "Role updated successfully" : "Role created successfully");
      onClose();
    } catch (error) {
      devError("Error saving role:", error);
      handleApiError(error, {
        customMessages: {
          500: "Failed to save role. Please try again later.",
        },
      });
    }
  };


  if (!open) return null;

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-5 relative shadow-xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-grayLight dark:hover:bg-gray-700 text-grayTextLight dark:text-gray-400 transition-colors"
        >
          <HiOutlineXMark className="text-lg" />
        </button>

        {/* STEP 1: Role Name */}
        {step === 1 && (
          <Step1RoleName
            roleName={roleName}
            setRoleName={setRoleName}
            role={role}
          />
        )}

        {/* STEP 2: Modules */}
        {step === 2 && (
          <Step2SelectModules
            modules={modules}
            selectedModules={selectedModules}
            setSelectedModules={setSelectedModules}
            setPermissions={setPermissions}
            loading={loadingStep2}
          />
        )}

        {/* STEP 3: Sub Modules & Permissions */}
        {step === 3 && (
          <Step3Permissions
            modules={modules}
            selectedModules={selectedModules}
            subModules={subModules}
            permissionsList={permissionsList}
            permissions={permissions}
            current={current}
            setCurrent={setCurrent}
            addPermission={addPermission}
            removePermission={removePermission}
            loading={loadingStep3}
          />
        )}

        {/* FOOTER */}
        <div className="flex justify-between gap-3 mt-6 pt-5 border-t border-grayMedium dark:border-gray-700">
          <button
            onClick={() => {
              if (step === 1) {
                onClose();
              } else {
                setStep(step - 1);
              }
            }}
            className="px-4 py-2 text-sm border border-grayMedium dark:border-gray-700 rounded-lg 
              text-grayTextDark dark:text-gray-300 hover:bg-grayLight dark:hover:bg-gray-700 
              transition-colors font-medium"
          >
            Back
          </button>

          {step === 1 && (
            <button
              disabled={!roleName.trim()}
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primaryDark 
                transition-colors font-medium"
            >
              Next
            </button>
          )}

          {step === 2 && (
            <button
              disabled={selectedModules.length === 0}
              onClick={() => setStep(3)}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primaryDark 
                transition-colors font-medium"
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSave}
              disabled={
                addRoleMutation.isPending ||
                updateRoleMutation.isPending ||
                addRolePermissionsMutation.isPending ||
                deleteRolePermissionsMutation.isPending
              }
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primaryDark 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {addRoleMutation.isPending ||
              updateRoleMutation.isPending ||
              addRolePermissionsMutation.isPending ||
              deleteRolePermissionsMutation.isPending
                ? "Saving..."
                : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

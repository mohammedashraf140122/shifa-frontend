import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import usePermission from "./usePermission";

/**
 * Unified RBAC Hook
 * Returns all permissions for a module/submodule in one call
 * Provides computed permissions and button visibility rules
 * 
 * @param {string} moduleName - Module name
 * @param {string} subModuleName - Sub-module name
 * @returns {object} - Permission flags and helper functions
 * 
 * @example
 * const rbac = useRBAC("Admin Settings", "Users");
 * if (rbac.showEditButton) { ... }
 * if (rbac.canPerformDelete) { ... }
 */
export default function useRBAC(moduleName, subModuleName) {
  // Single useAuth call to avoid performance issues
  const { isAdmin, permissionsMap } = useAuth();
  
  // Get all permissions at once
  const canRead = usePermission(moduleName, subModuleName, "Read");
  const canCreate = usePermission(moduleName, subModuleName, "Create");
  const canEdit = usePermission(moduleName, subModuleName, "Edit");
  const canDelete = usePermission(moduleName, subModuleName, "Delete");
  const canFull = usePermission(moduleName, subModuleName, "Full");
  
  // Check if user has ONLY Read permission (no Edit/Delete/Full) anywhere in the app
  const hasOnlyReadGlobally = useMemo(() => {
    if (isAdmin) return false;
    if (!permissionsMap || Object.keys(permissionsMap).length === 0) return false;
    
    // Check all permissions across all modules
    let hasAnyModifyPermission = false;
    let hasAnyReadPermission = false;
    
    Object.keys(permissionsMap).forEach(moduleName => {
      Object.keys(permissionsMap[moduleName] || {}).forEach(subModuleName => {
        const perms = permissionsMap[moduleName][subModuleName] || [];
        if (perms.length > 0) {
          hasAnyReadPermission = true;
          // Check if has any modify permission (Edit, Delete, Full, Create)
          if (perms.some(p => ["Edit", "Delete", "Full", "Create"].includes(p))) {
            hasAnyModifyPermission = true;
          }
        }
      });
    });
    
    // If has Read but no modify permissions anywhere → Read only mode
    return hasAnyReadPermission && !hasAnyModifyPermission;
  }, [permissionsMap, isAdmin]);
  
  // Computed permissions with memoization
  const permissions = useMemo(() => {
    const hasAnyPermission = canRead || canCreate || canEdit || canDelete || canFull || isAdmin;
    const canModify = canEdit || canDelete || canFull || isAdmin;
    const canManage = canFull || isAdmin;
    
    // CRITICAL: If user has Read only globally, hide ALL buttons app-wide
    const shouldShowButtons = !hasOnlyReadGlobally;
    
    return {
      // Basic permissions
      canRead,
      canCreate,
      canEdit,
      canDelete,
      canFull,
      isAdmin,
      
      // Computed permissions
      hasAnyPermission,
      canModify,
      canManage,
      hasOnlyReadGlobally, // Expose this for debugging
      
      // Button visibility rules (Read only = no buttons app-wide)
      // Show buttons only if:
      // 1. User has Edit/Delete/Full/Admin on THIS sub-module
      // 2. AND user doesn't have Read-only globally
      showEditButton: shouldShowButtons && (canEdit || canFull || isAdmin),
      showDeleteButton: shouldShowButtons && (canDelete || canFull || isAdmin),
      showCreateButton: shouldShowButtons && (canCreate || canFull || isAdmin),
      
      // Action rules (what user can actually do)
      canPerformEdit: shouldShowButtons && (canEdit || canFull || isAdmin),
      canPerformDelete: shouldShowButtons && (canDelete || canFull || isAdmin),
      canPerformCreate: shouldShowButtons && (canCreate || canFull || isAdmin),
    };
  }, [canRead, canCreate, canEdit, canDelete, canFull, isAdmin, hasOnlyReadGlobally]);
  
  return permissions;
}


import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook for checking permissions with inheritance support
 * 
 * Inheritance Rules:
 * - If user has permission on a Sub Module, it applies to all pages inside it
 * - If user has Read only (no Edit/Delete/Full), all buttons are hidden app-wide
 * 
 * @param {string} moduleName - Module name
 * @param {string} subModuleName - Sub-module name
 * @param {string} requiredPermission - Required permission (Read, Edit, Delete, Full, etc.)
 * @returns {boolean} - Whether user has the required permission
 */
export default function usePermission(
  moduleName,
  subModuleName,
  requiredPermission
) {
  const { permissionsMap, isAdmin, loading, user } = useAuth();

  // Memoize permission check to prevent unnecessary recalculations
  return useMemo(() => {
    // Admin has all permissions
    if (isAdmin) return true;

    // If still loading but user exists and permissionsMap exists, we can check permissions
    // This handles the case where loading is true but data is already available
    if (loading) {
      // If user and permissionsMap both exist, we can proceed with permission check
      // This handles race conditions where loading is still true but data is ready
      if (user && permissionsMap && Object.keys(permissionsMap).length > 0) {
        // Continue with permission check even though loading is true
      } else {
        return false;
      }
    }

    // If permissionsMap is empty but user exists, try to check permissions directly from user.modules
    if (!permissionsMap || Object.keys(permissionsMap).length === 0) {
      // If user exists but permissionsMap is empty, try to check directly from user.modules
      if (user?.modules && requiredPermission === "Read") {
        const parentModule = user.modules.find(m => m.moduleName === moduleName);
        if (parentModule) {
          const subModule = parentModule.subModules?.find(sub => sub.subModuleName === subModuleName);
          if (subModule?.permissions && subModule.permissions.length > 0) {
            return true;
          }
          
          // Check inheritance from user.modules
          const hasAnySubModulePermission = parentModule.subModules?.some(sub => {
            return sub.permissions && sub.permissions.length > 0;
          });
          
          if (hasAnySubModulePermission) {
            return true;
          }
        }
      }
      
      return false;
    }

    // If no module/submodule specified, return false
    if (!moduleName || !subModuleName) return false;

    // Get permissions for the specified module and submodule
    let perms = permissionsMap?.[moduleName]?.[subModuleName] || [];

    // FIRST: RBAC Best Practice - If SubModule exists in permissionsMap → Read is allowed
    // This follows industry-standard RBAC where Read = SubModule existence
    // Edit/Delete/Full require explicit permissions
    if (requiredPermission === "Read") {
      // Check if SubModule exists in permissionsMap (even if permissions array is empty)
      const hasSubModule = !!permissionsMap?.[moduleName]?.[subModuleName];
      
      if (hasSubModule) {
        return true;
      }
    }

    // SECOND: Check if user has explicit permission (for Edit/Delete/Full/Create)
    // For non-Read permissions, we require explicit permission in the array
    if (requiredPermission !== "Read" && perms.length > 0) {
      const hasPermission = perms.includes(requiredPermission);
      if (hasPermission) {
        return true;
      }
    }

    // THIRD: INHERITANCE - If SubModule doesn't exist in permissionsMap but exists in user.modules,
    // check if user has Read permission on any sibling sub-module in the same module
    // This allows Read on "System Settings" to apply to all sub-modules inside it
    // NOTE: Only Read permission is inherited, other permissions (Edit/Delete/Full/Create) must be explicit
    // NOTE: This is a fallback - the primary check is SubModule existence in permissionsMap (above)
    if (!permissionsMap?.[moduleName]?.[subModuleName] && requiredPermission === "Read" && user?.modules) {
      const parentModule = user.modules.find(m => m.moduleName === moduleName);
      if (parentModule) {
        // Check if any sub-module in this module has Read permission
        // This includes checking the current sub-module name in case of name mismatch
        let hasAnySubModuleReadPermission = false;
        let matchingSubModule = null;

        // First, check if current sub-module exists in user.modules (for name verification)
        const currentSubModule = parentModule.subModules?.find(sub => sub.subModuleName === subModuleName);
        if (currentSubModule) {
          // Check permissions for this exact sub-module from user.modules directly
          const currentSubPermsFromUser = currentSubModule.permissions?.map(p => p.permissionName) || [];
          if (currentSubPermsFromUser.length > 0) {
            hasAnySubModuleReadPermission = true;
            matchingSubModule = { name: subModuleName, perms: currentSubPermsFromUser, source: "user.modules" };
          } else {
            // Also check from permissionsMap (in case of timing issues)
            const currentSubPerms = permissionsMap?.[moduleName]?.[subModuleName] || [];
            if (currentSubPerms.length > 0) {
              hasAnySubModuleReadPermission = true;
              matchingSubModule = { name: subModuleName, perms: currentSubPerms, source: "permissionsMap" };
            }
          }
        }

        // If not found, check all sibling sub-modules from user.modules directly
        if (!hasAnySubModuleReadPermission) {
          hasAnySubModuleReadPermission = parentModule.subModules?.some(sub => {
            // First check from user.modules directly - check if has ANY permission (not just Read)
            const subPermsFromUser = sub.permissions?.map(p => p.permissionName) || [];
            if (subPermsFromUser.length > 0) {
              matchingSubModule = { name: sub.subModuleName, perms: subPermsFromUser, source: "user.modules" };
              return true;
            }
            // Also check from permissionsMap (in case of timing issues)
            const subPerms = permissionsMap?.[moduleName]?.[sub.subModuleName] || [];
            if (subPerms.length > 0) {
              matchingSubModule = { name: sub.subModuleName, perms: subPerms, source: "permissionsMap" };
              return true;
            }
            return false;
          });
        }
        
        // INHERITANCE RULE: If user has Read on any sub-module in this module,
        // grant Read access to all sub-modules in the same module
        if (hasAnySubModuleReadPermission) {
          return true;
        }
      }
    }

    // If permission is "Read" and SubModule doesn't exist, return false
    if (requiredPermission === "Read") {
      return false;
    }

    // For non-Read permissions, check if user has the specific permission
    // If no permissions array or empty, return false
    if (!perms || perms.length === 0) {
      return false;
    }
    return perms.includes(requiredPermission);
  }, [moduleName, subModuleName, requiredPermission, permissionsMap, isAdmin, loading, user]);
}

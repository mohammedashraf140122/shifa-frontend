import { useEffect } from "react";
import StepHeader from "./StepHeader";

/**
 * Step 3: Sub Modules & Permissions
 * Third step - allows user to assign permissions to selected modules
 */
export default function Step3Permissions({
  modules,
  selectedModules,
  subModules,
  permissionsList,
  permissions,
  current,
  setCurrent,
  addPermission,
  removePermission,
  loading,
}) {
  // Clear current.sub if it has permissions assigned (should be filtered out)
  useEffect(() => {
    if (current.sub && current.module) {
      const hasPermissions = permissions.some(
        perm => perm.module === current.module && perm.sub === current.sub
      );
      if (hasPermissions) {
        // Sub-module now has permissions, clear selection so it disappears from dropdown
        setCurrent(prev => ({ ...prev, sub: "", permission: "" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);
  if (loading) {
    return (
      <>
        <StepHeader
          stepNumber={3}
          title="Sub Modules & Permissions"
          active={true}
        />
        <div className="py-10 text-center text-grayTextLight dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-grayMedium border-t-primary"></div>
          <p className="mt-3 text-sm">Loading...</p>
        </div>
      </>
    );
  }

  if (selectedModules.length === 0) {
    return (
      <>
        <StepHeader
          stepNumber={3}
          title="Sub Modules & Permissions"
          active={true}
        />
        <div className="py-10 text-center text-grayTextLight dark:text-gray-400">
          <p className="text-sm">Please select modules first</p>
        </div>
      </>
    );
  }

  return (
    <>
      <StepHeader
        stepNumber={3}
        title="Sub Modules & Permissions"
        active={true}
      />

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {/* MODULE */}
          <select
            value={current.module}
            onChange={e =>
              setCurrent({
                module: e.target.value,
                sub: "",
                permission: "",
              })
            }
            className="px-4 py-2 border border-grayMedium dark:border-gray-700 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary
              bg-white dark:bg-gray-800 text-grayTextDark dark:text-gray-300"
          >
            <option value="">Select Module</option>
            {modules
              .filter(m => selectedModules.includes(m.ModuleID))
              .map(m => (
                <option key={m.ModuleID} value={m.ModuleID}>
                  {m.ModuleName}
                </option>
              ))}
          </select>

          {/* SUB MODULE */}
          <select
            value={current.sub}
            disabled={!current.module}
            onChange={e =>
              setCurrent({ ...current, sub: e.target.value, permission: "" })
            }
            className="px-4 py-2 border border-grayMedium dark:border-gray-700 rounded-lg 
              disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary
              bg-white dark:bg-gray-800 text-grayTextDark dark:text-gray-300"
          >
            <option value="">Select Sub Module</option>
            {subModules
              .filter(sm => {
                // Filter out sub-modules that already have permissions assigned
                const hasPermissions = permissions.some(
                  perm => perm.module === current.module && perm.sub === sm.SubModuleID
                );
                return !hasPermissions;
              })
              .map(sm => (
                <option
                  key={sm.SubModuleID}
                  value={sm.SubModuleID}
                >
                  {sm.SubModuleName}
                </option>
              ))}
          </select>

          {/* PERMISSIONS - Checkboxes */}
          <div className="col-span-1"></div>
        </div>

        {/* Permissions Checkboxes */}
        {current.module && current.sub && (
          <div className="mt-4 p-4 border border-grayMedium dark:border-gray-700 rounded-lg bg-grayLight/30 dark:bg-gray-700/30">
            <label className="text-sm font-medium text-grayTextDark dark:text-gray-300 mb-3 block">
              Select Permissions:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {permissionsList.map(p => {
                const isSelected = permissions.some(
                  perm => 
                    perm.module === current.module &&
                    perm.sub === current.sub &&
                    perm.permission === p.PermissionID
                );
                
                return (
                  <label
                    key={p.PermissionID}
                    className="flex items-center gap-2 cursor-pointer text-sm text-grayTextDark dark:text-gray-300 hover:bg-grayLight dark:hover:bg-gray-600 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => {
                        if (e.target.checked) {
                          // Add permission
                          const moduleName =
                            modules.find(m => m.ModuleID === current.module)?.ModuleName || "";
                          const subModuleName =
                            subModules.find(s => s.SubModuleID === current.sub)?.SubModuleName || "";
                          if (moduleName && subModuleName) {
                            addPermission({
                              module: current.module,
                              sub: current.sub,
                              permission: p.PermissionID,
                              moduleName,
                              subModuleName,
                              permissionName: p.PermissionName,
                            });
                          }
                        } else {
                          // Remove permission
                          const index = permissions.findIndex(
                            perm =>
                              perm.module === current.module &&
                              perm.sub === current.sub &&
                              perm.permission === p.PermissionID
                          );
                          if (index !== -1) {
                            removePermission(index);
                          }
                        }
                      }}
                      className="w-4 h-4 rounded border-grayMedium dark:border-gray-600 
                        text-primary focus:ring-2 focus:ring-primary 
                        dark:bg-gray-700 dark:checked:bg-primary"
                    />
                    <span>{p.PermissionName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* PERMISSIONS LIST */}
        {permissions.length > 0 && (
          <div className="mt-6 space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {permissions.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-grayLight dark:bg-gray-700 px-4 py-2 rounded-lg"
              >
                <span className="text-sm text-grayTextDark dark:text-gray-300">
                  {p.moduleName} / {p.subModuleName} → {p.permissionName}
                </span>
                <button
                  onClick={() => removePermission(i)}
                  className="text-danger hover:text-dangerDark transition-colors cursor-pointer"
                  title="Remove permission"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


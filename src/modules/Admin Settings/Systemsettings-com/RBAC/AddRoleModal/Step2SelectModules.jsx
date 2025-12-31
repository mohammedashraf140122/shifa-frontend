import StepHeader from "./StepHeader";

/**
 * Step 2: Select Modules
 * Second step - allows user to select modules for the role
 */
export default function Step2SelectModules({
  modules,
  selectedModules,
  setSelectedModules,
  setPermissions,
  loading,
}) {
  const handleToggle = (moduleId, checked) => {
    if (checked) {
      setSelectedModules(prev => {
        if (prev.includes(moduleId)) return prev;
        return [...prev, moduleId];
      });
    } else {
      setSelectedModules(prev => prev.filter(id => id !== moduleId));
      // Remove permissions for this module
      setPermissions(prev => prev.filter(p => p.module !== moduleId));
    }
  };

  const handleClearAll = () => {
    setSelectedModules([]);
    setPermissions([]);
  };

  if (loading) {
    return (
      <>
        <StepHeader
          stepNumber={2}
          title="Select Modules"
          active={true}
        />
        <div className="py-12 text-center text-grayTextLight dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-grayMedium border-t-primary"></div>
          <p className="mt-3 text-sm">Loading modules...</p>
        </div>
      </>
    );
  }

  return (
    <>
        <StepHeader
          stepNumber={2}
          title="Select Modules"
          active={true}
        />

      <div className="space-y-4">
        <p className="text-sm text-grayTextLight dark:text-gray-400">
          Select the modules for this role
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-grayMedium scrollbar-track-transparent pr-2">
          {modules.length === 0 ? (
            <div className="text-center py-8 text-grayTextLight dark:text-gray-400">
              <p className="text-sm">No modules available</p>
            </div>
          ) : (
            modules.map(m => {
              const moduleId = m.ModuleID;
              const isSelected = selectedModules.includes(moduleId);

              return (
                <label
                  key={moduleId}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                    border-grayMedium dark:border-gray-700 bg-white dark:bg-gray-800
                    hover:border-grayTextLight dark:hover:border-gray-600`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggle(moduleId, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-3.5 h-3.5 rounded border-grayMedium dark:border-gray-600 
                      text-gray-600 dark:text-gray-400 focus:ring-1 focus:ring-gray-400 focus:ring-offset-1
                      dark:bg-gray-700 dark:checked:bg-gray-600 checked:bg-gray-600
                      cursor-pointer transition-all shrink-0"
                  />
                  <span className="text-sm flex-1 text-grayTextDark dark:text-gray-300">
                    {m.ModuleName}
                  </span>
                </label>
              );
            })
          )}
        </div>

        {selectedModules.length > 0 && (
          <div className="pt-3 border-t border-grayMedium dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-grayTextDark dark:text-gray-300">
                <span className="font-medium">{selectedModules.length}</span> module{selectedModules.length > 1 ? 's' : ''} selected
              </p>
              <button
                onClick={handleClearAll}
                className="text-sm text-grayTextLight dark:text-gray-400 hover:text-grayTextDark dark:hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


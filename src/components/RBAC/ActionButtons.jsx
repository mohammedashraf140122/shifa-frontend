import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import useRBAC from "../../hooks/useRBAC";

/**
 * Unified Action Buttons Component
 * Handles all permission logic internally
 * 
 * Rules:
 * - Read only: No buttons shown
 * - Edit: Shows Edit button only
 * - Delete: Shows Delete button only
 * - Edit + Delete: Shows both buttons
 * - Full/Admin: Shows all buttons
 * 
 * @param {string} moduleName - Module name for permission check
 * @param {string} subModuleName - Sub-module name for permission check
 * @param {function} onEdit - Edit button click handler
 * @param {function} onDelete - Delete button click handler
 * @param {string} editLabel - Edit button tooltip (default: "Edit")
 * @param {string} deleteLabel - Delete button tooltip (default: "Delete")
 * @param {string} className - Additional CSS classes
 */
export default function ActionButtons({
  moduleName,
  subModuleName,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  className = "",
}) {
  const {
    canRead,
    showEditButton,
    showDeleteButton,
    canPerformEdit,
    canPerformDelete,
  } = useRBAC(moduleName, subModuleName);
  
  // Early return if no read permission
  if (!canRead) {
    return null;
  }
  
  // If user has Read only, show nothing
  if (!showEditButton && !showDeleteButton) {
    return null;
  }
  
  return (
    <div className={`flex justify-end gap-2 ${className}`}>
      {showEditButton && (
        <button
          onClick={canPerformEdit ? onEdit : undefined}
          disabled={!canPerformEdit}
          className={`${
            canPerformEdit
              ? "text-primary hover:text-primaryDark cursor-pointer transition-colors"
              : "text-gray-300 cursor-not-allowed opacity-50"
          }`}
          title={canPerformEdit ? editLabel : "No permission to edit"}
          type="button"
        >
          <HiOutlinePencilSquare className="text-lg" />
        </button>
      )}
      
      {showDeleteButton && (
        <button
          onClick={canPerformDelete ? onDelete : undefined}
          disabled={!canPerformDelete}
          className={`${
            canPerformDelete
              ? "text-danger hover:text-dangerDark cursor-pointer transition-colors"
              : "text-gray-300 cursor-not-allowed opacity-50"
          }`}
          title={canPerformDelete ? deleteLabel : "No permission to delete"}
          type="button"
        >
          <HiOutlineTrash className="text-lg" />
        </button>
      )}
    </div>
  );
}


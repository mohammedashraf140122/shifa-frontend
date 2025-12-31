import { Navigate } from "react-router-dom";
import useRBAC from "../../hooks/useRBAC";

export default function PermissionRoute({
  module,
  subModule,
  action = "Read",
  children,
}) {
  const rbac = useRBAC(module, subModule);
  
  // Determine if user has the required permission
  let allowed = false;
  
  switch (action) {
    case "Read":
      allowed = rbac.canRead;
      break;
    case "Create":
      allowed = rbac.canPerformCreate;
      break;
    case "Edit":
      allowed = rbac.canPerformEdit;
      break;
    case "Delete":
      allowed = rbac.canPerformDelete;
      break;
    case "Full":
      allowed = rbac.canManage;
      break;
    default:
      allowed = rbac.canRead;
  }

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

import StepHeader from "./StepHeader";

/**
 * Step 1: Role Name
 * First step in the role creation/editing process
 */
export default function Step1RoleName({ roleName, setRoleName, role }) {
  return (
    <>
      <StepHeader
        stepNumber={1}
        title={role ? "Edit Role" : "Add Role"}
        active={true}
      />

      <input
        value={roleName}
        onChange={e => setRoleName(e.target.value)}
        placeholder="Role name"
        className="w-full px-4 py-2 border border-grayMedium dark:border-gray-700 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary
          bg-white dark:bg-gray-800 text-grayTextDark dark:text-gray-300"
        autoFocus
      />
    </>
  );
}


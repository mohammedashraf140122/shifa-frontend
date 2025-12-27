import { useState } from "react";

export default function Roles() {
  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Doctor" },
  ];

  const [users, setUsers] = useState([
    { id: 1, name: "Ahmed Ali", email: "ahmed@mail.com", roleId: 1 },
    { id: 2, name: "Sara Mohamed", email: "sara@mail.com", roleId: 2 },
    { id: 3, name: "Omar Hassan", email: "omar@mail.com", roleId: 2 },
  ]);

  const handleRoleChange = (userId, roleId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, roleId: Number(roleId) } : u
      )
    );
  };

  const handleAssign = (user) => {
    console.log("Assign Role", {
      userId: user.id,
      roleId: user.roleId,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          Assign Roles
        </h2>
        <p className="text-sm text-gray-500">
          Assign existing roles to users
        </p>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium w-[220px]">
                User
              </th>
              <th className="px-5 py-3 text-left font-medium">
                Email
              </th>
              <th className="px-5 py-3 text-left font-medium w-[220px]">
                Role
              </th>
              <th className="px-5 py-3 w-[140px]">
                <div className="flex justify-center items-center font-medium">
                  Action
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-4 font-medium text-gray-900">
                  {user.name}
                </td>

                <td className="px-5 py-4 text-gray-600 truncate">
                  {user.email}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={user.roleId}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                    className="
                      w-full
                      border border-gray-300
                      rounded-md
                      px-3 py-2
                      text-sm
                      focus:outline-none
                      focus:ring-1
                      focus:ring-primary
                    "
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleAssign(user)}
                      className="
                        bg-primary
                        hover:bg-primaryDark
                        text-white
                        px-4 py-2
                        rounded-md
                        text-sm
                        font-medium
                        transition
                      "
                    >
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.name}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <select
              value={user.roleId}
              onChange={(e) =>
                handleRoleChange(user.id, e.target.value)
              }
              className="
                w-full
                border border-gray-300
                rounded-md
                px-3 py-2
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-primary
              "
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleAssign(user)}
              className="
                w-full
                bg-primary
                hover:bg-primaryDark
                text-white
                py-2
                rounded-md
                text-sm
                font-medium
                transition
              "
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

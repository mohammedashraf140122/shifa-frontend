import { useState } from "react";
import {
  HiOutlinePencilSquare,
  HiOutlineCog6Tooth,
  HiOutlineEye,
  HiOutlinePlus,
} from "react-icons/hi2";
import AddUserModal from "./Systemsettings-com/AddUser/AddUserModal.jsx";

export default function Users() {
  const [openAdd, setOpenAdd] = useState(false);

  const [users, setUsers] = useState([
    {
      userId: "1",
      hrid: "HR-001",
      username: "admin",
      email: "admin@portal.com",
      firstName: "System",
      lastName: "Admin",
      department: "IT",
      position: "Administrator",
      isActive: true,
      isAdmin: true,
      lastLogin: "2025-12-21 14:30",
      createdAt: "2025-01-10",
    },
  ]);

  const addUser = data => {
    setUsers(prev => [
      ...prev,
      {
        ...data,
        userId: Date.now().toString(),
        lastLogin: "-",
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-grayTextLight">
            Manage system users
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 px-4 py-2
          bg-primary text-white text-sm font-medium
          rounded-lg hover:bg-primaryDark"
        >
          <HiOutlinePlus />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="border border-grayMedium rounded-lg overflow-x-auto">
        <table className="min-w-max w-full text-sm">
          <thead className="bg-grayLight">
            <tr>
              {[
                "HRID",
                "Username",
                "Full Name",
                "Department",
                "Position",
                "Admin",
                "Status",
                "Last Login",
                "Created At",
                "Actions",
              ].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left whitespace-nowrap text-[11px]"

                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-grayMedium text-[10px]">
            {users.map(user => (
              <tr key={user.userId}>
                <td className="px-4 py-3">{user.hrid}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.department}</td>
                <td className="px-4 py-3">{user.position}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px]
                    ${
                      user.isAdmin
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px]
                    ${
                      user.isActive
                        ? "bg-successLight text-success"
                        : "bg-dangerLight text-danger"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3">{user.lastLogin}</td>
                <td className="px-4 py-3">{user.createdAt}</td>

                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <HiOutlineEye className="cursor-pointer" />
                    <HiOutlinePencilSquare className="cursor-pointer" />
                    <HiOutlineCog6Tooth className="cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={addUser}
      />
    </div>
  );
}

import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineCog6Tooth,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";
import AddRoleModal from "../RBAC/AddRoleModal/AddRoleModal.jsx";

export default function Role() {
  const [openModal, setOpenModal] = useState(false);

  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", createdAt: "2025-01-10" },
    { id: 2, name: "Doctor", createdAt: "2025-02-02" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  /* ================= Edit Name Only ================= */

  const startEdit = role => {
    setEditingId(role.id);
    setTempName(role.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempName("");
  };

  const saveEdit = id => {
    setRoles(prev =>
      prev.map(r =>
        r.id === id ? { ...r, name: tempName } : r
      )
    );
    setEditingId(null);
    setTempName("");
  };

  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-grayTextDark">
            Role Management
          </h2>
          <p className="text-sm text-grayTextLight">
            Manage system roles
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-4 py-2
          bg-primary text-white text-sm font-medium
          rounded-lg hover:bg-primaryDark transition"
        >
          <HiOutlinePlus className="text-lg" />
          Add Role
        </button>
      </div>

      {/* Table */}
      <div className="border border-grayMedium rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-grayLight">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-grayTextLight">
                Role Name
              </th>
              <th className="px-5 py-3 text-left font-medium text-grayTextLight">
                Create Date
              </th>
              <th className="px-5 py-3 text-right font-medium text-grayTextLight">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-grayMedium">
            {roles.map(role => (
              <tr
                key={role.id}
                className="hover:bg-grayLight/60 transition"
              >
                {/* Role Name */}
                <td className="px-5 py-4 font-medium text-grayTextDark">
                  {editingId === role.id ? (
                    <input
                      value={tempName}
                      onChange={e =>
                        setTempName(e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-md
                      border border-grayMedium focus:outline-none
                      focus:border-primary"
                    />
                  ) : (
                    role.name
                  )}
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-grayTextDark">
                  {role.createdAt}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-4">
                    {editingId === role.id ? (
                      <>
                        {/* Save */}
                        <button
                          onClick={() => saveEdit(role.id)}
                          className="text-success hover:text-successDark"
                        >
                          <HiOutlineCheck className="text-lg" />
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={cancelEdit}
                          className="text-danger hover:text-dangerDark"
                        >
                          <HiOutlineXMark className="text-lg" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Name */}
                        <button
                          title="Edit name"
                          onClick={() => startEdit(role)}
                          className="text-grayTextLight hover:text-primary transition"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>

                        {/* Manage Permissions */}
                        <button
                          title="Manage permissions"
                          className="text-grayTextLight hover:text-indigo-500 transition"
                        >
                          <HiOutlineCog6Tooth className="text-lg" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={data => {
          setRoles(prev => [
            ...prev,
            {
              id: Date.now(),
              name: data.roleName,
              createdAt: new Date()
                .toISOString()
                .slice(0, 10),
            },
          ]);
          setOpenModal(false);
        }}
      />
    </div>
  );
}

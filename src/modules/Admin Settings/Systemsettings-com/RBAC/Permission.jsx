import { useState } from "react";
import { IoCheckmarkDone, IoClose } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";

export default function AccessName() {
  const [accessList, setAccessList] = useState([]);

  const t = {
    title: "Access Types",
    desc: "Create custom access names.",
    add: "Add Access",
    access: "Access Name",
    placeholder: "Enter access name (e.g. View, Edit, Admin)",
  };

  /* ======================
     Add
  ====================== */
  const addAccess = () => {
    setAccessList(prev => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        tempName: "",
        editing: true,
        isNew: true,
      },
    ]);
  };

  /* ======================
     Edit
  ====================== */
  const startEdit = id => {
    setAccessList(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, editing: true, tempName: a.name }
          : a
      )
    );
  };

  const updateName = (id, value) => {
    setAccessList(prev =>
      prev.map(a =>
        a.id === id ? { ...a, tempName: value } : a
      )
    );
  };

  /* ======================
     Save / Cancel
  ====================== */
  const saveAccess = id => {
    setAccessList(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              name: a.tempName,
              editing: false,
              isNew: false,
            }
          : a
      )
    );
  };

  const cancelEdit = id => {
    setAccessList(prev =>
      prev
        .filter(a => !(a.id === id && a.isNew))
        .map(a =>
          a.id === id
            ? {
                ...a,
                editing: false,
                tempName: a.name,
              }
            : a
        )
    );
  };

  /* ======================
     Render
  ====================== */
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-500">{t.desc}</p>
        </div>

        <button
          onClick={addAccess}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white"
        >
          {t.add}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">{t.access}</th>
              <th className="w-24"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {accessList.map(a => {
              const canSave = a.tempName.trim() !== "";

              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  {/* Access Name */}
                  <td className="px-4 py-3">
                    {a.editing ? (
                      <input
                        placeholder={t.placeholder}
                        value={a.tempName}
                        onChange={e =>
                          updateName(a.id, e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <span className="font-medium">{a.name}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-2">
                    {a.editing ? (
                      <>
                        <button
                          disabled={!canSave}
                          onClick={() => saveAccess(a.id)}
                          className={`${
                            canSave
                              ? "text-emerald-500"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <IoCheckmarkDone className="text-xl" />
                        </button>

                        <button
                          onClick={() => cancelEdit(a.id)}
                          className="text-red-500"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(a.id)}
                        className="text-emerald-500"
                      >
                        <HiOutlinePencilSquare className="text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  HiOutlineXMark,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

export default function AddRoleModal({ open, onClose, onSave }) {
  if (!open) return null;

  /* ================= STATE ================= */
  const [step, setStep] = useState(1);
  const [roleName, setRoleName] = useState("");

  /* ================= STATIC DATA ================= */
  const modules = ["HR", "Finance", "Appointments", "Reports"];

  const subModulesMap = {
    HR: ["Employees", "Attendance"],
    Finance: ["Invoices", "Payments"],
    Appointments: ["Doctors", "Schedule"],
    Reports: ["Daily", "Monthly"],
  };

  const permissionTypes = ["View", "Edit", "Admin"];

  /* ================= STEP 2 ================= */
  const [selectedModules, setSelectedModules] = useState([]);

  /* ================= STEP 3 ================= */
  const [permissions, setPermissions] = useState([]);
  const [current, setCurrent] = useState({
    module: "",
    sub: "",
    permission: "",
  });

  /* ================= HELPERS ================= */

  // Step 2
  const addModule = m =>
    setSelectedModules(prev => [...prev, m]);

  const removeModule = m =>
    setSelectedModules(prev => prev.filter(x => x !== m));

  // Step 3
  const addPermission = () => {
    if (!current.module || !current.sub || !current.permission) return;

    setPermissions(prev => [...prev, current]);
    setCurrent({ module: "", sub: "", permission: "" });
  };

  const removePermission = index => {
    setPermissions(prev => prev.filter((_, i) => i !== index));
  };

  // Save
  const handleSave = () => {
    onSave({
      roleName,
      modules: selectedModules,
      permissions,
    });
    onClose();
  };

  /* ================= RENDER ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-2xl px-8 py-6 relative shadow-xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <HiOutlineXMark className="text-2xl" />
        </button>

        {/* ======== STAGES HEADER ======== */}
        <div className="flex bg-grayLight rounded-lg overflow-hidden mb-8">
          {[
            { id: 1, label: "Role Info" },
            { id: 2, label: "Select Modules" },
            { id: 3, label: "Assign Permissions" },
          ].map(s => (
            <div
              key={s.id}
              className={`flex-1 text-center py-3 text-sm font-semibold
              ${
                step === s.id
                  ? "bg-primary text-white shadow"
                  : "text-grayTextLight"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h3 className="text-base font-semibold mb-3">
              Role Name
            </h3>

            <input
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full px-4 py-2.5 rounded-lg border border-grayMedium
              focus:outline-none focus:border-primary"
            />
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h3 className="text-base font-semibold mb-5">
              Select Modules
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Available */}
              <div>
                <p className="text-sm text-grayTextLight mb-2">
                  Available Modules
                </p>

                <div className="border border-grayMedium rounded-lg p-2 space-y-1">
                  {modules
                    .filter(m => !selectedModules.includes(m))
                    .map(m => (
                      <button
                        key={m}
                        onClick={() => addModule(m)}
                        className="w-full flex justify-between items-center
                        px-3 py-2 text-sm rounded-md hover:bg-grayLight"
                      >
                        {m}
                        <HiOutlineArrowRight />
                      </button>
                    ))}
                </div>
              </div>

              {/* Selected */}
              <div>
                <p className="text-sm text-grayTextLight mb-2">
                  Selected Modules
                </p>

                <div className="border border-grayMedium rounded-lg p-2 space-y-1">
                  {selectedModules.map(m => (
                    <button
                      key={m}
                      onClick={() => removeModule(m)}
                      className="w-full flex justify-between items-center
                      px-3 py-2 text-sm rounded-md hover:bg-grayLight"
                    >
                      {m}
                      <HiOutlineArrowLeft />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h3 className="text-base font-semibold mb-4">
              Assign Permissions
            </h3>

            {/* Row: selects + add */}
            <div className="grid grid-cols-4 gap-4 items-center mb-4">
              <select
                value={current.module}
                onChange={e =>
                  setCurrent({
                    ...current,
                    module: e.target.value,
                    sub: "",
                  })
                }
                className="px-3 py-2 rounded-lg border border-grayMedium"
              >
                <option value="">Module</option>
                {selectedModules.map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select
                value={current.sub}
                onChange={e =>
                  setCurrent({ ...current, sub: e.target.value })
                }
                className="px-3 py-2 rounded-lg border border-grayMedium"
              >
                <option value="">Sub Module</option>
                {(subModulesMap[current.module] || []).map(sm => (
                  <option key={sm}>{sm}</option>
                ))}
              </select>

              <select
                value={current.permission}
                onChange={e =>
                  setCurrent({
                    ...current,
                    permission: e.target.value,
                  })
                }
                className="px-3 py-2 rounded-lg border border-grayMedium"
              >
                <option value="">Permission</option>
                {permissionTypes.map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <button
                onClick={addPermission}
                className="px-4 py-2 rounded-lg border border-primary
                text-primary text-sm font-medium
                hover:bg-primary hover:text-white transition"
              >
                + Add
              </button>
            </div>

            {/* Preview */}
            <div className="space-y-2 text-sm">
              {permissions.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center
                  border border-grayMedium rounded-lg px-4 py-3"
                >
                  <span>
                    {p.module} / {p.sub} →{" "}
                    <b>{p.permission}</b>
                  </span>

                  <button
                    onClick={() => removePermission(i)}
                    className="text-danger hover:text-red-600"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center mt-10">
          {step === 1 ? (
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-grayMedium"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-lg border border-grayMedium"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              disabled={step === 1 && roleName.trim() === ""}
              onClick={() => setStep(step + 1)}
              className={`px-6 py-2 rounded-lg text-white ${
                step === 1 && roleName.trim() === ""
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-primary text-white"
            >
              Save Role
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

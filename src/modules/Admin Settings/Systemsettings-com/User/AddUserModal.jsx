import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import "./AddUserModal.css";

const EMPTY_FORM = {
  UserId: null,

  HRID: null,
  Username: "",
  Email: "",
  Password: "",

  IsActive: true,
  LastLogin: null,

  FirstName: "",
  LastName: "",
  FirstNameAr: null,
  LastNameAr: null,

  PhoneNumber: null,
  Department: "",
  Position: "",
  PositionAr: null,

  CreatedAt: null,
  UpdatedAt: null,

  Bio: null,
  ProfileImage: null,
  ProfilePicture: null,

  IsAdmin: false,
  IsManager: false,
};

export default function AddUserModal({ open, user, onClose, onSave }) {
  const isEdit = !!user;
  const [form, setForm] = useState(EMPTY_FORM);

  /* ================= INIT ================= */

  useEffect(() => {
    if (open) {
      if (user) {
        setForm({
          ...user,
          Password: "", // نفرغ الباسورد
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [user, open]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* ================= SAVE ================= */

  const save = async () => {
    const payload = {
      ...form,

      // EDIT: لو الباسورد فاضي متبعتهوش
      ...(form.UserId && !form.Password
        ? { Password: undefined }
        : {}),
    };

    try {
      await onSave(payload);
      // Modal will be closed by parent component
    } catch (error) {
      // Error handling is done in parent
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col animate-scale-in max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grayMedium dark:border-gray-700">
          <h2 className="text-xl font-bold text-grayTextDark dark:text-white">
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-grayLight dark:hover:bg-gray-700 transition-colors text-grayTextLight dark:text-gray-400"
            aria-label="Close"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        {/* Body – نفس UI */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">

          <Card title="General Information">
            <Grid>
              <Field label="HRID">
                <Input value={form.HRID || ""} onChange={v => set("HRID", v)} />
              </Field>

              <Field label="Username">
                <Input value={form.Username} onChange={v => set("Username", v)} />
              </Field>

              <Field label="Email">
                <Input value={form.Email} onChange={v => set("Email", v)} />
              </Field>

              <Field label={isEdit ? "New Password" : "Password"}>
                <Input
                  type="password"
                  value={form.Password}
                  onChange={v => set("Password", v)}
                />
              </Field>
            </Grid>
          </Card>

          <Card title="Names">
            <Grid>
              <Field label="First Name (EN)">
                <Input value={form.FirstName} onChange={v => set("FirstName", v)} />
              </Field>

              <Field label="Last Name (EN)">
                <Input value={form.LastName} onChange={v => set("LastName", v)} />
              </Field>

              <Field label="الاسم الأول (AR)">
                <Input dir="rtl" value={form.FirstNameAr || ""} onChange={v => set("FirstNameAr", v)} />
              </Field>

              <Field label="اسم العائلة (AR)">
                <Input dir="rtl" value={form.LastNameAr || ""} onChange={v => set("LastNameAr", v)} />
              </Field>
            </Grid>
          </Card>

          <Card title="Job Information">
            <Grid>
              <Field label="Department">
                <Input value={form.Department} onChange={v => set("Department", v)} />
              </Field>

              <Field label="Position (EN)">
                <Input value={form.Position} onChange={v => set("Position", v)} />
              </Field>

              <Field label="المسمى الوظيفي (AR)">
                <Input dir="rtl" value={form.PositionAr || ""} onChange={v => set("PositionAr", v)} />
              </Field>
            </Grid>
          </Card>

          <Card title="Contact & Bio">
            <Grid>
              <Field label="Phone Number">
                <Input value={form.PhoneNumber || ""} onChange={v => set("PhoneNumber", v)} />
              </Field>

              <Field label="Bio">
                <textarea
                  value={form.Bio || ""}
                  onChange={e => set("Bio", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-grayMedium dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-700 text-grayTextDark dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all min-h-[80px] resize-y"
                />
              </Field>
            </Grid>
          </Card>

          <div className="flex gap-6 px-2">
            <Check label="Active" checked={form.IsActive} onChange={v => set("IsActive", v)} />
            <Check label="Admin" checked={form.IsAdmin} onChange={v => set("IsAdmin", v)} />
            <Check label="Manager" checked={form.IsManager} onChange={v => set("IsManager", v)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-grayMedium dark:border-gray-700 bg-grayLight/30 dark:bg-gray-700/30">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 border border-grayMedium dark:border-gray-600 rounded-lg 
              text-grayTextDark dark:text-gray-300 hover:bg-grayMedium dark:hover:bg-gray-700 
              transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={save}
            className="px-6 py-2.5 bg-primary hover:bg-primaryDark text-white rounded-lg 
              transition-all shadow-md hover:shadow-lg font-medium"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI PARTS ================= */

function Card({ title, children }) {
  return (
    <div className="bg-grayLight/50 dark:bg-gray-700/30 border border-grayMedium dark:border-gray-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-grayTextDark dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 gap-5">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-grayTextDark dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", dir }) {
  return (
    <input
      type={type}
      dir={dir}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-grayMedium dark:border-gray-700 rounded-lg 
        bg-white dark:bg-gray-700 text-grayTextDark dark:text-white
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        transition-all"
    />
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer text-grayTextDark dark:text-gray-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-grayMedium dark:border-gray-600 
          text-primary focus:ring-2 focus:ring-primary 
          dark:bg-gray-700 dark:checked:bg-primary"
      />
      {label}
    </label>
  );
}

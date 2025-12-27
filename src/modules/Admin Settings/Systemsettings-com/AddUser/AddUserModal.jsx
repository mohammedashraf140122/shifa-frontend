import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import "./AddUserModal.css";
export default function AddUserModal({ open, onClose, onSave }) {
  if (!open) return null;

  const [form, setForm] = useState({
    hrid: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    firstNameAr: "",
    lastNameAr: "",
    department: "",
    position: "",
    positionAr: "",
    phoneNumber: "",
    bio: "",
    isActive: true,
    isAdmin: false,
    isManager: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add User</h2>
          <button onClick={onClose}>
            <HiOutlineXMark className="text-xl text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">

          {/* ===== General ===== */}
          <Card title="General Information">
            <Grid>
              <Field label="HRID">
                <Input value={form.hrid} onChange={v => set("hrid", v)} />
              </Field>

              <Field label="Username *">
                <Input value={form.username} onChange={v => set("username", v)} />
              </Field>

              <Field label="Email *">
                <Input value={form.email} onChange={v => set("email", v)} />
              </Field>

              <Field label="Password *">
                <Input type="password" value={form.password} onChange={v => set("password", v)} />
              </Field>

              <Field label="Confirm Password *">
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={v => set("confirmPassword", v)}
                />
              </Field>
            </Grid>
          </Card>

          {/* ===== Names ===== */}
          <Card title="Names">
            <Grid>
              <Field label="First Name (EN)">
                <Input value={form.firstName} onChange={v => set("firstName", v)} />
              </Field>

              <Field label="Last Name (EN)">
                <Input value={form.lastName} onChange={v => set("lastName", v)} />
              </Field>

              <Field label="الاسم الأول (AR)">
                <Input dir="rtl" value={form.firstNameAr} onChange={v => set("firstNameAr", v)} />
              </Field>

              <Field label="اسم العائلة (AR)">
                <Input dir="rtl" value={form.lastNameAr} onChange={v => set("lastNameAr", v)} />
              </Field>
            </Grid>
          </Card>

          {/* ===== Job ===== */}
          <Card title="Job Information">
            <Grid>
              <Field label="Department">
                <Input value={form.department} onChange={v => set("department", v)} />
              </Field>

              <Field label="Position (EN)">
                <Input value={form.position} onChange={v => set("position", v)} />
              </Field>

              <Field label="المسمى الوظيفي (AR)">
                <Input dir="rtl" value={form.positionAr} onChange={v => set("positionAr", v)} />
              </Field>
            </Grid>
          </Card>

          {/* ===== Contact ===== */}
          <Card title="Contact & Bio">
            <Grid>
              <Field label="Phone Number">
                <Input value={form.phoneNumber} onChange={v => set("phoneNumber", v)} />
              </Field>

              <Field label="Bio">
                <textarea
                  value={form.bio}
                  onChange={e => set("bio", e.target.value)}
                  className="textarea"
                />
              </Field>
            </Grid>
          </Card>

          {/* Flags */}
          <div className="flex gap-6 px-2">
            <Check label="Active" checked={form.isActive} onChange={v => set("isActive", v)} />
            <Check label="Admin" checked={form.isAdmin} onChange={v => set("isAdmin", v)} />
            <Check label="Manager" checked={form.isManager} onChange={v => set("isManager", v)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button onClick={save} className="btn-primary">
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
    <div className="bg-gray-50 border border-grayMedium rounded-lg p-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 gap-5">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
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
      className="input"
    />
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

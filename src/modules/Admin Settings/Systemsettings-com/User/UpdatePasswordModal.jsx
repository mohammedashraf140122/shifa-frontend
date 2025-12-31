import { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import {
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

export default function UpdatePasswordModal({
  open,
  user,
  onClose,
  onSave,
  lang = "en",
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirm("");
      setError("");
      setShowPassword(false);
      setShowConfirm(false);
      setSaving(false);
    }
  }, [open]);

  if (!open || !user) return null;

  const save = async () => {
    setError("");

    if (!password)
      return setError(lang === "ar" ? "كلمة المرور مطلوبة" : "Password required");

    if (password.length < 6)
      return setError(
        lang === "ar"
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );

    if (password !== confirm)
      return setError(
        lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match"
      );

    try {
      setSaving(true);
      await onSave({
        UserId: user.UserId || user.id,
        Password: password,
      });
      onClose();
    } catch {
      setError(
        lang === "ar"
          ? "حدث خطأ أثناء التحديث"
          : "An error occurred while updating"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-root fixed inset-0 z-[9999] bg-black/40
      flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white dark:bg-gray-800
          w-full max-w-md
          rounded-xl
          shadow-md
          border border-grayMedium dark:border-gray-700
        "
        onClick={(e) => e.stopPropagation()}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-grayMedium">
          <div className="flex items-center gap-2">
            <IoLockClosedOutline className="text-primary text-sm" />
            <h2 className="text-sm font-medium text-grayTextDark dark:text-white">
              {lang === "ar" ? "تحديث كلمة المرور" : "Update Password"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-grayLight dark:hover:bg-gray-700"
          >
            <HiOutlineXMark className="text-sm" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-grayTextDark dark:text-gray-300">
              {lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="
                  w-full px-3 py-2 text-sm
                  border border-grayMedium
                  rounded-lg
                  bg-white dark:bg-gray-700
                  text-grayTextDark dark:text-white
                  focus:outline-none focus:border-primary
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-grayTextLight"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {/* CONFIRM */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-grayTextDark dark:text-gray-300">
              {lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="
                  w-full px-3 py-2 text-sm
                  border border-grayMedium
                  rounded-lg
                  bg-white dark:bg-gray-700
                  text-grayTextDark dark:text-white
                  focus:outline-none focus:border-primary
                "
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-grayTextLight"
              >
                {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-danger bg-dangerLight px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-grayMedium bg-grayLight/40 dark:bg-gray-700/30">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm
              border border-grayMedium
              rounded-lg
              text-grayTextDark dark:text-gray-300
              hover:bg-grayLight dark:hover:bg-gray-700
            "
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="
              px-4 py-2 text-sm
              bg-primary text-white
              rounded-lg
              disabled:opacity-50
            "
          >
            {saving
              ? lang === "ar"
                ? "جاري التحديث..."
                : "Updating..."
              : lang === "ar"
              ? "تحديث"
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

import {
  IoMenu,
  IoSunny,
  IoMoon,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../modules/Alerts/alerts.store";
import HeaderNotifications from "../../modules/Alerts/HeaderNotifications";
import { useLogout } from "../../hooks/useLogout";
import { useAuth } from "../../context/AuthContext";
import useRBAC from "../../hooks/useRBAC";
import ChangePasswordModal from "./ChangePasswordModal";
import { updateUserApi } from "../../core/api/axios";
import { toast } from "react-toastify";
import { getAccessToken } from "../../core/utils/token";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  lang,
  setLang,
  dark,
  setDark,
}) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const { alerts } = useAlerts();
  const hasActiveAlerts = alerts.some((a) => a.active);
  const { user } = useAuth();

  // RBAC permissions for Users and System Settings
  const usersRBAC = useRBAC("Admin Settings", "Users");
  const systemSettingsRBAC = useRBAC("Admin Settings", "System Settings");
  
  // يظهر Change Password إذا:
  // 1. المستخدم موجود (user) - يمكنه تغيير كلمة مروره الخاصة
  // 2. أو المستخدم admin
  // 3. أو لديه صلاحية Edit/Full على Users أو System Settings
  const canChangePassword = useMemo(() => 
    user || // المستخدم نفسه يمكنه تغيير كلمة مروره
    (user?.isAdmin) || 
    usersRBAC.canPerformEdit || 
    usersRBAC.canManage ||
    systemSettingsRBAC.canPerformEdit ||
    systemSettingsRBAC.canManage,
    [user, usersRBAC.canPerformEdit, usersRBAC.canManage, systemSettingsRBAC.canPerformEdit, systemSettingsRBAC.canManage]
  );

  const navigate = useNavigate();
  const logoutMutation = useLogout(navigate);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 sm:h-16 bg-white dark:bg-gray-800
      border-b border-grayMedium dark:border-gray-700
      shadow-sm flex items-center justify-between
      px-3 sm:px-4 lg:px-6 xl:px-8
      sticky top-0 z-50
      backdrop-blur-sm bg-white/95 dark:bg-gray-800/95"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700"
        >
          <IoMenu className="text-xl text-grayText dark:text-gray-200" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language */}
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-bold transition-colors duration-200"
          aria-label={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>

        {/* Dark */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700 transition-colors duration-200 text-grayText dark:text-gray-300"
          aria-label={dark ? "Switch to light mode" : "التبديل للوضع الداكن"}
        >
          {dark ? <IoSunny className="text-lg" /> : <IoMoon className="text-lg" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setOpenNotifications((p) => !p)}
            className="relative p-2 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700 transition-colors duration-200 text-grayText dark:text-gray-300"
            aria-label={lang === "ar" ? "الإشعارات" : "Notifications"}
          >
            <IoNotificationsOutline className="text-xl" />
            {hasActiveAlerts && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
            )}
          </button>
          {openNotifications && <HeaderNotifications />}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="p-1 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700 transition-colors"
          >
            <IoPersonCircleOutline className="w-8 h-8 text-grayText dark:text-gray-300" />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-grayMedium dark:border-gray-700 rounded-xl shadow-xl w-56 z-50 animate-fade-in overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-grayMedium dark:border-gray-700 bg-primaryLighter/30 dark:bg-gray-700/30">
                <p className="text-sm font-semibold text-grayTextDark dark:text-white">
                  {lang === "ar" 
                    ? `${user?.firstNameAr || user?.firstName || ""} ${user?.lastNameAr || user?.lastName || ""}`.trim() || "مستخدم"
                    : `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User Name"}
                </p>
                <p className="text-xs text-grayTextLight dark:text-gray-400 mt-0.5">
                  {user?.email || "user@shifa.com"}
                </p>
                {user?.position && (
                  <p className="text-xs text-primary font-medium mt-1">
                    {lang === "ar" ? user?.positionAr || user?.position : user?.position}
                  </p>
                )}
              </div>

              {/* Change Password - يظهر للمستخدم نفسه دائماً أو لمن لديه صلاحية */}
              {canChangePassword && (
                <button 
                  onClick={() => {
                    setOpenProfile(false);
                    setOpenPasswordModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-grayText dark:text-gray-300 hover:bg-primaryLight dark:hover:bg-gray-700 transition-colors"
                >
                  <IoKeyOutline className="text-base" />
                  {lang === "ar"
                    ? "تغيير كلمة المرور"
                    : "Change Password"}
                </button>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  setOpenProfile(false);
                  logoutMutation.mutate();
                }}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-dangerLight dark:hover:bg-danger/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoLogOutOutline className="text-base" />
                {logoutMutation.isPending
                  ? (lang === "ar" ? "جاري الخروج..." : "Logging out...")
                  : (lang === "ar" ? "تسجيل الخروج" : "Logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal - For Current User */}
      {user && (
        <ChangePasswordModal
          open={openPasswordModal}
          user={user}
          lang={lang}
          onClose={() => setOpenPasswordModal(false)}
          onSave={async ({ UserId, Password }) => {
            try {
              await updateUserApi({ UserId, Password });
              toast.success(lang === "ar" ? "تم تحديث كلمة المرور بنجاح" : "Password updated successfully");
              setOpenPasswordModal(false);
            } catch {
              toast.error(lang === "ar" ? "فشل تحديث كلمة المرور" : "Failed to update password");
            }
          }}
        />
      )}
    </header>
  );
}

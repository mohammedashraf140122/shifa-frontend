import {
  IoMenu,
  IoSunny,
  IoMoon,
  IoNotificationsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { IoKeyOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../modules/Alerts/alerts.store";
import HeaderNotifications from "../../modules/Alerts/HeaderNotifications";
import { useLogout } from "../../hooks/useLogout";

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

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const { alerts } = useAlerts();
  const hasActiveAlerts = alerts.some((a) => a.active);

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
          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold"
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>

        {/* Dark */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700"
        >
          {dark ? <IoSunny /> : <IoMoon />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setOpenNotifications((p) => !p)}
            className="relative p-2 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700"
          >
            <IoNotificationsOutline className="text-xl" />
            {hasActiveAlerts && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>
          {openNotifications && <HeaderNotifications />}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="p-1 rounded-lg hover:bg-primaryLight dark:hover:bg-gray-700"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border rounded-xl shadow-xl w-52 z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">
                  {lang === "ar" ? "مستخدم" : "User Name"}
                </p>
                <p className="text-xs text-gray-500">user@shifa.com</p>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-primaryLight">
                <IoKeyOutline />
                {lang === "ar"
                  ? "تغيير كلمة المرور"
                  : "Change Password"}
              </button>

              {/* ✅ LOGOUT الحقيقي */}
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-dangerLight"
              >
                <IoLogOutOutline />
                {lang === "ar" ? "تسجيل الخروج" : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

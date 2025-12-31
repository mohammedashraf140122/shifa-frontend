import { IoChevronDownOutline } from "react-icons/io5";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildMenuItems } from "../../core/utils/menuBuilder";
import Logo from "../../assets/images/logo-en-ar.png";
import Logo00 from "../../assets/images/logo-mini.png";

export default function Sidebar({ open, lang }) {
  const [openGroup, setOpenGroup] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, permissionsMap, loading } = useAuth();

  // Track when data is actually loaded (not just fetching)
  useEffect(() => {
    if (!loading && user) {
      setIsInitialLoad(false);
    } else if (loading) {
      // Reset on new load
      setIsInitialLoad(true);
    }
  }, [loading, user]);

  const toggleGroup = (id) => {
    setOpenGroup(prev => (prev === id ? null : id));
  };

  const isPathActive = (path) => location.pathname === path;
  const isChildActive = (children) =>
    children?.some(child => location.pathname === child.path);

  // بناء menuItems ديناميكياً من modules المستخدم
  const menuItems = useMemo(() => {
    // During initial load, return empty to show loading
    if (loading && isInitialLoad) return [];
    
    // If no user after loading completes, return empty
    if (!loading && !user) return [];
    
    // If user exists but no modules, return empty
    if (!user?.modules || !Array.isArray(user.modules) || user.modules.length === 0) {
      return [];
    }
    
    return buildMenuItems(user.modules, lang, permissionsMap, user.isAdmin);
  }, [user, loading, lang, permissionsMap, user?.isAdmin, isInitialLoad]);

  return (
    <aside
  className={`
    ${open 
      ? "w-44 translate-x-0" 
      : "w-0 -translate-x-full lg:translate-x-0 lg:w-10"
    }
    bg-white dark:bg-gray-800
    border-r border-grayMedium dark:border-gray-700
    h-screen
    transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
    flex flex-col
    fixed lg:static
    z-40
    shadow-2xl lg:shadow-none
    overflow-y-auto overflow-x-hidden
  `}
>

      {/* Logo */}
      <div className={`h-10 lg:h-[80px] flex items-center
        ${open ? "justify-start px-4 opacity-100" : "justify-center px-0 opacity-0 lg:opacity-100"}
        border-b border-grayMedium dark:border-gray-700
        bg-primaryLighter/30 dark:bg-gray-700/30
        transition-all duration-500`}
      >
        <div className={`relative flex items-center justify-center shrink-0
          transition-all duration-500
          ${open ? "h-9 w-9 lg:h-10 lg:w-10" : "h-8 w-8"}`}>
          <img src={Logo00} className={`${open ? "opacity-0 absolute" : "opacity-100"} h-8`} />
          <img src={Logo} className={`${open ? "opacity-100 scale-[1.15]" : "opacity-0 absolute"} h-9`} />
        </div>

        {open && (
          <div className="ml-3">
            <span className="text-xs font-bold text-primary">
              {lang === "ar" ? "مستشفى شفاء" : "Shifa Hospital"}
            </span>
            <span className="block text-[10px] text-grayTextLight">
              {lang === "ar" ? "نظام الإدارة" : "Management System"}
            </span>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-1 scrollbar-thin scrollbar-thumb-grayMedium scrollbar-track-transparent">
        {loading && isInitialLoad ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-grayMedium border-t-primary mb-2"></div>
              <p className="text-xs text-grayTextLight">
                {lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <p className="text-xs text-grayTextLight">
                {lang === "ar" ? "لا توجد عناصر قائمة" : "No menu items"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;

              const childActive = isChildActive(item.children);
              const isActive = isPathActive(item.path) || childActive;

              const isGroupOpen =
                item.children &&
                open &&
                (openGroup === item.id || childActive);

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (!item.children) {
                        setOpenGroup(null);
                        item.path && navigate(item.path);
                      } else {
                        toggleGroup(item.id);
                      }
                    }}
                    className={`w-full flex items-center
                    ${open ? "justify-between px-2 py-2.5" : "justify-center px-0 py-2"}
                    rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-grayText dark:text-gray-300 hover:bg-primaryLight dark:hover:bg-gray-700"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`text-lg ${isActive ? "text-white" : ""}`} />
                      {open && (
                        <span className="text-xs font-medium">
                          {item.label[lang]}
                        </span>
                      )}
                    </div>

                    {item.children && open && (
                      <IoChevronDownOutline
                        className={`text-sm transition-transform duration-200 ${
                          isGroupOpen ? "rotate-180" : ""
                        } ${isActive ? "text-white" : "text-grayTextLight"}`}
                      />
                    )}
                  </button>

                  {item.children && open && isGroupOpen && (
                    <div className="ml-3 pl-2 border-l-2 border-primary/30 dark:border-primary/20 mt-1.5 space-y-1 animate-slide-down">
                      {item.children.map(sub => {
                        const SubIcon = sub.icon;
                        const isSubActive = isPathActive(sub.path);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setOpenGroup(item.id);
                              sub.path && navigate(sub.path);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[11px] transition-all duration-200
                            ${isSubActive
                              ? "bg-primary/20 text-primary dark:text-primary font-semibold shadow-sm"
                              : "text-grayTextLight dark:text-gray-400 hover:bg-primaryLight/50 dark:hover:bg-gray-700/50"}`}
                          >
                            <SubIcon className="text-sm" />
                            {sub.label[lang]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {open && (
        <div className="px-3 py-3 border-t text-center text-[10px] text-grayTextLight">
          Made with ❤️ by Shifa Application Team
        </div>
      )}
    </aside>
  );
}


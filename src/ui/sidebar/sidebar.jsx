import {
  IoHomeOutline,
  IoBarChartOutline,
  IoSettingsOutline,
  IoBriefcaseOutline,
  IoCallOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoOptionsOutline,
  IoChatbubblesOutline,
  IoMailOutline,
  IoNotificationsOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoMedkitOutline,
  IoHelpCircleOutline,
  IoChevronDownOutline,
  IoSettingsSharp,
  IoWallet,
  IoReceipt,
  IoReader,
} from "react-icons/io5";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo-en-ar.png";
import Logo00 from "../../assets/images/logo-mini.png";

export default function Sidebar({ open, lang }) {
  const [activeItem, setActiveItem] = useState("dashboard"); // متشالش
  const [openGroup, setOpenGroup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // الجديد فقط

  const toggleGroup = (id) => {
    setOpenGroup(prev => (prev === id ? null : id));
  };

  const isPathActive = (path) => location.pathname === path;
  const isChildActive = (children) =>
    children?.some(child => location.pathname === child.path);

  const menuItems = [
    { id: "dashboard", icon: IoHomeOutline, label: { ar: "لوحة التحكم", en: "Dashboard" }, path: "/dashboard" },
    { id: "chat", icon: IoChatbubblesOutline, label: { ar: "الشات", en: "Chat" }, path: "/chat" },

    {
      id: "recruitment",
      icon: IoBriefcaseOutline,
      label: { ar: "التوظيف", en: "Recruitment" },
      children: [
        { id: "job-posting", icon: IoDocumentTextOutline, label: { ar: "إعلانات الوظائف", en: "Job Posting" }, path: "/jobposting" },
        { id: "candidates", icon: IoPeopleOutline, label: { ar: "المرشحين", en: "Candidates" }, path: "/candidates" },
        { id: "quick-candidate", icon: IoPersonOutline, label: { ar: "مرشح سريع", en: "Quick Candidate" }, path: "/quickcandidate" },
        { id: "schedule", icon: IoCalendarOutline, label: { ar: "المواعيد", en: "Schedule" }, path: "/schedule" },
        { id: "interviews", icon: IoChatbubblesOutline, label: { ar: "المقابلات", en: "Interviews" }, path: "/interviews" },
        { id: "cv-bank", icon: IoDocumentTextOutline, label: { ar: "بنك السير الذاتية", en: "CV Bank" }, path: "/cvbank" },
      ],
    },

{
      id: "payroll",
      icon: IoWallet ,
      label: { ar: "الرواتب", en: "Payroll" },
      children: [
        { id: "medical-shits", icon: IoReceipt , label: { ar: "الورديات الطبية", en: "Medical Shifts" }, path: "/medicalshifts" },
        { id: "shits", icon: IoReader , label: { ar: "الورديات", en: "Shifts" }, path: "/shifts" },

      ],
    },


    {
      id: "call-center",
      icon: IoCallOutline,
      label: { ar: "الكول سنتر", en: "Call Center" },
      children: [
        { id: "clinics", icon: IoMedkitOutline, label: { ar: "العيادات", en: "Clinics" }, path: "/clinics" },
        { id: "services", icon: IoOptionsOutline, label: { ar: "الخدمات", en: "Services" }, path: "/services" },
        { id: "doctors", icon: IoPeopleOutline, label: { ar: "الأطباء", en: "Doctors" }, path: "/doctors" },
        { id: "faq", icon: IoHelpCircleOutline, label: { ar: "الأسئلة الشائعة", en: "FAQ" }, path: "/faq" },
      ],
    },

    { id: "contact", icon: IoMailOutline, label: { ar: "التواصل", en: "Contact" }, path: "/contact" },
    { id: "alerts", icon: IoNotificationsOutline, label: { ar: "التنبيهات", en: "Alerts" }, path: "/alerts" },

    {
      id: "admin-settings",
      icon: IoSettingsOutline,
      label: { ar: "إعدادات الأدمن", en: "Admin Settings" },
      children: [
        { id: "users", icon: IoPersonOutline, label: { ar: "المستخدمين", en: "Users" }, path: "/users" },
        { id: "roles", icon: IoShieldCheckmarkOutline, label: { ar: "الأدوار", en: "Roles" }, path: "/roles" },
        { id: "permissions", icon: IoOptionsOutline, label: { ar: "الصلاحيات", en: "Permissions" }, path: "/permissions" },
        { id: "system-settings", icon: IoSettingsSharp , label: { ar: "صلاحيات النظام", en: "system settings" }, path: "/systemsettings" },
      ],
    },
  ];

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
      <nav className="flex-1 overflow-y-auto py-3 px-1">
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
                      setActiveItem(item.id);
                      setOpenGroup(null);
                      item.path && navigate(item.path);
                    } else {
                      toggleGroup(item.id);
                    }
                  }}
                  className={`w-full flex items-center
                  ${open ? "justify-between px-1.5 py-2" : "justify-center px-0 py-1.5"}
                  rounded-xl transition-all
                  ${isActive
                    ? "bg-primary text-white"
                    : "text-grayText hover:bg-primaryLight"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="text-lg" />
                    {open && <span className="text-xs">{item.label[lang]}</span>}
                  </div>

                  {item.children && open && (
                    <IoChevronDownOutline
                      className={`text-sm transition-transform ${isGroupOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {item.children && open && isGroupOpen && (
                  <div className="ml-2 pl-1.5 border-l border-primary/20 mt-1 space-y-0.5">
                    {item.children.map(sub => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveItem(sub.id);
                            setOpenGroup(item.id);
                            sub.path && navigate(sub.path);
                          }}
                          className={`w-full flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-[11px]
                          ${isPathActive(sub.path)
                            ? "bg-primary/15 text-primary font-semibold"
                            : "text-grayTextLight hover:bg-primaryLight/50"}`}
                        >
                          <SubIcon className="text-base" />
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
      </nav>

      {open && (
        <div className="px-3 py-3 border-t text-center text-[10px] text-grayTextLight">
          Made with ❤️ by Shifa Application Team
        </div>
      )}
    </aside>
  );
}


import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IoShieldCheckmarkOutline, IoOptionsOutline } from "react-icons/io5";
import Role from "./RBAC/Role";
import Permission from "./RBAC/Permission";

export default function RBACManagement({ modules, subModules }) {
  const { lang } = useOutletContext();
  const [activeTab, setActiveTab] = useState("roles");

  const tabs = [
    {
      id: "roles",
      label: lang === "ar" ? "الأدوار" : "Roles",
      icon: IoShieldCheckmarkOutline,
    },
    {
      id: "permissions",
      label: lang === "ar" ? "الصلاحيات" : "Permissions",
      icon: IoOptionsOutline,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-left">
        {lang === "ar" ? "إدارة الأدوار والصلاحيات" : "RBAC Management"}
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-grayMedium mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium
                transition-all
                ${
                  isActive
                    ? "text-primary"
                    : "text-grayTextLight hover:text-primary"
                }`}
            >
              <Icon className="text-lg" />
              {tab.label}

              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === "roles" && <Role />}
        {activeTab === "permissions" && <Permission />}
      </div>
    </div>
  );
}

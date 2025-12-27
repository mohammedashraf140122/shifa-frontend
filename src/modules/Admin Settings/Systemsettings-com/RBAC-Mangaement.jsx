import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IoHome, IoLogoDocker } from "react-icons/io5";
import Permission from "./RBAC/Permission";
import Role from "./RBAC/Role";

export default function RBACManagement({ modules = [], subModules = [] }) {
  const { lang } = useOutletContext();
  const [activeTab, setActiveTab] = useState("permission");

  const tabs = [
    {
      id: "permission",
      label: lang === "ar" ? "الصلاحيات" : "Permission",
      icon: IoHome,
    },
    {
      id: "role",
      label: lang === "ar" ? "الأدوار" : "Role",
      icon: IoLogoDocker,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow">
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
                ${
                  isActive
                    ? "text-[#475569]"
                    : "text-grayTextLight hover:text-[#475569]"
                }`}
            >
              <Icon className="text-lg" />
              {tab.label}

              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#475569]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "permission" && (
        <Permission modules={modules} subModules={subModules} />
      )}

      {activeTab === "role" && <Role />}
    </div>
  );
}

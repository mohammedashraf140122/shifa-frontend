import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  IoHome,
  IoLogoDocker,
  IoLogoFirebase,
  IoApertureOutline,
} from "react-icons/io5";

import BranchSettings from "./Systemsettings-com/BranchSettings";
import ModulesSettings from "./Systemsettings-com/ModulesSettings";
import SubModulesSettings from "./Systemsettings-com/SubModulesSettings";
import RBACManagement from "./Systemsettings-com/RBAC-Mangaement";

export default function Systemsettings() {
  const { lang } = useOutletContext();
  const [activeTab, setActiveTab] = useState("branch");

  // 🔗 Shared State (هي دي أهم نقطة)
  const [modules, setModules] = useState([]);
  const [subModules, setSubModules] = useState([]);

  const tabs = [
    {
      id: "branch",
      label: lang === "ar" ? "الفروع" : "Branches",
      icon: IoHome,
    },
    {
      id: "modules",
      label: lang === "ar" ? "الوحدات" : "Modules",
      icon: IoLogoDocker,
    },
    {
      id: "submodules",
      label: lang === "ar" ? "الوحدات الفرعية" : "Sub Modules",
      icon: IoLogoFirebase,
    },
    {
      id: "rbac",
      label:
        lang === "ar"
          ? "إدارة الأدوار والصلاحيات"
          : "RBAC Management",
      icon: IoApertureOutline,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 text-left">
        {lang === "ar" ? "إعدادات النظام" : "System Settings"}
      </h1>

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
        {activeTab === "branch" && <BranchSettings />}

        {activeTab === "modules" && (
          <ModulesSettings
            modules={modules}
            setModules={setModules}
          />
        )}

        {activeTab === "submodules" && (
          <SubModulesSettings
            modules={modules}
            subModules={subModules}
            setSubModules={setSubModules}
          />
        )}

        {activeTab === "rbac" && (
          <RBACManagement
            modules={modules}
            subModules={subModules}
          />
        )}
      </div>
    </div>
  );
}

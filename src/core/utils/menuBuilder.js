import {
  IoHomeOutline,
  IoChatbubblesOutline,
  IoNotificationsOutline,
  IoMailOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoWallet,
  IoReceipt,
  IoReader,
  IoCallOutline,
  IoMedkitOutline,
  IoOptionsOutline,
  IoHelpCircleOutline,
  IoShieldCheckmarkOutline,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";

/* ================= ICONS ================= */

const MODULE_ICONS = {
  Dashboard: IoHomeOutline,
  Chat: IoChatbubblesOutline,
  Alerts: IoNotificationsOutline,
  Contact: IoMailOutline,
  Recruitment: IoBriefcaseOutline,
  Payroll: IoWallet,
  "Call Center": IoCallOutline,
  "Admin Settings": IoSettingsOutline,
};

const SUBMODULE_ICONS = {
  Chat: IoChatbubblesOutline,
  Alerts: IoNotificationsOutline,
  Users: IoPersonOutline,
  Roles: IoShieldCheckmarkOutline,
  Permissions: IoOptionsOutline,
  "System Settings": IoSettingsSharp,

  Candidates: IoPeopleOutline,
  "Quick Candidate": IoPersonOutline,
  Schedule: IoCalendarOutline,
  Interviews: IoChatbubblesOutline,
  "CV Bank": IoDocumentTextOutline,
  "Job Posting": IoDocumentTextOutline,

  "Medical Shifts": IoReceipt,
  Shifts: IoReader,

  Clinics: IoMedkitOutline,
  Services: IoOptionsOutline,
  Doctors: IoPeopleOutline,
  FAQ: IoHelpCircleOutline,
};

/* ================= PATHS ================= */

const SUBMODULE_PATHS = {
  Dashboard: "/dashboard",
  Chat: "/chat",
  Alerts: "/alerts",
  Contact: "/contact",

  Users: "/users",
  Roles: "/roles",
  Permissions: "/permissions",
  "System Settings": "/systemsettings",

  Candidates: "/candidates",
  "Quick Candidate": "/quickcandidate",
  Schedule: "/schedule",
  Interviews: "/interviews",
  "CV Bank": "/cvbank",
  "Job Posting": "/jobposting",

  "Medical Shifts": "/medicalshifts",
  Shifts: "/shifts",

  Clinics: "/clinics",
  Services: "/services",
  Doctors: "/doctors",
  FAQ: "/faq",
};

/* ================= HELPERS ================= */

const getModuleIcon = (name) =>
  MODULE_ICONS[name] || IoSettingsOutline;

const getSubModuleIcon = (name) =>
  SUBMODULE_ICONS[name] || IoOptionsOutline;

const getSubModulePath = (name) =>
  SUBMODULE_PATHS[name] || null;

/* ================= ORDER SUB-MODULES ================= */

const orderSubModules = (moduleName, children) => {
  if (moduleName !== "Admin Settings") return children;
  
  const order = ["Users", "Roles", "Permissions", "System Settings"];
  const ordered = [];
  const unordered = [];
  
  // ترتيب حسب order array
  order.forEach(name => {
    const found = children.find(child => child.label.en === name);
    if (found) ordered.push(found);
  });
  
  // إضافة الباقي
  children.forEach(child => {
    if (!order.includes(child.label.en)) {
      unordered.push(child);
    }
  });
  
  return [...ordered, ...unordered];
};

/* ================= PERMISSION CHECK ================= */

const hasPermission = (
  moduleNameEn,
  subModuleNameEn,
  permissionsMap,
  isAdmin
) => {
  if (isAdmin) return true;

  if (!permissionsMap || Object.keys(permissionsMap).length === 0) {
    return false;
  }

  const modulePerms = permissionsMap[moduleNameEn];
  if (!modulePerms) return false;

  const subPerms = modulePerms[subModuleNameEn];
  if (!subPerms || subPerms.length === 0) return false;

  return true;
};

/* ================= BUILDER ================= */

export const buildMenuItems = (
  modules = [],
  lang = "en",
  permissionsMap = {},
  isAdmin = false
) => {
  if (!modules.length) return [];

  const menu = [];

  // Map لتجميع الموديولات المكررة ودمج السب موديولات
  // استخدام moduleName كـ key لأن moduleId قد يكون مختلفاً لنفس الموديول من رولات مختلفة
  const modulesMap = new Map();

  modules.forEach((module) => {
    const moduleNameEn = module.moduleName?.trim();
    const moduleId = module.moduleId;

    if (!module.subModules?.length || !moduleNameEn) return;

    // استخدام moduleName كـ key للتمييز بين الموديولات (حتى لو كان moduleId مختلف)
    if (modulesMap.has(moduleNameEn)) {
      const existingModule = modulesMap.get(moduleNameEn);
      const existingSubModuleKeys = new Set(
        existingModule.children.map(child => `${child.id}-${child.label.en}`)
      );

      // إضافة السب موديولات الجديدة فقط (بدون تكرار)
      // التحقق من الاسم والـ id معاً
      module.subModules.forEach((sub) => {
        const subNameEn = sub.subModuleName?.trim();
        const path = getSubModulePath(subNameEn);
        const subModuleKey = `${sub.subModuleId}-${subNameEn}`;

        if (path && !existingSubModuleKeys.has(subModuleKey)) {
          existingModule.children.push({
            id: sub.subModuleId,
            icon: getSubModuleIcon(subNameEn),
            label: {
              ar: sub.subModuleNameAr,
              en: sub.subModuleName,
            },
            path,
          });
          existingSubModuleKeys.add(subModuleKey);
        }
      });
      
      // ترتيب sub-modules بعد إضافة الجديدة
      if (existingModule.children.length > 0) {
        existingModule.children = orderSubModules(moduleNameEn, existingModule.children);
      }
    } else {
      // موديول جديد - إضافته
      const moduleIcon = getModuleIcon(moduleNameEn);
      const children = [];
      const addedSubModuleKeys = new Set();

      module.subModules.forEach((sub) => {
        const subNameEn = sub.subModuleName?.trim();
        const path = getSubModulePath(subNameEn);
        const subModuleKey = `${sub.subModuleId}-${subNameEn}`;

        // التحقق من الاسم والـ id معاً لمنع التكرار
        if (path && !addedSubModuleKeys.has(subModuleKey)) {
          children.push({
            id: sub.subModuleId,
            icon: getSubModuleIcon(subNameEn),
            label: {
              ar: sub.subModuleNameAr,
              en: sub.subModuleName,
            },
            path,
          });
          addedSubModuleKeys.add(subModuleKey);
        }
      });

      if (children.length) {
        // استخدام moduleName كـ id موحد لضمان عدم التكرار
        modulesMap.set(moduleNameEn, {
          id: moduleNameEn, // استخدام moduleName كـ id موحد
          icon: moduleIcon,
          label: {
            ar: module.moduleNameAr,
            en: module.moduleName,
          },
          children: orderSubModules(moduleNameEn, children),
        });
      }
    }
  });

  // ترتيب الموديولات حسب الترتيب الأصلي
  const orderedModuleNames = [
    "Dashboard",
    "Chat",
    "Alerts",
    "Contact",
    "Recruitment",
    "Payroll",
    "Call Center",
    "Admin Settings", // Admin Settings في النهاية
  ];

  // إضافة الموديولات حسب الترتيب المحدد
  orderedModuleNames.forEach((moduleName) => {
    const module = modulesMap.get(moduleName);
    if (module) {
      menu.push(module);
    }
  });

  // إضافة أي موديولات أخرى لم تكن في القائمة المحددة
  modulesMap.forEach((module, moduleName) => {
    if (!orderedModuleNames.includes(moduleName)) {
      menu.push(module);
    }
  });

  return menu;
};

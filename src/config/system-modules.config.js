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
} from "react-icons/io5";

export const SYSTEM_MODULES = [
  // =========================
  // Modules بدون Sub Modules
  // =========================
  {
    id: "dashboard",
    icon: IoHomeOutline,
    label: { ar: "لوحة التحكم", en: "Dashboard" },
    path: "/dashboard",
    children: [],
  },
  {
    id: "chat",
    icon: IoChatbubblesOutline,
    label: { ar: "الشات", en: "Chat" },
    path: "/chat",
    children: [],
  },
  {
    id: "alerts",
    icon: IoNotificationsOutline,
    label: { ar: "التنبيهات", en: "Alerts" },
    path: "/alerts",
    children: [],
  },
  {
    id: "contact",
    icon: IoMailOutline,
    label: { ar: "التواصل", en: "Contact" },
    path: "/contact",
    children: [],
  },

  // =========================
  // Recruitment
  // =========================
  {
    id: "recruitment",
    icon: IoBriefcaseOutline,
    label: { ar: "التوظيف", en: "Recruitment" },
    children: [
      {
        id: "job-posting",
        icon: IoDocumentTextOutline,
        label: { ar: "إعلانات الوظائف", en: "Job Posting" },
        path: "/jobposting",
      },
      {
        id: "candidates",
        icon: IoPeopleOutline,
        label: { ar: "المرشحين", en: "Candidates" },
        path: "/candidates",
      },
      {
        id: "quick-candidate",
        icon: IoPersonOutline,
        label: { ar: "مرشح سريع", en: "Quick Candidate" },
        path: "/quickcandidate",
      },
      {
        id: "schedule",
        icon: IoCalendarOutline,
        label: { ar: "المواعيد", en: "Schedule" },
        path: "/schedule",
      },
    ],
  },

  // =========================
  // Payroll
  // =========================
  {
    id: "payroll",
    icon: IoWallet,
    label: { ar: "الرواتب", en: "Payroll" },
    children: [
      {
        id: "medical-shifts",
        icon: IoReceipt,
        label: { ar: "الورديات الطبية", en: "Medical Shifts" },
        path: "/medicalshifts",
      },
      {
        id: "shifts",
        icon: IoReader,
        label: { ar: "الورديات", en: "Shifts" },
        path: "/shifts",
      },
    ],
  },

  // =========================
  // Call Center
  // =========================
  {
    id: "call-center",
    icon: IoCallOutline,
    label: { ar: "الكول سنتر", en: "Call Center" },
    children: [
      {
        id: "clinics",
        icon: IoMedkitOutline,
        label: { ar: "العيادات", en: "Clinics" },
        path: "/clinics",
      },
      {
        id: "services",
        icon: IoOptionsOutline,
        label: { ar: "الخدمات", en: "Services" },
        path: "/services",
      },
      {
        id: "doctors",
        icon: IoPeopleOutline,
        label: { ar: "الأطباء", en: "Doctors" },
        path: "/doctors",
      },
      {
        id: "faq",
        icon: IoHelpCircleOutline,
        label: { ar: "الأسئلة الشائعة", en: "FAQ" },
        path: "/faq",
      },
    ],
  },
];

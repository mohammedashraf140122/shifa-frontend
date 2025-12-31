import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoClose,
} from "react-icons/io5";
import {
  getModules,
  addModules,
  updateModules,
  deleteModules,
} from "../../../core/api/axios";
import { toast } from "react-toastify";
import { devError } from "../../../core/utils/devLog";
import useRBAC from "../../../hooks/useRBAC";
import { useAuth } from "../../../context/AuthContext";
import ActionButtons from "../../../components/RBAC/ActionButtons";

export default function ModulesSettings({ modules, setModules }) {
  const { lang } = useOutletContext();
  const { loading } = useAuth();

  /* ================= RBAC ================= */
  const rbac = useRBAC("Admin Settings", "System Settings");

  const t = {
    title: lang === "ar" ? "الوحدات" : "Modules",
    desc:
      lang === "ar"
        ? "إدارة الوحدات الرئيسية للنظام"
        : "Manage main system modules.",
    add: lang === "ar" ? "إضافة وحدة" : "Add Module",
    arPlaceholder: "اسم الوحدة بالعربي",
    enPlaceholder: "Module name in English",
  };

  /* =======================
     GET MODULES
  ======================= */
  useEffect(() => {
    if (rbac.canRead) fetchModules();
  }, [rbac.canRead]);

  const fetchModules = async () => {
    try {
      const res = await getModules();

      const formatted = res.data.Modules.map(m => ({
        id: m.ModuleID,
        name: {
          ar: m.ModuleNameAr || "",
          en: m.ModuleName || "",
        },
        editing: false,
        isNew: false,
      }));

      setModules(formatted);
    } catch (err) {
      devError("Load modules failed", err);
      toast.error("Failed to load modules");
    }
  };

  /* =======================
     ADD MODULE (UI)
  ======================= */
  const addModule = () => {
    if (!rbac.canPerformCreate) return;
    
    setModules(prev => [
      ...prev,
      {
        id: Date.now(), // مؤقت
        name: { ar: "", en: "" },
        editing: true,
        isNew: true,
      },
    ]);
  };

  /* =======================
     UPDATE NAME (LOCAL)
  ======================= */
  const updateName = (id, field, value) => {
    setModules(prev =>
      prev.map(m =>
        m.id === id ? { ...m, name: { ...m.name, [field]: value } } : m
      )
    );
  };

  /* =======================
     SAVE MODULE (API)
  ======================= */
  const saveModule = async (id) => {
    if (!rbac.canPerformEdit) return;
    
    const module = modules.find(m => m.id === id);
    if (!module) return;

    try {
      // 🟢 ADD
      if (module.isNew) {
        const res = await addModules([
          {
            ModuleName: module.name.en,
            ModuleNameAr: module.name.ar,
          },
        ]);

        const created = res.data.addedModules?.[0];

        setModules(prev =>
          prev.map(m =>
            m.id === id
              ? {
                  ...m,
                  id: created.ModuleID, // ✅ ID الحقيقي
                  editing: false,
                  isNew: false,
                }
              : m
          )
        );

        toast.success(
          lang === "ar"
            ? "تم إضافة الوحدة بنجاح"
            : "Module added successfully"
        );
      }
      // 🔵 UPDATE
      else {
        await updateModules([
          {
            ModuleID: module.id,
            NewName: module.name.en,
            NewNameAr: module.name.ar,
          },
        ]);

        setModules(prev =>
          prev.map(m =>
            m.id === id ? { ...m, editing: false } : m
          )
        );

        toast.success(
          lang === "ar"
            ? "تم تعديل الوحدة بنجاح"
            : "Module updated successfully"
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (lang === "ar"
          ? "فشل حفظ الوحدة"
          : "Failed to save module");

      toast.error(msg);
    }
  };

  /* =======================
     DELETE MODULE (TOAST CONFIRM)
  ======================= */
  const deleteModule = (id) => {
    if (!rbac.canPerformDelete) return;
    
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm">
            {lang === "ar"
              ? "هل أنت متأكد من حذف هذه الوحدة؟"
              : "Are you sure you want to delete this module?"}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                closeToast();

                try {
                  await deleteModules([id]);

                  setModules(prev =>
                    prev.filter(m => m.id !== id)
                  );

                  toast.success(
                    lang === "ar"
                      ? "تم حذف الوحدة بنجاح"
                      : "Module deleted successfully"
                  );
                } catch (err) {
                  const serverMessage =
                    err?.response?.data?.error ||
                    err?.response?.data?.message;

                  if (
                    serverMessage?.includes(
                      "FK_SubModules_Modules"
                    )
                  ) {
                    toast.error(
                      lang === "ar"
                        ? "لا يمكن حذف هذه الوحدة لأنها مرتبطة بوحدات فرعية"
                        : "This module cannot be deleted because it has sub-modules"
                    );
                    return;
                  }

                  toast.error(
                    serverMessage ||
                      (lang === "ar"
                        ? "حدث خطأ أثناء حذف الوحدة"
                        : "An error occurred while deleting the module")
                  );
                }
              }}
              className="px-3 py-1 text-xs rounded bg-danger text-white"
            >
              {lang === "ar" ? "حذف" : "Delete"}
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  /* =======================
     CANCEL EDIT
  ======================= */
  const cancelEdit = (id) => {
    setModules(prev =>
      prev
        .filter(m => !(m.id === id && m.isNew))
        .map(m =>
          m.id === id ? { ...m, editing: false } : m
        )
    );
  };

  /* =======================
     LOADING GUARD
  ======================= */
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-grayMedium p-6 text-center">
        <p className="text-sm text-grayTextLight">
          {lang === "ar" ? "جاري تحميل الصلاحيات..." : "Loading permissions..."}
        </p>
      </div>
    );
  }

  /* =======================
     PERMISSION GUARD
  ======================= */
  if (!rbac.canRead) {
    return (
      <div className="bg-white rounded-xl border border-grayMedium p-6 text-center">
        <p className="text-sm text-grayTextLight">
          {lang === "ar" ? "ليس لديك صلاحية لعرض هذه الصفحة" : "You don't have permission to view this page"}
        </p>
      </div>
    );
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-grayTextLight">{t.desc}</p>
        </div>

        {rbac.showCreateButton && (
          <button
            onClick={addModule}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primaryDark transition-colors"
          >
            {t.add}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-grayMedium">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-grayMedium">
            {modules.map(module => {
              const canSave =
                module.name.ar.trim() &&
                module.name.en.trim();

              return (
                <tr key={module.id} className="hover:bg-grayLight/60">
                  <td className="px-4 py-3">
                    {module.editing ? (
                      <div className="space-y-2">
                        <input
                          dir="rtl"
                          placeholder={t.arPlaceholder}
                          value={module.name.ar}
                          onChange={e =>
                            updateName(module.id, "ar", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <input
                          dir="ltr"
                          placeholder={t.enPlaceholder}
                          value={module.name.en}
                          onChange={e =>
                            updateName(module.id, "en", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    ) : (
                      <span>{module.name[lang]}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {module.editing ? (
                      <div className="flex justify-end gap-2">
                        {rbac.canPerformEdit && (
                          <button
                            disabled={!canSave}
                            onClick={() => saveModule(module.id)}
                            className={
                              canSave
                                ? "text-success"
                                : "text-gray-300 cursor-not-allowed"
                            }
                          >
                            <IoCheckmarkDone className="text-xl" />
                          </button>
                        )}
                        <button
                          onClick={() => cancelEdit(module.id)}
                          className="text-danger"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </div>
                    ) : (
                      <ActionButtons
                        moduleName="Admin Settings"
                        subModuleName="System Settings"
                        onEdit={() => {
                          setModules(prev =>
                            prev.map(m =>
                              m.id === module.id
                                ? { ...m, editing: true }
                                : m
                            )
                          );
                        }}
                        onDelete={() => deleteModule(module.id)}
                        editLabel={lang === "ar" ? "تعديل" : "Edit"}
                        deleteLabel={lang === "ar" ? "حذف" : "Delete"}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

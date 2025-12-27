import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoClose,
  IoTrashOutline,
} from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  getModules,
  addModules,
  updateModules,
  deleteModules,
} from "../../../core/api/axios";
import { toast } from "react-toastify";

export default function ModulesSettings({ modules, setModules }) {
  const { lang } = useOutletContext();

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
    fetchModules();
  }, []);

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
      console.error("Load modules failed", err);
    }
  };

  /* =======================
     ADD MODULE (UI)
  ======================= */
  const addModule = () => {
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
     UI (UNCHANGED)
  ======================= */
  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-grayTextLight">{t.desc}</p>
        </div>

        <button
          onClick={addModule}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white"
        >
          {t.add}
        </button>
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
                        <button
                          onClick={() => cancelEdit(module.id)}
                          className="text-danger"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setModules(prev =>
                              prev.map(m =>
                                m.id === module.id
                                  ? { ...m, editing: true }
                                  : m
                              )
                            )
                          }
                          className="text-primary hover:text-primaryDark"
                        >
                          <HiOutlinePencilSquare />
                        </button>

                        <button
                          onClick={() => deleteModule(module.id)}
                          className="text-danger hover:text-dangerDark"
                        >
                          <IoTrashOutline className="text-lg" />
                        </button>
                      </div>
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

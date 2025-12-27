import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoClose,
  IoTrashOutline,
} from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  getSubModules,
  addSubModules,
  updateSubModules,
  deleteSubModules,
} from "../../../core/api/axios";
import { toast } from "react-toastify";

export default function SubModulesSettings({
  modules,
  subModules,
  setSubModules,
}) {
  const { lang } = useOutletContext();

  const t = {
    title: lang === "ar" ? "الوحدات الفرعية" : "Sub Modules",
    desc:
      lang === "ar"
        ? "الوحدات التابعة للوحدات الرئيسية"
        : "Sub modules under main modules.",
    add: lang === "ar" ? "إضافة وحدة فرعية" : "Add Sub Module",
  };

  /* =======================
     GET SUB MODULES
  ======================= */
  useEffect(() => {
    fetchSubModules();
  }, []);

  const fetchSubModules = async () => {
    try {
      const res = await getSubModules();

      const formatted = res.data.SubModules.map(sm => ({
        id: sm.SubModuleID,
        parentId: sm.ModuleID,
        name: {
          ar: sm.SubModuleNameAr || "",
          en: sm.SubModuleName || "",
        },
        editing: false,
        isNew: false,
      }));

      setSubModules(formatted);
    } catch (err) {
      console.error("Load sub modules failed", err);
    }
  };

  /* =======================
     ADD SUB MODULE (UI)
  ======================= */
  const addSubModule = () => {
    setSubModules(prev => [
      ...prev,
      {
        id: Date.now(), // مؤقت
        parentId: "",
        name: { ar: "", en: "" },
        editing: true,
        isNew: true,
      },
    ]);
  };

  /* =======================
     UPDATE FIELD
  ======================= */
  const updateField = (id, field, value) => {
    setSubModules(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const updateName = (id, langKey, value) => {
    setSubModules(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, name: { ...s.name, [langKey]: value } }
          : s
      )
    );
  };

  /* =======================
     SAVE SUB MODULE
  ======================= */
  const saveSubModule = async (id) => {
    const sm = subModules.find(s => s.id === id);
    if (!sm) return;

    try {
      // 🟢 ADD
      if (sm.isNew) {
        const res = await addSubModules([
          {
            ModuleID: sm.parentId,
            SubModuleName: sm.name.en,
            SubModuleNameAr: sm.name.ar,
          },
        ]);

        const created = res.data.addedSubModules?.[0];

        setSubModules(prev =>
          prev.map(s =>
            s.id === id
              ? {
                  ...s,
                  id: created.SubModuleID,
                  editing: false,
                  isNew: false,
                }
              : s
          )
        );

        toast.success(
          lang === "ar"
            ? "تم إضافة الوحدة الفرعية بنجاح"
            : "Sub module added successfully"
        );
      }
      // 🔵 UPDATE
      else {
        await updateSubModules([
          {
            SubModuleID: sm.id,
            NewName: sm.name.en,
            NewNameAr: sm.name.ar,
          },
        ]);

        setSubModules(prev =>
          prev.map(s =>
            s.id === id ? { ...s, editing: false } : s
          )
        );

        toast.success(
          lang === "ar"
            ? "تم تعديل الوحدة الفرعية بنجاح"
            : "Sub module updated successfully"
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (lang === "ar"
          ? "فشل حفظ الوحدة الفرعية"
          : "Failed to save sub module");

      toast.error(msg);
    }
  };

  /* =======================
     DELETE SUB MODULE
  ======================= */
  const deleteSubModule = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm">
            {lang === "ar"
              ? "هل أنت متأكد من حذف هذه الوحدة الفرعية؟"
              : "Are you sure you want to delete this sub module?"}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                closeToast();

                try {
                  await deleteSubModules([id]);

                  setSubModules(prev =>
                    prev.filter(s => s.id !== id)
                  );

                  toast.success(
                    lang === "ar"
                      ? "تم حذف الوحدة الفرعية بنجاح"
                      : "Sub module deleted successfully"
                  );
                } catch (err) {
                  const serverMessage =
                    err?.response?.data?.error ||
                    err?.response?.data?.message;

                  toast.error(
                    serverMessage ||
                      (lang === "ar"
                        ? "حدث خطأ أثناء حذف الوحدة الفرعية"
                        : "An error occurred while deleting the sub module")
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
    setSubModules(prev =>
      prev
        .filter(s => !(s.id === id && s.isNew))
        .map(s =>
          s.id === id ? { ...s, editing: false } : s
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
          onClick={addSubModule}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-white"
        >
          {t.add}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-grayMedium">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-grayMedium">
            {subModules.map(sm => {
              const canSave =
                sm.parentId &&
                sm.name.ar.trim() &&
                sm.name.en.trim();

              return (
                <tr key={sm.id}>
                  <td className="px-4 py-3 space-y-2">
                    {sm.editing ? (
                      <>
                        <select
                          value={sm.parentId}
                          onChange={e =>
                            updateField(
                              sm.id,
                              "parentId",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">
                            {lang === "ar"
                              ? "اختر الوحدة"
                              : "Select Module"}
                          </option>
                          {modules.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name[lang]}
                            </option>
                          ))}
                        </select>

                        <input
                          dir="rtl"
                          placeholder="اسم الوحدة الفرعية بالعربي"
                          value={sm.name.ar}
                          onChange={e =>
                            updateName(sm.id, "ar", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />

                        <input
                          dir="ltr"
                          placeholder="Sub module name in English"
                          value={sm.name.en}
                          onChange={e =>
                            updateName(sm.id, "en", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </>
                    ) : (
                      <span>{sm.name[lang]}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {sm.editing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={!canSave}
                          onClick={() => saveSubModule(sm.id)}
                          className={
                            canSave
                              ? "text-success"
                              : "text-gray-300"
                          }
                        >
                          <IoCheckmarkDone />
                        </button>

                        <button
                          onClick={() => cancelEdit(sm.id)}
                          className="text-danger"
                        >
                          <IoClose />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setSubModules(prev =>
                              prev.map(s =>
                                s.id === sm.id
                                  ? { ...s, editing: true }
                                  : s
                              )
                            )
                          }
                          className="text-primary"
                        >
                          <HiOutlinePencilSquare />
                        </button>

                        <button
                          onClick={() => deleteSubModule(sm.id)}
                          className="text-danger"
                        >
                          <IoTrashOutline />
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

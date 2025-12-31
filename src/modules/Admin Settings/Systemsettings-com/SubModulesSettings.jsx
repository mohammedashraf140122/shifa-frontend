import { useEffect, useMemo, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  IoCheckmarkDone,
  IoClose,
} from "react-icons/io5";
import {
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import {
  getSubModules,
  addSubModules,
  updateSubModules,
  deleteSubModules,
} from "../../../core/api/axios";
import { toast } from "react-toastify";
import useRBAC from "../../../hooks/useRBAC";
import { useAuth } from "../../../context/AuthContext";
import ActionButtons from "../../../components/RBAC/ActionButtons";

export default function SubModulesSettings({
  modules,
  subModules,
  setSubModules,
}) {
  const { lang } = useOutletContext();
  const { loading } = useAuth();

  /* ================= RBAC ================= */
  const rbac = useRBAC("Admin Settings", "System Settings");

  /* ================= TEXT ================= */
  const t = {
    title: lang === "ar" ? "الوحدات الفرعية" : "Sub Modules",
    desc:
      lang === "ar"
        ? "الوحدات التابعة للوحدات الرئيسية"
        : "Sub modules under main modules.",
    add: lang === "ar" ? "إضافة وحدة فرعية" : "Add Sub Module",
    search:
      lang === "ar"
        ? "بحث بالوحدة أو الوحدة الفرعية"
        : "Search by module or sub module",
  };

  /* ================= STATE ================= */
  const [search, setSearch] = useState("");
  
  /* ================= REFS ================= */
  // Prevent infinite loop: only fetch once when canRead becomes true
  const fetchedOnce = useRef(false);
  const lastCanRead = useRef(rbac.canRead);

  /* ================= LOAD ================= */
  useEffect(() => {
    // ❌ Don't fetch if no read permission
    if (!rbac.canRead) {
      fetchedOnce.current = false; // Reset when permission is lost
      return;
    }

    // ❌ Don't fetch if already fetched (prevent infinite loop)
    if (fetchedOnce.current) {
      // Only reset if canRead changed from false to true
      if (!lastCanRead.current && rbac.canRead) {
        fetchedOnce.current = false; // Allow refetch if permission was regained
      } else {
        return;
      }
    }

    // Track current canRead state
    lastCanRead.current = rbac.canRead;

    // Mark as fetched to prevent duplicate calls
    fetchedOnce.current = true;

    fetchSubModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rbac.canRead]);

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
    } catch (error) {
      // Handle 403 specifically - don't show error toast, just log warning
      if (error.response?.status === 403) {
        console.warn("⛔ 403 Forbidden - No backend permission for /users/subModules");
        // Don't setState here to prevent re-render loop
        // Don't show toast to avoid spam
        return;
      }
      
      // For other errors, show toast
      toast.error("Failed to load sub modules");
    }
  };

  /* ================= ADD ================= */
  const addSubModule = () => {
    if (!rbac.canPerformCreate) return;

    setSubModules(prev => [
      {
        id: Date.now(),
        parentId: "",
        name: { ar: "", en: "" },
        editing: true,
        isNew: true,
      },
      ...prev,
    ]);
  };

  /* ================= UPDATE HELPERS ================= */
  const updateField = (id, field, value) => {
    setSubModules(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const updateName = (id, key, value) => {
    setSubModules(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, name: { ...s.name, [key]: value } }
          : s
      )
    );
  };

  /* ================= SAVE ================= */
  const saveSubModule = async id => {
    if (!rbac.canPerformEdit) return;

    const sm = subModules.find(s => s.id === id);
    if (!sm) return;

    if (!sm.parentId || !sm.name.ar.trim() || !sm.name.en.trim()) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
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

        toast.success("Sub module added successfully");
      } else {
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

        toast.success("Sub module updated successfully");
      }
    } catch {
      toast.error("Save failed");
    }
  };

  /* ================= CANCEL ================= */
  const cancelEdit = id => {
    setSubModules(prev =>
      prev
        .filter(s => !(s.id === id && s.isNew))
        .map(s =>
          s.id === id ? { ...s, editing: false } : s
        )
    );
  };

  /* ================= DELETE ================= */
  const deleteSubModule = id => {
    if (!rbac.canPerformDelete) return;

    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm">
            {lang === "ar"
              ? "هل أنت متأكد من الحذف؟"
              : "Confirm delete?"}
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
                  toast.success("Deleted successfully");
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="px-3 py-1 text-xs rounded bg-danger text-white"
            >
              {lang === "ar" ? "حذف" : "Delete"}
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-200"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    if (!search.trim()) return subModules;
    return subModules.filter(sm => {
      const moduleName =
        modules.find(m => m.id === sm.parentId)?.name[lang] || "";
      return (
        sm.name[lang]
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        moduleName
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, subModules, modules, lang]);

  /* ================= LOADING GUARD ================= */
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-grayMedium p-6 text-center">
        <p className="text-sm text-grayTextLight">
          {lang === "ar" ? "جاري تحميل الصلاحيات..." : "Loading permissions..."}
        </p>
      </div>
    );
  }

  /* ================= PERMISSION GUARD ================= */
  if (!rbac.canRead) {
    return (
      <div className="bg-white rounded-xl border border-grayMedium p-6 text-center">
        <p className="text-sm text-grayTextLight">
          {lang === "ar" ? "ليس لديك صلاحية لعرض هذه الصفحة" : "You don't have permission to view this page"}
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-grayTextLight">{t.desc}</p>
        </div>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search}
              className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
            />
          </div>

          {rbac.showCreateButton && (
            <button
              onClick={addSubModule}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primaryDark transition-colors"
            >
              {t.add}
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-grayMedium overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-grayLight">
            <tr>
              <th className="px-4 py-3 text-left">Sub Module</th>
              <th className="px-4 py-3 text-left">Module</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-grayMedium">
            {filtered.map(sm => {
              const canSave =
                sm.parentId &&
                sm.name.ar.trim() &&
                sm.name.en.trim();

              return (
                <tr key={sm.id}>
                  <td className="px-4 py-3">
                    {sm.editing ? (
                      <>
                        <input
                          dir="rtl"
                          placeholder="اسم الوحدة بالعربي"
                          value={sm.name.ar}
                          onChange={e =>
                            updateName(sm.id, "ar", e.target.value)
                          }
                          className="w-full mb-2 px-3 py-2 border rounded-md"
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
                      sm.name[lang]
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {sm.editing ? (
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
                        <option value="">Select Module</option>
                        {modules.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name[lang]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      modules.find(m => m.id === sm.parentId)
                        ?.name[lang]
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {sm.editing ? (
                      <div className="flex justify-end gap-2">
                        {rbac.canPerformEdit && (
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
                        )}
                        <button
                          onClick={() => cancelEdit(sm.id)}
                          className="text-danger"
                        >
                          <IoClose />
                        </button>
                      </div>
                    ) : (
                      <ActionButtons
                        moduleName="Admin Settings"
                        subModuleName="System Settings"
                        onEdit={() => updateField(sm.id, "editing", true)}
                        onDelete={() => deleteSubModule(sm.id)}
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

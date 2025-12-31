import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { IoCheckmarkDone, IoClose } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBranches,
  addBranches,
  updateBranches,
} from "../../../core/api/axios";
import useRBAC from "../../../hooks/useRBAC";
import { useAuth } from "../../../context/AuthContext";

// Query keys
const BRANCHES_QUERY_KEY = ["branches"];

export default function BranchSettings() {
  const { lang } = useOutletContext();
  const queryClient = useQueryClient();
  const { loading: authLoading } = useAuth();
  
  // RBAC permissions
  const rbac = useRBAC("Admin Settings", "System Settings");

  const t = {
    title: lang === "ar" ? "الفروع" : "Branches",
    desc:
      lang === "ar"
        ? "إدارة جميع فروع النظام من هنا"
        : "Manage all system branches here.",
    add: lang === "ar" ? "إضافة فرع" : "Add Branch",
    name: lang === "ar" ? "اسم الفرع" : "Branch Name",
    arPlaceholder: "اسم الفرع بالعربي",
    enPlaceholder: "Branch name in English",
    loadError: lang === "ar" ? "فشل تحميل الفروع" : "Failed to load branches",
    saveSuccess:
      lang === "ar" ? "تم حفظ الفرع بنجاح" : "Branch saved successfully",
    saveError:
      lang === "ar" ? "فشل حفظ الفرع" : "Failed to save branch",
  };

  const [branches, setBranches] = useState([]);

  // Fetch branches using React Query
  const {
    data: branchesData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: BRANCHES_QUERY_KEY,
    queryFn: async () => {
      const res = await getBranches();
      const formatted = res.data.Branches.map(b => ({
        id: b.BranchID,
        name: {
          ar: b.BranchNameAr || "",
          en: b.BranchName || "",
        },
        tempName: { ar: "", en: "" },
        editing: false,
        isNew: false,
      }));
      return formatted;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error toast
  useEffect(() => {
    if (error) {
      const status = error?.response?.status;
      let msg;
      
      if (status === 502 || status === 503) {
        msg = error?.response?.data?.message || 
          (lang === "ar" ? "الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً." : "Service is temporarily unavailable. Please try again later.");
      } else if (status === 500) {
        msg = error?.response?.data?.message || 
          (lang === "ar" ? "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً." : "Server error. Please try again later.");
      } else {
        msg = error?.response?.data?.message || error?.message || t.loadError;
      }
      
      toast.error(msg);
    }
  }, [error, t.loadError, lang]);

  // Update branches when data changes
  useEffect(() => {
    if (branchesData) {
      setBranches(branchesData);
    }
  }, [branchesData]);

  // Add mutation
  const addMutation = useMutation({
    mutationFn: (branch) =>
      addBranches([
        {
          BranchName: branch.tempName.en,
          BranchNameAr: branch.tempName.ar,
        },
      ]),
    onSuccess: () => {
      toast.success(t.saveSuccess);
      queryClient.invalidateQueries({ queryKey: BRANCHES_QUERY_KEY });
    },
    onError: () => {
      toast.error(t.saveError);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (branch) =>
      updateBranches([
        {
          BranchID: branch.id,
          NewName: branch.tempName.en,
          NewNameAr: branch.tempName.ar,
        },
      ]),
    onSuccess: () => {
      toast.success(t.saveSuccess);
      queryClient.invalidateQueries({ queryKey: BRANCHES_QUERY_KEY });
    },
    onError: () => {
      toast.error(t.saveError);
    },
  });

  /* =======================
     ADD BRANCH (UI)
  ======================= */
  const addBranch = () => {
    // Permission guard
    if (!rbac.canPerformCreate) {
      toast.error(lang === "ar" ? "ليس لديك صلاحية لإضافة فرع" : "You don't have permission to add branch");
      return;
    }
    
    setBranches(prev => [
      ...prev,
      {
        id: Date.now(),
        name: { ar: "", en: "" },
        tempName: { ar: "", en: "" },
        editing: true,
        isNew: true,
      },
    ]);
  };

  /* =======================
     START EDIT
  ======================= */
  const startEdit = id => {
    // Permission guard
    if (!rbac.canPerformEdit) {
      toast.error(lang === "ar" ? "ليس لديك صلاحية لتعديل فرع" : "You don't have permission to edit branch");
      return;
    }
    
    setBranches(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, editing: true, tempName: { ...b.name } }
          : b
      )
    );
  };

  /* =======================
     UPDATE TEMP NAME
  ======================= */
  const updateName = (id, field, value) => {
    setBranches(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, tempName: { ...b.tempName, [field]: value } }
          : b
      )
    );
  };

  /* =======================
     SAVE (ADD / UPDATE)
  ======================= */
  const saveBranch = async (branch) => {
    // Permission guards
    if (branch.isNew && !rbac.canPerformCreate) {
      toast.error(lang === "ar" ? "ليس لديك صلاحية لإضافة فرع" : "You don't have permission to add branch");
      return;
    }
    if (!branch.isNew && !rbac.canPerformEdit) {
      toast.error(lang === "ar" ? "ليس لديك صلاحية لتعديل فرع" : "You don't have permission to edit branch");
      return;
    }
    
    if (branch.isNew) {
      addMutation.mutate(branch, {
        onSuccess: () => {
          setBranches(prev =>
            prev.map(b =>
              b.id === branch.id
                ? {
                    ...b,
                    name: { ...b.tempName },
                    editing: false,
                    isNew: false,
                  }
                : b
            )
          );
        },
      });
    } else {
      updateMutation.mutate(branch, {
        onSuccess: () => {
          setBranches(prev =>
            prev.map(b =>
              b.id === branch.id
                ? {
                    ...b,
                    name: { ...b.tempName },
                    editing: false,
                    isNew: false,
                  }
                : b
            )
          );
        },
      });
    }
  };

  /* =======================
     CANCEL EDIT
  ======================= */
  const cancelEdit = id => {
    setBranches(prev =>
      prev
        .filter(b => !(b.id === id && b.isNew))
        .map(b =>
          b.id === id
            ? { ...b, editing: false, tempName: { ...b.name } }
            : b
        )
    );
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="p-6 text-sm text-grayTextLight">
        {lang === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-sm text-danger">
        {t.loadError}
      </div>
    );
  }

  // Permission guard - check if user has Read permission
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
     UI (UNCHANGED)
  ======================= */
  return (
    <div className="bg-white rounded-xl border border-grayMedium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-left">{t.title}</h2>
          <p className="text-sm text-grayTextLight text-left">{t.desc}</p>
        </div>

        {rbac.showCreateButton && (
          <button
            onClick={addBranch}
            disabled={!rbac.canPerformCreate}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              rbac.canPerformCreate
                ? "bg-primary text-white hover:bg-primaryDark cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {t.add}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-grayMedium">
        <table className="w-full text-sm">
          <thead className="bg-grayLight text-grayTextLight">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{t.name}</th>
              <th className="w-32"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-grayMedium">
            {branches.map(branch => {
              const canSave =
                branch.tempName.ar.trim() !== "" &&
                branch.tempName.en.trim() !== "";

              return (
                <tr
                  key={branch.id}
                  className="hover:bg-grayLight/60 transition"
                >
                  <td className="px-4 py-3 text-left">
                    {branch.editing ? (
                      <div className="space-y-2">
                        <input
                          dir="rtl"
                          placeholder={t.arPlaceholder}
                          value={branch.tempName.ar}
                          onChange={e =>
                            updateName(branch.id, "ar", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm rounded-md
                          border border-grayMedium focus:outline-none
                          focus:border-primary"
                        />

                        <input
                          dir="ltr"
                          placeholder={t.enPlaceholder}
                          value={branch.tempName.en}
                          onChange={e =>
                            updateName(branch.id, "en", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm rounded-md
                          border border-grayMedium focus:outline-none
                          focus:border-primary"
                        />
                      </div>
                    ) : (
                      <span className="text-grayTextDark">
                        {branch.name[lang]}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {branch.editing ? (
                      <>
                        <button
                          disabled={!canSave || addMutation.isPending || updateMutation.isPending}
                          onClick={() => saveBranch(branch)}
                          className={`${
                            canSave && !addMutation.isPending && !updateMutation.isPending
                              ? "text-success"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <IoCheckmarkDone className="text-xl" />
                        </button>

                        <button
                          onClick={() => cancelEdit(branch.id)}
                          className="text-danger"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </>
                    ) : (
                      rbac.showEditButton && (
                        <button
                          onClick={() => startEdit(branch.id)}
                          disabled={!rbac.canPerformEdit}
                          className={`${
                            rbac.canPerformEdit
                              ? "text-primary hover:text-primaryDark cursor-pointer"
                              : "text-gray-300 cursor-not-allowed opacity-50"
                          }`}
                          title={rbac.canPerformEdit ? (lang === "ar" ? "تعديل" : "Edit") : (lang === "ar" ? "ليس لديك صلاحية للتعديل" : "No permission to edit")}
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>
                      )
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

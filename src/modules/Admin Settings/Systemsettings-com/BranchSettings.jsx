import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { IoCheckmarkDone, IoClose } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  getBranches,
  addBranches,
  updateBranches,
} from "../../../core/api/axios"; // ✅ نفس مسارك

export default function BranchSettings() {
  const { lang } = useOutletContext();

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
  };

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     GET BRANCHES
  ======================= */
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
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

      setBranches(formatted);
    } catch (err) {
      console.error("Load branches failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     ADD BRANCH (UI)
  ======================= */
  const addBranch = () => {
    setBranches(prev => [
      ...prev,
      {
        id: Date.now(), // مؤقت
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
  try {
    // 🟢 ADD NEW
    if (branch.isNew) {
      await addBranches([
        {
          BranchName: branch.tempName.en,
          BranchNameAr: branch.tempName.ar,
        },
      ]);
    }
    // 🔵 UPDATE EXISTING
    else {
      await updateBranches([
        {
          BranchID: branch.id,
          NewName: branch.tempName.en,
          NewNameAr: branch.tempName.ar,
        },
      ]);
    }

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
  } catch (err) {
    console.error("Save branch failed", err);
    alert("Failed to save branch");
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

  if (loading) {
    return <div className="p-6 text-sm text-grayTextLight">Loading...</div>;
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

        <button
          onClick={addBranch}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white"
        >
          {t.add}
        </button>
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
                          disabled={!canSave}
                          onClick={() => saveBranch(branch)}
                          className={`${
                            canSave
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
                      <button
                        onClick={() => startEdit(branch.id)}
                        className="text-primary hover:text-primaryDark"
                      >
                        <HiOutlinePencilSquare className="text-lg" />
                      </button>
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

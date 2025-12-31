import { useEffect, useState, useMemo, useCallback } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  getUserRoles,
  addUserRoles,
  deleteUserRoles,
} from "../../../../core/api/axios";
import { toast } from "react-toastify";

const ROLES_QUERY_KEY = ["roles"];
const USER_ROLES_QUERY_KEY = (userId) => ["userRoles", userId];

export default function RolesAssignModal({ open, user, onClose }) {
  const queryClient = useQueryClient();

  const [assigned, setAssigned] = useState([]);
  const [originalAssigned, setOriginalAssigned] = useState([]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  /* ===================== QUERIES ===================== */

  const { data: allRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async () => {
      const res = await getRoles();
      return res?.data?.Roles || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: userRoles = [], isLoading: userRolesLoading } = useQuery({
    queryKey: USER_ROLES_QUERY_KEY(user?.UserId),
    queryFn: async () => {
      if (!user?.UserId) return [];
      const res = await getUserRoles(user.UserId);
      return res?.data?.UserRoles || [];
    },
    enabled: !!user?.UserId,
    staleTime: 5 * 60 * 1000,
  });

  /* ===================== INIT ===================== */

  useEffect(() => {
    if (!open) return;

    const assignedRoles = allRoles.filter((r) =>
      userRoles.some(
        (ur) =>
          (ur.RoleID || ur.RoleId) === (r.RoleID || r.RoleId)
      )
    );

    setAssigned(assignedRoles);
    setOriginalAssigned(assignedRoles);
  }, [open, allRoles, userRoles]);

  /* ===================== MUTATIONS ===================== */

  const addMutation = useMutation({
    mutationFn: ({ userId, roleId }) =>
      addUserRoles([{ UserId: userId, RoleId: roleId }]),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, roleId }) =>
      deleteUserRoles({ UserId: userId, RoleId: roleId }),
  });

  /* ===================== LISTS ===================== */

  const available = useMemo(
    () =>
      allRoles.filter(
        (r) => {
          const roleId = r?.RoleID || r?.RoleId;
          return roleId && !assigned.some((a) => (a?.RoleID || a?.RoleId) === roleId);
        }
      ),
    [allRoles, assigned]
  );

  const filteredAvailable = useMemo(
    () =>
      available.filter((r) => {
        const roleName = r?.RoleName || r?.roleName || "";
        return roleName.toLowerCase().includes(searchLeft.toLowerCase());
      }),
    [available, searchLeft]
  );

  const filteredAssigned = useMemo(
    () =>
      assigned.filter((r) => {
        const roleName = r?.RoleName || r?.roleName || "";
        return roleName.toLowerCase().includes(searchRight.toLowerCase());
      }),
    [assigned, searchRight]
  );

  /* ===================== ACTIONS ===================== */

  const moveRight = () => {
    if (!selectedLeft) return;
    setAssigned((prev) => [...prev, selectedLeft]);
    setSelectedLeft(null);
  };

  const moveLeft = () => {
    if (!selectedRight) return;
    const selectedId = selectedRight?.RoleID || selectedRight?.RoleId;
    if (!selectedId) return;
    setAssigned((prev) =>
      prev.filter((r) => (r?.RoleID || r?.RoleId) !== selectedId)
    );
    setSelectedRight(null);
  };

  const handleSave = async () => {
    // Guard: Check if user exists
    if (!user?.UserId) {
      toast.error("User information is missing");
      return;
    }

    const added = assigned.filter(
      (r) => {
        const roleId = r?.RoleID || r?.RoleId;
        return roleId && !originalAssigned.some((o) => (o?.RoleID || o?.RoleId) === roleId);
      }
    );

    const removed = originalAssigned.filter(
      (r) => {
        const roleId = r?.RoleID || r?.RoleId;
        return roleId && !assigned.some((a) => (a?.RoleID || a?.RoleId) === roleId);
      }
    );

    try {
      for (const r of added) {
        const roleId = r?.RoleID || r?.RoleId;
        if (!roleId) continue;
        await addMutation.mutateAsync({
          userId: user.UserId,
          roleId: roleId,
        });
      }

      for (const r of removed) {
        const roleId = r?.RoleID || r?.RoleId;
        if (!roleId) continue;
        await deleteMutation.mutateAsync({
          userId: user.UserId,
          roleId: roleId,
        });
      }

      queryClient.invalidateQueries({
        queryKey: USER_ROLES_QUERY_KEY(user.UserId),
      });

      toast.success("Roles updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update roles");
    }
  };

  /* ===================== UI ===================== */

  if (!open) return null;

  const loading = rolesLoading || userRolesLoading;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Assign Roles</h2>
          <button onClick={onClose}>
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
              {/* LEFT */}
              <div>
                <input
                  placeholder="Search..."
                  value={searchLeft}
                  onChange={(e) => setSearchLeft(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <div className="border rounded h-64 overflow-y-auto">
                  {filteredAvailable.map((r) => {
                    const roleId = r?.RoleID || r?.RoleId;
                    const selectedId = selectedLeft?.RoleID || selectedLeft?.RoleId;
                    return (
                      <div
                        key={roleId || Math.random()}
                        onClick={() => setSelectedLeft(r)}
                        className={`px-3 py-2 cursor-pointer ${
                          selectedId === roleId
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {r?.RoleName || r?.roleName || "Unknown Role"}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ARROWS */}
              <div className="flex flex-col justify-center gap-2">
                <button onClick={moveRight}>
                  <IoChevronForward />
                </button>
                <button onClick={moveLeft}>
                  <IoChevronBack />
                </button>
              </div>

              {/* RIGHT */}
              <div>
                <input
                  placeholder="Search..."
                  value={searchRight}
                  onChange={(e) => setSearchRight(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                />
                <div className="border rounded h-64 overflow-y-auto">
                  {filteredAssigned.map((r) => {
                    const roleId = r?.RoleID || r?.RoleId;
                    const selectedId = selectedRight?.RoleID || selectedRight?.RoleId;
                    return (
                      <div
                        key={roleId || Math.random()}
                        onClick={() => setSelectedRight(r)}
                        className={`px-3 py-2 cursor-pointer ${
                          selectedId === roleId
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {r?.RoleName || r?.roleName || "Unknown Role"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

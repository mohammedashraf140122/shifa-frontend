import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  // ⏱️ Auto stop expired alerts
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setAlerts((prev) =>
        prev.map((a) =>
          a.active && a.expiresAt <= now ? { ...a, active: false } : a
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts((prev) => [...prev, alert]);
  }, []);

  const updateAlert = useCallback((updated) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }, []);

  const deleteAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );
  }, []);

  // ✅ Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      alerts,
      addAlert,
      updateAlert,
      deleteAlert,
      toggleAlert,
    }),
    [alerts, addAlert, updateAlert, deleteAlert, toggleAlert]
  );

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertsContext);

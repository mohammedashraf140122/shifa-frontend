import { createContext, useContext, useEffect, useState } from "react";

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

  const addAlert = (alert) => {
    setAlerts((prev) => [...prev, alert]);
  };

  const updateAlert = (updated) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        addAlert,
        updateAlert,
        deleteAlert,
        toggleAlert,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertsContext);

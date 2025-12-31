import { useState, useEffect } from "react";
import Header from "../header/Header.jsx";
import Sidebar from "../sidebar/sidebar.jsx";
import ChatWidget from "../chat-widget";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
    <div
  className={`${dark ? "dark" : ""} flex h-screen 
  bg-grayLight dark:bg-gray-900 transition-colors duration-300`}
>

      {/* Sidebar (ثابت) */}
      <Sidebar open={sidebarOpen} lang={lang} />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header (ثابت) */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          lang={lang}
          setLang={setLang}
          dark={dark}
          setDark={setDark}
        />

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ lang }} />
          </div>
        </main>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden
        ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Chat */}
      {location.pathname !== "/chat" && <ChatWidget lang={lang} />}
    </div>
    </>
  );
}

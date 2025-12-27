import { useEffect, useState } from "react";
import { IoChatbubblesOutline, IoCloseOutline, IoExpandOutline } from "react-icons/io5";
import ChatPopup from "./ChatPopup";
import "./ChatWidget.css";

export default function ChatWidget({ lang }) {
  const [isVisible, setIsVisible] = useState(true);
  const [openChat, setOpenChat] = useState(false);

  const unreadCount = 2;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpenChat(true)}
        className={`fixed bottom-6 right-6 z-50
        bg-gradient-to-br from-primary to-primaryDark
        text-white w-14 h-14 rounded-full shadow-2xl
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        ${isVisible && !openChat ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <IoChatbubblesOutline className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-xs
          w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {openChat && <ChatPopup lang={lang} onClose={() => setOpenChat(false)} />}
    </>
  );
}

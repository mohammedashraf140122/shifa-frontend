import { useState, useEffect } from "react";
import {
  IoCloseOutline,
  IoExpandOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoRadioOutline,
  IoSendOutline,
} from "react-icons/io5";
import "./ChatWidget.css";
import { useNavigate } from "react-router-dom";

export default function ChatPopup({ lang, onClose }) {
  const [activeTab, setActiveTab] = useState("one");
  const [isClosing, setIsClosing] = useState(false);
const navigate = useNavigate();
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const tabs = [
    { id: "one", icon: IoPersonOutline, label: "One-to-One" },
    { id: "group", icon: IoPeopleOutline, label: "Group" },
    { id: "broadcast", icon: IoRadioOutline, label: "Broadcast" },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 
      w-[304px] h-[480px] 
      bg-white dark:bg-gray-800 
      rounded-t-2xl rounded-b-lg 
      shadow-2xl 
      overflow-hidden 
      flex flex-col
      chat-popup-container
      ${isClosing ? "chat-popup-close" : "chat-popup-open"}`}
      style={{ 
        transformOrigin: 'bottom right',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primaryDark 
        text-white px-5 py-4 
        flex items-center justify-between
        shrink-0">
        <span className="font-bold text-lg">Chat</span>
        <div className="flex items-center gap-3">
          <IoExpandOutline 
            className="cursor-pointer hover:scale-110 transition-transform text-xl" 
            
           onClick={() => navigate("/chat")} title={lang === "ar" ? "تكبير" : "Expand"}
          />
          <IoCloseOutline 
            className="cursor-pointer hover:scale-110 transition-transform text-xl" 
            onClick={handleClose}
            title={lang === "ar" ? "إغلاق" : "Close"}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-grayMedium dark:border-gray-700 
        bg-grayLight/50 dark:bg-gray-700/30
        shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-xs font-medium
              transition-all duration-200
              ${activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primaryLighter/20 dark:bg-primary/10"
                : "text-grayTextLight dark:text-gray-400 hover:text-primary dark:hover:text-primaryLighter"
              }`}
            >
              <Icon className={`text-xl transition-transform duration-200
                ${activeTab === tab.id ? "scale-110" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2
        bg-white dark:bg-gray-800
        scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {activeTab === "one" && (
          <>
            <ChatItem title="Dr. Ahmed Hassan" sub="Thank you" time="2m" badge />
            <ChatItem title="Dr. Sarah Mohammed" sub="Done" time="15m" />
          </>
        )}

        {activeTab === "group" && (
          <>
            <ChatItem title="Emergency Team" sub="Ready" time="5m" badge count={1} />
            <ChatItem title="Doctors Group" sub="Meeting today" time="1h" badge count={3} />
          </>
        )}

        {activeTab === "broadcast" && (
          <>
            <ChatItem title="General Announcements" sub="System update" time="2h" />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-grayMedium dark:border-gray-700 
        bg-grayLight/30 dark:bg-gray-700/20
        flex items-center gap-3
        shrink-0">
        <input
          placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
          className="flex-1 border border-grayMedium dark:border-gray-600 
          rounded-full px-5 py-2.5 text-sm 
          outline-none focus:ring-2 focus:ring-primary/30 
          bg-white dark:bg-gray-700 
          text-grayText dark:text-gray-200
          placeholder:text-grayTextLight dark:placeholder:text-gray-500
          transition-all duration-200"
        />
        <button className="bg-gradient-to-br from-primary to-primaryDark 
          hover:from-primaryDark hover:to-primaryDarker
          active:from-primaryDarker active:to-primaryDarker
          text-white p-3 rounded-full
          shadow-lg shadow-primary/30
          hover:shadow-primary/50
          hover:scale-110 active:scale-95
          transition-all duration-200
          flex items-center justify-center">
          <IoSendOutline className="text-lg" />
        </button>
      </div>
    </div>
  );
}

function ChatItem({ title, sub, time, badge, count = 2 }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg 
      hover:bg-primaryLighter/20 dark:hover:bg-gray-700/50 
      active:bg-primaryLighter/30 dark:active:bg-gray-700/70
      cursor-pointer
      transition-all duration-200
      border border-transparent hover:border-primary/20 dark:hover:border-primary/30">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-grayText dark:text-gray-200 
          truncate">{title}</p>
        <p className="text-xs text-grayTextLight dark:text-gray-400 
          truncate mt-0.5">{sub}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
        <span className="text-[10px] text-grayTextLight dark:text-gray-500 
          whitespace-nowrap">{time}</span>
        {badge && (
          <span className="bg-gradient-to-br from-primary to-primaryDark 
            text-white text-[10px] font-bold
            w-5 h-5 rounded-full 
            flex items-center justify-center
            shadow-md shadow-primary/30
            animate-pulse">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
    </div>
  );
}

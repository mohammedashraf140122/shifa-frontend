import { useState, useEffect } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import Logo from "../../../assets/images/logo-en-ar.png";
import "../../../css/login.css";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "../../../hooks/useLogin.js";
import { loginSchema } from "../../../validation/login.schema";
import { getAccessToken } from "../../../core/utils/token";


export default function Login() {
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // ✅ نفس الفورم – مضاف state فقط
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin(navigate);

  // ✅ Check token in useEffect instead of render
  useEffect(() => {
    // Fix: Use Cookies instead of localStorage
    const token = getAccessToken();
    setHasToken(!!token);
  }, []);

  // لو عامل login قبل كده
  if (hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  const textDir = lang === "ar" ? "rtl" : "ltr";

  // ✅ اللوجيك فقط
  const handleLogin = () => {
    const result = loginSchema.safeParse({
      username,
      password,
    });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    loginMutation.mutate({
      username,
      password,
    });
  };

  return (
    <div
      className={`${dark ? "dark" : ""} min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-primaryLighter via-grayLight to-blueSoft
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
      px-3 py-4 sm:px-4 sm:py-6 md:px-4 md:py-0`}
    >
      {/* Decorative Background Elements for Mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue/15 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-md
          rounded-2xl md:rounded-xl shadow-xl 
          flex flex-col md:flex-row w-full max-w-[800px]
          border border-white/30 dark:border-gray-700/50
          animate-fade-in
          overflow-hidden">

        {/* MOBILE LOGO */}
        <div className="md:hidden flex justify-center items-center pt-4 pb-2 px-3 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primaryLighter/50 to-transparent"></div>
          <img
            src={Logo}
            className="w-24 sm:w-28 h-auto opacity-95 animate-scale-in relative z-10"
            alt="Shifa Hospital"
          />
        </div>

        {/* LEFT FORM */}
        <div
          className="w-full md:w-1/2 flex flex-col relative 
          px-4 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8"
          dir={textDir}
        >
          {/* LANGUAGE */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-md text-xs font-bold"
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
          </div>

          {/* DARK MODE */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              onClick={() => setDark(!dark)}
              className="text-primary text-lg"
            >
              {dark ? <IoSunny /> : <IoMoon />}
            </button>
          </div>

          {/* FORM CENTER */}
          <div className="flex flex-col justify-center h-full w-full max-w-[320px] mx-auto">

            <h1 className="text-lg md:text-2xl font-bold text-center mb-1">
              {lang === "ar" ? "مرحبًا بك" : "Welcome back"}
            </h1>

            <p className="text-xs text-center mb-6 text-grayTextLight">
              {lang === "ar"
                ? "سجل دخولك للوصول إلى حسابك"
                : "Sign in to access your account"}
            </p>

            {/* USERNAME */}
            <label className="text-xs font-medium">
              {lang === "ar" ? "اسم المستخدم" : "User Name"}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-3 px-3 py-2.5 text-sm rounded-lg border border-grayMedium dark:border-gray-700 
                bg-white dark:bg-gray-800 text-grayTextDark dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all"
              placeholder={lang === "ar" ? "اسم المستخدم" : "User Name"}
            />

            {/* PASSWORD */}
            <label className="text-xs font-medium text-grayTextDark dark:text-gray-300">
              {lang === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2.5 text-sm rounded-lg border border-grayMedium dark:border-gray-700 
                bg-white dark:bg-gray-800 text-grayTextDark dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all"
              placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
            />

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-primaryDark
              hover:from-primaryDark hover:to-primaryDarker
              text-white px-4 py-2.5 rounded-lg font-semibold text-sm
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loginMutation.isPending
                ? (lang === "ar" ? "جاري تسجيل الدخول..." : "Logging in...")
                : lang === "ar"
                ? "تسجيل الدخول"
                : "Login"}
            </button>

          </div>
        </div>

        {/* RIGHT LOGO */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <img src={Logo} className="w-48 opacity-90" alt="Shifa Hospital" />
        </div>

      </div>
    </div>
  );
}

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout.jsx";

// Public routes - loaded immediately
import Login from "../../modules/auth/login-page/login.jsx";

// Protected routes - Lazy loaded
const Dashboard = lazy(() => import("../../modules/dashboard/dashboard.jsx"));
const Chat = lazy(() => import("../../modules/chat/chat.jsx"));

// Recruitment routes
const CVBank = lazy(() => import("../../modules/Recruitment/CV Bank.jsx"));
const Interviews = lazy(() => import("../../modules/Recruitment/Interviews.jsx"));
const Schedule = lazy(() => import("../../modules/Recruitment/Schedule.jsx"));
const QuickCandidate = lazy(() => import("../../modules/Recruitment/Quick Candidate.jsx"));
const Candidates = lazy(() => import("../../modules/Recruitment/Candidates.jsx"));
const JobPosting = lazy(() => import("../../modules/Recruitment/Job Posting.jsx"));

// Call Center routes
const Faq = lazy(() => import("../../modules/Call Center/FAQ.jsx"));
const Doctors = lazy(() => import("../../modules/Call Center/Doctors.jsx"));
const Clinics = lazy(() => import("../../modules/Call Center/Clinics.jsx"));
const Services = lazy(() => import("../../modules/Call Center/Services.jsx"));

// Other routes
const Alerts = lazy(() => import("../../modules/Alerts/Alerts.jsx"));
const Contact = lazy(() => import("../../modules/Contact/Contact.jsx"));

// Admin Settings routes
const Systemsettings = lazy(() => import("../../modules/Admin Settings/Systemsettings.jsx"));
const Permissions = lazy(() => import("../../modules/Admin Settings/Permissions.jsx"));
const Roles = lazy(() => import("../../modules/Admin Settings/Roles.jsx"));
const Users = lazy(() => import("../../modules/Admin Settings/Users.jsx"));

// Payroll routes
const MedicalShifts = lazy(() => import("../../modules/Payroll/MedicalShifts.jsx"));
const Shifts = lazy(() => import("../../modules/Payroll/Shifts.jsx"));
const Not = lazy(() => import("../../modules/404/Not.jsx"));

// Loading component for Suspense
import PageLoader from "../../ui/components/PageLoader";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* 🔓 Public */}
          <Route path="/login" element={<Login />} />

          {/* 🔒 Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />

            <Route path="/cvbank" element={<CVBank />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/quickcandidate" element={<QuickCandidate />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/jobposting" element={<JobPosting />} />

            <Route path="/faq" element={<Faq />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/services" element={<Services />} />

            <Route path="/alerts" element={<Alerts />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/systemsettings" element={<Systemsettings />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/users" element={<Users />} />

            <Route path="/medicalshifts" element={<MedicalShifts />} />
            <Route path="/shifts" element={<Shifts />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Not />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

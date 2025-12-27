import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../modules/auth/login-page/login.jsx";
import Dashboard from "../../modules/dashboard/dashboard.jsx";
import Chat from "../../modules/chat/chat.jsx";
import ProtectedLayout from "./ProtectedLayout.jsx";

import CVBank from "../../modules/Recruitment/CV Bank.jsx";
import Interviews from "../../modules/Recruitment/Interviews.jsx";
import Schedule from "../../modules/Recruitment/Schedule.jsx";
import QuickCandidate from "../../modules/Recruitment/Quick Candidate.jsx";
import Candidates from "../../modules/Recruitment/Candidates.jsx";
import JobPosting from "../../modules/Recruitment/Job Posting.jsx";

import Faq from "../../modules/Call Center/FAQ.jsx";
import Doctors from "../../modules/Call Center/Doctors.jsx";
import Clinics from "../../modules/Call Center/Clinics.jsx";
import Services from "../../modules/Call Center/Services.jsx";

import Alerts from "../../modules/Alerts/Alerts.jsx";
import Contact from "../../modules/Contact/Contact.jsx";

import Systemsettings from "../../modules/Admin Settings/Systemsettings.jsx";
import Permissions from "../../modules/Admin Settings/Permissions.jsx";
import Roles from "../../modules/Admin Settings/Roles.jsx";
import Users from "../../modules/Admin Settings/Users.jsx";

import MedicalShifts from "../../modules/Payroll/MedicalShifts.jsx";
import Shifts from "../../modules/Payroll/Shifts.jsx";
import Not from "../../modules/404/Not.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

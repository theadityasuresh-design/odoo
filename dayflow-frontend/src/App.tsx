import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardIndex from './routes/DashboardIndex';
import Login from './routes/AuthPages/Login';
import Signup from './routes/AuthPages/Signup';
import VerifyEmail from './routes/AuthPages/VerifyEmail';
import EmployeeDashboard from './routes/EmployeeDashboard';
import AdminDashboard from './routes/AdminDashboard';
import Profile from './routes/Profile';
import Attendance from './routes/Attendance';
import Leave from './routes/Leave';
import Payroll from './routes/Payroll';
import Employees from './routes/Employees';
import Reports from './routes/Reports';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardIndex />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payroll" element={<Payroll />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCircle, CalendarCheck, CalendarDays, Banknote, Users, BarChart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: UserCircle },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/leave', label: 'Leave', icon: CalendarDays },
    { to: '/payroll', label: 'Payroll', icon: Banknote },
  ];

  const adminLinks = [
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/reports', label: 'Reports', icon: BarChart },
  ];

  const links = isAdmin ? [...employeeLinks, ...adminLinks] : employeeLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-[calc(100vh-4rem)] hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

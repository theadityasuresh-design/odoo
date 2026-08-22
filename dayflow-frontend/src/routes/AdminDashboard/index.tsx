import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../api/users';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Users, FileText, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: getAdminDashboard
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Employees</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.employee_count}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.pending_approvals}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Present Today</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.today_attendance_summary.present}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Today's Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Present</span>
              <span className="font-semibold text-green-600">{data.today_attendance_summary.present}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Absent</span>
              <span className="font-semibold text-red-600">{data.today_attendance_summary.absent}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">On Leave</span>
              <span className="font-semibold text-blue-600">{data.today_attendance_summary.on_leave}</span>
            </div>
          </div>
        </Card>

        <Card title="Quick Links">
          <div className="flex flex-col gap-3">
            <Link to="/employees" className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center justify-between text-gray-700">
              Manage Employees <span className="text-gray-400">→</span>
            </Link>
            <Link to="/leave" className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center justify-between text-gray-700">
              Review Leave Requests <span className="text-gray-400">→</span>
            </Link>
            <Link to="/reports" className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center justify-between text-gray-700">
              View Reports <span className="text-gray-400">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

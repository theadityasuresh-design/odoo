import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeDashboard } from '../../api/users';
import { useCheckIn, useCheckOut } from '../../hooks/useAttendance';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export default function EmployeeDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'employee'],
    queryFn: getEmployeeDashboard
  });
  
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.profile_summary.full_name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Today's Attendance">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <Badge variant={data.attendance_today.status === 'present' ? 'green' : 'gray'}>
                {data.attendance_today.status.toUpperCase()}
              </Badge>
            </div>
            {data.attendance_today.check_in && (
              <div className="text-sm">In: {new Date(data.attendance_today.check_in).toLocaleTimeString()}</div>
            )}
            {data.attendance_today.check_out && (
              <div className="text-sm">Out: {new Date(data.attendance_today.check_out).toLocaleTimeString()}</div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => checkIn.mutate()} 
                disabled={!!data.attendance_today.check_in || checkIn.isPending}
                className="flex-1"
              >
                Check In
              </Button>
              <Button 
                onClick={() => checkOut.mutate()} 
                disabled={!data.attendance_today.check_in || !!data.attendance_today.check_out || checkOut.isPending}
                variant="secondary"
                className="flex-1"
              >
                Check Out
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Leave Balance">
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <span className="text-4xl font-bold text-blue-600">{data.pending_leaves}</span>
            <span className="text-gray-500">Pending Requests</span>
          </div>
        </Card>

        <Card title="Alerts">
          <ul className="space-y-2">
            {data.alerts.length === 0 ? (
              <li className="text-gray-500 text-sm">No new alerts</li>
            ) : (
              data.alerts.map((alert, i) => (
                <li key={i} className="text-sm p-2 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-100">
                  {alert}
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}

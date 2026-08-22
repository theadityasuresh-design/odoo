import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMyAttendance, useAllAttendance, useCheckIn, useCheckOut } from '../../hooks/useAttendance';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [view, setView] = useState<'my' | 'all'>(isAdmin ? 'all' : 'my');

  const myQuery = useMyAttendance();
  const allQuery = useAllAttendance();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const query = view === 'my' ? myQuery : allQuery;

  const columns = [
    ...(view === 'all' ? [{ header: 'User ID', accessorKey: 'user_id' as any }] : []),
    { header: 'Date', accessorKey: 'att_date' as any },
    { 
      header: 'Status', 
      cell: (item: any) => (
        <Badge variant={item.status === 'present' ? 'green' : item.status === 'absent' ? 'red' : 'gray'}>
          {item.status.toUpperCase()}
        </Badge>
      )
    },
    { 
      header: 'Check In', 
      cell: (item: any) => item.check_in ? new Date(item.check_in).toLocaleTimeString() : '-' 
    },
    { 
      header: 'Check Out', 
      cell: (item: any) => item.check_out ? new Date(item.check_out).toLocaleTimeString() : '-' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant={view === 'my' ? 'primary' : 'secondary'} onClick={() => setView('my')}>My Attendance</Button>
            <Button variant={view === 'all' ? 'primary' : 'secondary'} onClick={() => setView('all')}>All Records</Button>
          </div>
        )}
      </div>

      {view === 'my' && (
        <Card className="mb-6">
          <div className="flex gap-4">
            <Button onClick={() => checkIn.mutate()} disabled={checkIn.isPending}>Check In</Button>
            <Button onClick={() => checkOut.mutate()} disabled={checkOut.isPending} variant="secondary">Check Out</Button>
          </div>
        </Card>
      )}

      <Card>
        {query.isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <Table data={query.data?.records || []} columns={columns} />
        )}
      </Card>
    </div>
  );
}

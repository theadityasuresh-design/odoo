import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMyLeaves, useAllLeaves, useApplyLeave, useUpdateLeaveDecision } from '../../hooks/useLeave';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { LeaveForm } from '../../components/forms/LeaveForm';

export default function Leave() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [view, setView] = useState<'my' | 'all'>(isAdmin ? 'all' : 'my');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const myQuery = useMyLeaves();
  const allQuery = useAllLeaves();
  const applyMutation = useApplyLeave();
  const decisionMutation = useUpdateLeaveDecision();

  const query = view === 'my' ? myQuery : allQuery;

  const handleApply = (data: any) => {
    applyMutation.mutate(data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const handleDecision = (id: string, status: string) => {
    decisionMutation.mutate({ id, status, reviewer_comments: 'Reviewed by admin' });
  };

  const columns = [
    ...(view === 'all' ? [{ header: 'User ID', accessorKey: 'user_id' as any }] : []),
    { header: 'Type', accessorKey: 'leave_type' as any, cell: (item: any) => <span className="capitalize">{item.leave_type}</span> },
    { header: 'Start Date', accessorKey: 'start_date' as any },
    { header: 'End Date', accessorKey: 'end_date' as any },
    { 
      header: 'Status', 
      cell: (item: any) => (
        <Badge variant={item.status === 'approved' ? 'green' : item.status === 'rejected' ? 'red' : 'yellow'}>
          {item.status.toUpperCase()}
        </Badge>
      )
    },
    ...(view === 'all' ? [{
      header: 'Actions',
      cell: (item: any) => item.status === 'pending' ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleDecision(item.id, 'approved'); }}>Approve</Button>
          <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDecision(item.id, 'rejected'); }}>Reject</Button>
        </div>
      ) : '-'
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button variant={view === 'my' ? 'primary' : 'secondary'} onClick={() => setView('my')}>My Leaves</Button>
              <Button variant={view === 'all' ? 'primary' : 'secondary'} onClick={() => setView('all')}>All Requests</Button>
            </>
          )}
          <Button onClick={() => setIsModalOpen(true)}>Apply Leave</Button>
        </div>
      </div>

      <Card>
        {query.isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <Table data={query.data?.requests || []} columns={columns} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
        <LeaveForm onSubmit={handleApply} isLoading={applyMutation.isPending} />
      </Modal>
    </div>
  );
}

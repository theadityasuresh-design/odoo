import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../api/users';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export default function Employees() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const columns = [
    { header: 'Emp ID', accessorKey: 'employee_id' as any },
    { header: 'Name', cell: (item: any) => item.profile?.full_name || 'N/A' },
    { header: 'Email', accessorKey: 'email' as any },
    { header: 'Department', cell: (item: any) => item.profile?.department || 'N/A' },
    { header: 'Job Title', cell: (item: any) => item.profile?.job_title || 'N/A' },
    { 
      header: 'Role', 
      cell: (item: any) => (
        <Badge variant={item.role === 'admin' ? 'blue' : 'gray'}>
          {item.role.toUpperCase()}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Employees Directory</h1>
      
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <Table 
            data={data?.items || []} 
            columns={columns} 
            onRowClick={(item) => navigate(`/profile?id=${item.id}`)}
          />
        )}
      </Card>
    </div>
  );
}

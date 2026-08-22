import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMyPayroll, useSalarySlip } from '../../hooks/usePayroll';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export default function Payroll() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data, isLoading } = useMyPayroll();
  const { refetch: downloadSlip, isFetching: isDownloading } = useSalarySlip(user?.id || '', false);

  const handleDownload = async () => {
    const res = await downloadSlip();
    if (res.data) {
      alert(`Salary slip downloaded for ${res.data.employee.full_name} - Net: $${res.data.net_salary}`);
    }
  };

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <Card>
          <p className="text-gray-500">Admin payroll view coming soon. Use Employee directory to manage individual payrolls.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Payroll</h1>
        <Button onClick={handleDownload} isLoading={isDownloading}>Download Latest Slip</Button>
      </div>

      <Card title="Current Salary Breakdown">
        <div className="space-y-4">
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Base Salary</span>
            <span className="font-semibold">${data.base_salary}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Allowances</span>
            <span className="font-semibold text-green-600">+ ${data.allowances}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Deductions</span>
            <span className="font-semibold text-red-600">- ${data.deductions}</span>
          </div>
          <div className="flex justify-between p-4 bg-blue-50 rounded border border-blue-100 text-lg">
            <span className="font-bold text-blue-900">Net Salary</span>
            <span className="font-bold text-blue-600">${data.net_salary}</span>
          </div>
          <p className="text-xs text-gray-400 text-right">Pay cycle: {data.pay_cycle} | Last updated: {new Date(data.last_updated).toLocaleDateString()}</p>
        </div>
      </Card>
    </div>
  );
}

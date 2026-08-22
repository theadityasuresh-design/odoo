import React from 'react';
import { Card } from '../../components/ui/Card';

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Attendance Summary (Current Month)">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">Total Working Days</span>
              <span className="font-semibold">22</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">Average Daily Attendance</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-gray-600">Total Absences</span>
              <span className="font-semibold text-red-600">12</span>
            </div>
          </div>
        </Card>

        <Card title="Leave Summary (Current Year)">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">Sick Leaves Taken</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-gray-600">Casual Leaves Taken</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="font-semibold text-yellow-600">5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { client } from './client';
import { getMockResponse } from './mockHandlers';
import { PayrollRecord, SalarySlip } from '../types';

export async function getMyPayroll(): Promise<PayrollRecord> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/payroll/me', 'GET');
  }
  const { data } = await client.get('/payroll/me');
  return data;
}

export async function updatePayroll(user_id: string, payload: Partial<PayrollRecord>): Promise<PayrollRecord> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse(`/payroll/${user_id}`, 'PATCH', payload);
  }
  const { data } = await client.patch(`/payroll/${user_id}`, payload);
  return data;
}

export async function getSalarySlip(user_id: string): Promise<SalarySlip> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse(`/payroll/reports/salary-slip/${user_id}`, 'GET');
  }
  const { data } = await client.get(`/payroll/reports/salary-slip/${user_id}`);
  return data;
}

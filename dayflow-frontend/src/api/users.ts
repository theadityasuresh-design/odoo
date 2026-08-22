import { client } from './client';
import { getMockResponse } from './mockHandlers';
import { User, PaginatedResponse, EmployeeDashboard, AdminDashboard } from '../types';

export async function getMe(): Promise<User> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/users/me', 'GET');
  }
  const { data } = await client.get('/users/me');
  return data;
}

export async function getUsers(): Promise<PaginatedResponse<User>> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/users', 'GET');
  }
  const { data } = await client.get('/users');
  return data;
}

export async function getEmployeeDashboard(): Promise<EmployeeDashboard> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/dashboard/employee', 'GET');
  }
  const { data } = await client.get('/dashboard/employee');
  return data;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/dashboard/admin', 'GET');
  }
  const { data } = await client.get('/dashboard/admin');
  return data;
}

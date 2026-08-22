import { client } from './client';
import { getMockResponse } from './mockHandlers';
import { AttendanceRecord } from '../types';

export async function checkIn(): Promise<{ timestamp: string }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/attendance/check-in', 'POST');
  }
  const { data } = await client.post("/attendance/check-in", { timestamp: new Date().toISOString() });
  return data;
}

export async function checkOut(): Promise<{ timestamp: string }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/attendance/check-out', 'POST');
  }
  const { data } = await client.post("/attendance/check-out", { timestamp: new Date().toISOString() });
  return data;
}

export async function getMyAttendance(): Promise<{ records: AttendanceRecord[] }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/attendance/me', 'GET');
  }
  const { data } = await client.get('/attendance/me');
  return data;
}

export async function getAllAttendance(): Promise<{ records: AttendanceRecord[] }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/attendance', 'GET');
  }
  const { data } = await client.get('/attendance');
  return data;
}


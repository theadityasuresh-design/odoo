import { client } from './client';
import { getMockResponse } from './mockHandlers';
import { LeaveRequest } from '../types';

export async function applyLeave(payload: Partial<LeaveRequest>): Promise<LeaveRequest> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/leave', 'POST', payload);
  }
  const { data } = await client.post('/leave', payload);
  return data;
}

export async function getMyLeaves(): Promise<{ requests: LeaveRequest[] }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/leave/me', 'GET');
  }
  const { data } = await client.get('/leave/me');
  return data;
}

export async function getAllLeaves(): Promise<{ requests: LeaveRequest[] }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/leave', 'GET');
  }
  const { data } = await client.get('/leave');
  return data;
}

export async function updateLeaveDecision(id: string, status: string, reviewer_comments: string): Promise<LeaveRequest> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse(`/leave/${id}/decision`, 'PATCH', { status, reviewer_comments });
  }
  const { data } = await client.patch(`/leave/${id}/decision`, { status, reviewer_comments });
  return data;
}

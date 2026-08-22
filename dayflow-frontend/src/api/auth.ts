import { client } from './client';
import { getMockResponse } from './mockHandlers';
import { User } from '../types';

export async function login(email: string, password: string): Promise<{ access_token: string, refresh_token: string, user: User }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/auth/login', 'POST', { email, password });
  }
  const { data } = await client.post('/auth/login', { email, password });
  return data;
}

export async function signup(payload: any): Promise<{ message: string }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/auth/signup', 'POST', payload);
  }
  const { data } = await client.post('/auth/signup', payload);
  return data;
}

export async function logout(): Promise<{ message: string }> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return getMockResponse('/auth/logout', 'POST');
  }
  const { data } = await client.post('/auth/logout');
  return data;
}

import axios from 'axios';
import { SESSION_EXPIRED } from './client';

export const extractError = (err: any): string => {
  if (axios.isCancel(err)) return SESSION_EXPIRED;

  const detail = err.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((e: any) => e.msg).join(', ');
  return err.response?.data?.message || err.message || 'Request failed';
};

// Errors that should NEVER surface as a toast — the auth layer is handling them
export const isAuthError = (msg: unknown) =>
  msg === SESSION_EXPIRED || msg === 'Not authenticated';

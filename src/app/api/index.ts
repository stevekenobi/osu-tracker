import { ServerResponse } from '@/types';
import axios from 'axios';

const baseUrl = 'http://localhost:5173/api';

export async function apiRequest<T>(method: 'get' | 'post', url: string, data?: any) {
  const response = await axios<ServerResponse<T>>({
    method,
    url: `${baseUrl}/${url}`,
    headers: {},
    data,
  });

  if (response.data.meta.status === 404) {
    throw new Error('not found');
  }
  return response.data.data;
}

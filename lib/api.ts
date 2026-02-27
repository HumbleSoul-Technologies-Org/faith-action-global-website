import axios from 'axios'
import type { AxiosResponse } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetcher = <T = any>(url: string) => api.get<T>(url).then((res: AxiosResponse<T>) => res.data)

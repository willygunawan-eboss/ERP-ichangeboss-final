import { useState, useEffect, useCallback } from 'react';
import { Employee, AttendanceRecord, PayrollRecord, Transaction, SalesOrder, Product, ProductionOrder, Project } from './types';

export function useApiData<T>(endpoint: string, fallback: T[] = []): { data: T[], refetch: () => void } {
  const [data, setData] = useState<T[]>(fallback);
  const fetcher = useCallback(() => {
    fetch(`/api/${endpoint}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(err => console.error('API Error:', err));
  }, [endpoint]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  useEffect(() => {
    const handleRefetch = () => fetcher();
    window.addEventListener('refetch-' + endpoint, handleRefetch);
    return () => window.removeEventListener('refetch-' + endpoint, handleRefetch);
  }, [fetcher, endpoint]);

  return { data, refetch: fetcher };
}

export function useEmployees() { return useApiData<Employee>('employees'); }
export function useAttendance() { return useApiData<AttendanceRecord>('attendance'); }
export function usePayroll() { return useApiData<PayrollRecord>('payroll'); }
export function useTransactions() { return useApiData<Transaction>('transactions'); }
export function useSalesOrders() { return useApiData<SalesOrder>('sales-orders'); }
export function useProducts() { return useApiData<Product>('products'); }
export function useProductionOrders() { return useApiData<ProductionOrder>('production-orders'); }
export function useProjects() { return useApiData<Project>('projects'); }

import { Task, Announcement } from './types';
export function useTasks() { return useApiData<Task>('tasks'); }
export function useAnnouncements() { return useApiData<Announcement>('announcements'); }
export function useDashboardStats() {
  const [stats, setStats] = useState({ activeEmployees: 0, totalDepartments: 0, openTickets: 0, monthlyRevenue: 0 });
  const fetcher = useCallback(() => {
    fetch('/api/dashboard/stats').then(res => res.json()).then(json => { if (json.success) setStats(json.data); }).catch(e => console.error(e));
  }, []);
  useEffect(() => { fetcher(); }, [fetcher]);
  useEffect(() => {
    const handleRefetch = () => fetcher();
    window.addEventListener('refetch-dashboard-stats', handleRefetch);
    return () => window.removeEventListener('refetch-dashboard-stats', handleRefetch);
  }, [fetcher]);
  return { stats, refetch: fetcher };
}

export const dashboardRevenue = [
  { name: 'Jan', revenue: 450, profit: 120 },
  { name: 'Feb', revenue: 520, profit: 140 },
  { name: 'Mar', revenue: 480, profit: 130 },
  { name: 'Apr', revenue: 610, profit: 180 },
  { name: 'May', revenue: 590, profit: 170 },
  { name: 'Jun', revenue: 750, profit: 220 },
];

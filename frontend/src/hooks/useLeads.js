import { useState, useEffect, useCallback, useRef } from 'react';
import { leadsApi } from '../api/leads';
import toast from 'react-hot-toast';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchLeads = useCallback(async (queryParams) => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      const { data } = await leadsApi.getAll(cleanParams);
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(params);
  }, [params, fetchLeads]);

  const updateParams = useCallback((updates) => {
    setParams((prev) => {
      const next = { ...prev, ...updates };
      // Reset to page 1 when filters change
      if (updates.search !== undefined || updates.status !== undefined) {
        next.page = 1;
      }
      return next;
    });
  }, []);

  const createLead = useCallback(async (formData) => {
    const { data } = await leadsApi.create(formData);
    toast.success('Lead created successfully!');
    fetchLeads(params);
    return data.data;
  }, [params, fetchLeads]);

  const updateLead = useCallback(async (id, formData) => {
    const { data } = await leadsApi.update(id, formData);
    toast.success('Lead updated!');
    setLeads((prev) => prev.map((l) => (l._id === id ? data.data : l)));
    return data.data;
  }, []);

  const deleteLead = useCallback(async (id) => {
    await leadsApi.delete(id);
    toast.success('Lead deleted');
    setLeads((prev) => prev.filter((l) => l._id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const { data } = await leadsApi.update(id, { status });
    setLeads((prev) => prev.map((l) => (l._id === id ? data.data : l)));
    toast.success(`Status → ${status}`);
  }, []);

  return {
    leads, pagination, loading, params,
    updateParams, createLead, updateLead, deleteLead, updateStatus,
    refresh: () => fetchLeads(params),
  };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

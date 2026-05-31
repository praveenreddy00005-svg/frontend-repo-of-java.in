import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Search,
  XCircle,
} from 'lucide-react';
import { getDomains, getStats, getSubmissions } from '../services/api';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [domains, setDomains] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, statsRes] = await Promise.all([
        getSubmissions({ search, domain, status, page, limit: 15 }),
        page === 1 ? getStats() : Promise.resolve(null),
      ]);
      setSubmissions(subRes.data.data);
      setPagination(subRes.data.pagination);
      if (statsRes) setStats(statsRes.data.data);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  }, [search, domain, status, page]);

  useEffect(() => {
    getDomains().then((res) => setDomains(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const statCards = stats
    ? [
        { label: 'Total', value: stats.total, icon: Eye, color: 'text-brand-600 bg-brand-50' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {statCards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-center gap-4"
            >
              <div className={`rounded-xl p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-10"
              placeholder="Search by name, email, ID, company..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="input-field w-auto min-w-[160px]"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="input-field w-auto min-w-[140px]"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearch('');
                setDomain('');
                setStatus('');
                setPage(1);
              }}
            >
              <Filter className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Domain</th>
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No submissions found
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="py-3 pr-4 font-mono text-xs text-brand-700">{s.submissionId}</td>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{s.fullName}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </td>
                    <td className="py-3 pr-4">{s.internshipDomain}</td>
                    <td className="py-3 pr-4">{s.companyName}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[s.reviewStatus]}`}
                      >
                        {s.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/submissions/${s._id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-brand-600 transition hover:bg-brand-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

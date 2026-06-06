import { useState } from 'react';
import {
  MdEdit, MdDelete, MdSearch, MdArrowUpward, MdArrowDownward,
  MdUnfoldMore, MdChevronLeft, MdChevronRight, MdAdd
} from 'react-icons/md';
import { getStatusClass, getInitials, getAvatarColor, formatDate, formatCurrency, truncate, STATUSES } from '../utils/helpers';
import styles from './LeadsTable.module.css';

export default function LeadsTable({ leads, loading, pagination, params, onParamsChange, onEdit, onDelete, onAdd, onStatusChange }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSort = (field) => {
    if (params.sortBy === field) {
      onParamsChange({ sortOrder: params.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      onParamsChange({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const SortIcon = ({ field }) => {
    if (params.sortBy !== field) return <MdUnfoldMore size={13} style={{ opacity: .45 }} />;
    return params.sortOrder === 'asc'
      ? <MdArrowUpward   size={13} style={{ color:'var(--brand)' }} />
      : <MdArrowDownward size={13} style={{ color:'var(--brand)' }} />;
  };

  const confirmDelete = () => { onDelete(deleteConfirm); setDeleteConfirm(null); };

  return (
    <div className={styles.wrap}>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <MdSearch size={15} className={styles.searchIco} />
          <input
            className={styles.searchInput}
            placeholder="Search by name, email, company…"
            value={params.search}
            onChange={e => onParamsChange({ search: e.target.value })}
          />
        </div>

        <div className={styles.toolRight}>
          <select
            className={styles.filterSel}
            value={params.status || ''}
            onChange={e => onParamsChange({ status: e.target.value })}
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className={styles.filterSel}
            value={params.limit}
            onChange={e => onParamsChange({ limit: parseInt(e.target.value), page: 1 })}
          >
            {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          <button className="btn btn-primary btn-sm" onClick={onAdd}>
            <MdAdd size={15} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.th} onClick={() => handleSort('name')} style={{ cursor:'pointer', minWidth:200 }}>
                <span className={styles.thInner}>Lead <SortIcon field="name" /></span>
              </th>
              <th className={`${styles.th} ${styles.hideMob}`}>Company</th>
              <th className={`${styles.th} ${styles.hideTab}`} onClick={() => handleSort('status')} style={{ cursor:'pointer' }}>
                <span className={styles.thInner}>Status <SortIcon field="status" /></span>
              </th>
              <th className={`${styles.th} ${styles.hideTab}`} onClick={() => handleSort('value')} style={{ cursor:'pointer' }}>
                <span className={styles.thInner}>Value <SortIcon field="value" /></span>
              </th>
              <th className={`${styles.th} ${styles.hideMob}`} onClick={() => handleSort('createdAt')} style={{ cursor:'pointer' }}>
                <span className={styles.thInner}>Created <SortIcon field="createdAt" /></span>
              </th>
              <th className={styles.th} style={{ width:90 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <tr key={i} className={styles.tr}>
                  <td className={styles.td}>
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div className="skeleton" style={{ width:36, height:36, borderRadius:10, flexShrink:0 }} />
                      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                        <div className="skeleton" style={{ width:130, height:13 }} />
                        <div className="skeleton" style={{ width:170, height:11 }} />
                      </div>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.hideMob}`}><div className="skeleton" style={{ width:100, height:13 }} /></td>
                  <td className={`${styles.td} ${styles.hideTab}`}><div className="skeleton" style={{ width:76, height:22, borderRadius:99 }} /></td>
                  <td className={`${styles.td} ${styles.hideTab}`}><div className="skeleton" style={{ width:70, height:13 }} /></td>
                  <td className={`${styles.td} ${styles.hideMob}`}><div className="skeleton" style={{ width:88, height:13 }} /></td>
                  <td className={styles.td}></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-title">No leads found</div>
                  <p className="empty-state-desc">Try a different search or filter, or add your first lead.</p>
                  <button className="btn btn-primary btn-sm" onClick={onAdd}><MdAdd size={15} /> Add Lead</button>
                </div>
              </td></tr>
            ) : leads.map(lead => (
              <tr key={lead._id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.leadCell}>
                    <div className={styles.avatar} style={{ background: getAvatarColor(lead.name) }}>
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <div className={styles.leadName}>{lead.name}</div>
                      <div className={styles.leadEmail}>{lead.email}</div>
                      {lead.phone && <div className={styles.leadPhone}>{lead.phone}</div>}
                      {/* mobile badge */}
                      <div className={`${styles.showTab}`} style={{ marginTop:4 }}>
                        <span className={`badge ${getStatusClass(lead.status)}`}>{lead.status}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className={`${styles.td} ${styles.hideMob}`}>
                  <span className={styles.company}>{truncate(lead.company, 22) || '—'}</span>
                </td>

                <td className={`${styles.td} ${styles.hideTab}`}>
                  <select
                    className={`${styles.statusSel} badge badge-${lead.status?.toLowerCase()}`}
                    value={lead.status}
                    onChange={e => onStatusChange(lead._id, e.target.value)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>

                <td className={`${styles.td} ${styles.hideTab}`}>
                  <span className={styles.value}>{formatCurrency(lead.value)}</span>
                </td>

                <td className={`${styles.td} ${styles.hideMob}`}>
                  <span className={styles.date}>{formatDate(lead.createdAt)}</span>
                </td>

                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button className="btn btn-ghost btn-icon" onClick={() => onEdit(lead)} title="Edit">
                      <MdEdit size={16} />
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ color:'var(--red)' }} onClick={() => setDeleteConfirm(lead._id)} title="Delete">
                      <MdDelete size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {pagination.total > 0 && (
        <div className={styles.pagination}>
          <span className={styles.pgInfo}>
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of <strong>{pagination.total}</strong>
          </span>
          <div className={styles.pgBtns}>
            <button className="btn btn-secondary btn-sm btn-icon" disabled={pagination.page <= 1}
              onClick={() => onParamsChange({ page: pagination.page - 1 })}>
              <MdChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p}
                  className={`btn btn-sm ${pagination.page === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onParamsChange({ page: p })}>
                  {p}
                </button>
              );
            })}
            <button className="btn btn-secondary btn-sm btn-icon" disabled={pagination.page >= pagination.pages}
              onClick={() => onParamsChange({ page: pagination.page + 1 })}>
              <MdChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:420 }}>
            <div style={{ padding:'32px 28px', textAlign:'center' }}>
              <div style={{ fontSize:44, marginBottom:14 }}>🗑️</div>
              <h3 style={{ fontSize:18, marginBottom:8 }}>Delete this lead?</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:13.5, marginBottom:28, maxWidth:280, margin:'0 auto 24px' }}>
                This action cannot be undone. All lead data will be permanently removed.
              </p>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger"    onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

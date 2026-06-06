import { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdEmail, MdPhone, MdBusiness, MdNotes, MdAttachMoney } from 'react-icons/md';
import { STATUSES, SOURCE_OPTIONS } from '../utils/helpers';
import styles from './LeadModal.module.css';

const EMPTY = { name:'', email:'', phone:'', company:'', status:'New', notes:'', source:'Other', value:'' };

export default function LeadModal({ lead, onClose, onSave, loading }) {
  const [form, setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(lead ? { ...EMPTY, ...lead, value: lead.value || '' } : EMPTY);
    setErrors({});
  }, [lead]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSave({ ...form, value: form.value ? parseFloat(form.value) : 0 });
  };

  const isEdit = !!lead?._id;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{isEdit ? 'Edit Lead' : 'New Lead'}</h2>
            <p className={styles.sub}>{isEdit ? 'Update lead information' : 'Fill in the details below'}</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><MdClose size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Section: Contact */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Contact Info</div>
            <div className={styles.grid2}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name ? styles.errInput : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" />
                {errors.name && <span className={styles.err}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className={`form-input ${errors.email ? styles.errInput : ''}`} name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@company.com" />
                {errors.email && <span className={styles.err}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
              </div>
            </div>
          </div>

          {/* Section: Lead Details */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Lead Details</div>
            <div className={styles.grid3}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select className="form-select" name="source" value={form.source} onChange={handleChange}>
                  {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deal Value (₹)</label>
                <input className="form-input" name="value" type="number" min="0" value={form.value} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop:12 }}>
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Add any relevant notes…" rows={3} />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

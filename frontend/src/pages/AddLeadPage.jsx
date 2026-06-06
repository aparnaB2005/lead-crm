import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPerson, MdBusiness } from 'react-icons/md';
import { leadsApi } from '../api/leads';
import toast from 'react-hot-toast';
import { STATUSES, SOURCE_OPTIONS } from '../utils/helpers';
import styles from './AddLeadPage.module.css';

const EMPTY = { name:'', email:'', phone:'', company:'', status:'New', notes:'', source:'Other', value:'' };

export default function AddLeadPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await leadsApi.create({ ...form, value: form.value ? parseFloat(form.value) : 0 });
      toast.success('Lead created successfully!');
      navigate('/leads');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <MdArrowBack size={17} /> Back
        </button>
        <div>
          <h1 className={styles.title}>Add New Lead</h1>
          <p className={styles.sub}>Fill in the information below to create a new lead</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formWrap}>
        {/* Left column */}
        <div className={styles.col}>
          <div className={`card ${styles.section}`}>
            <div className={styles.sectionHead}>
              <MdPerson size={16} style={{ color:'var(--brand)' }} />
              <h3 className={styles.sectionTitle}>Contact Information</h3>
            </div>
            <div className={styles.grid2}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name ? styles.errInp : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className={`form-input ${errors.email ? styles.errInp : ''}`} name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@company.com" />
                {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
              </div>
            </div>
          </div>

          <div className={`card ${styles.section}`}>
            <div className={styles.sectionHead}>
              <MdBusiness size={16} style={{ color:'var(--brand)' }} />
              <h3 className={styles.sectionTitle}>Lead Details</h3>
            </div>
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
            <div className="form-group" style={{ marginTop:4 }}>
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Add any notes about this lead…" rows={4} />
            </div>
          </div>
        </div>

        {/* Right: summary + actions */}
        <div className={styles.sidebar}>
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
              <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                {loading ? <span className="spinner" /> : null}
                Create Lead
              </button>
              <button type="button" className="btn btn-secondary" style={{ width:'100%', justifyContent:'center' }} onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </div>

          <div className={`card ${styles.section}`} style={{ background:'var(--brand-light)', borderColor:'var(--brand-border)' }}>
            <h3 className={styles.sectionTitle} style={{ color:'var(--brand)' }}>Quick Tips</h3>
            <ul className={styles.tips}>
              <li>Use a valid email — it must be unique per lead.</li>
              <li>Set the status accurately to track pipeline progress.</li>
              <li>Add deal value to track pipeline revenue.</li>
              <li>Notes help your team stay in context.</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}

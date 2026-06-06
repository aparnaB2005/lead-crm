import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useLeads } from '../hooks/useLeads';
import LeadsTable from '../components/LeadsTable';
import LeadModal from '../components/LeadModal';
import styles from './LeadsPage.module.css';

export default function LeadsPage() {
  const { leads, pagination, loading, params, updateParams, createLead, updateLead, deleteLead, updateStatus } = useLeads();
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead]   = useState(null);
  const [saving, setSaving]       = useState(false);

  const openAdd  = () => { setEditLead(null); setModalOpen(true); };
  const openEdit = (lead) => { setEditLead(lead); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditLead(null); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      editLead?._id ? await updateLead(editLead._id, formData) : await createLead(formData);
      closeModal();
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.title}>Leads</h1>
          <p className={styles.sub}>{pagination.total} lead{pagination.total !== 1 ? 's' : ''} in total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <MdAdd size={17} /> Add Lead
        </button>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <LeadsTable
          leads={leads} loading={loading} pagination={pagination}
          params={params} onParamsChange={updateParams}
          onEdit={openEdit} onDelete={deleteLead}
          onAdd={openAdd} onStatusChange={updateStatus}
        />
      </div>

      {modalOpen && (
        <LeadModal lead={editLead} onClose={closeModal} onSave={handleSave} loading={saving} />
      )}
    </div>
  );
}

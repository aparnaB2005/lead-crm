import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {MdDashboard, MdPeople, MdAddCircle, MdTrendingUp,MdMenu, MdClose, MdNotifications, MdSearch} from 'react-icons/md';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import AddLeadPage from './pages/AddLeadPage';
import styles from './App.module.css';

const NAV = [
  { to: '/',          label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/leads',     label: 'All Leads',  icon: MdPeople },
  { to: '/leads/new', label: 'Add Lead',   icon: MdAddCircle },
];

function Topbar({ mobileOpen, setMobileOpen }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topLeft}>
        {/* Logo */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}><MdTrendingUp size={18} /></div>
          <span className={styles.brandName}>LeadFlow</span>
          <span className={styles.brandTag}>CRM</span>
        </div>

        {/* Desktop nav */}
        <nav className={styles.desktopNav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.topRight}>
        <div className={styles.topbarMeta}>
          <span className={styles.orgLabel}>Acme Corp</span>
        </div>
        <div className={styles.avatar}>AC</div>
        {/* Mobile burger */}
        <button className={`btn btn-ghost btn-icon ${styles.burger}`} onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
        </button>
      </div>
    </header>
  );
}

function MobileDrawer({ open, onClose }) {
  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerBrand}>
          <div className={styles.brandIcon}><MdTrendingUp size={16} /></div>
          <span className={styles.brandName}>LeadFlow</span>
        </div>
        <nav className={styles.drawerNav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className={styles.shell}>
        <Topbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className={styles.main}>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/leads"     element={<LeadsPage />} />
            <Route path="/leads/new" element={<AddLeadPage />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#0D1B2E',
            border: '1px solid #E3E8EF',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(13,27,46,.10)',
          },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

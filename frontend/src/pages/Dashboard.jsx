import { useNavigate } from 'react-router-dom';
import {
  MdPeople, MdTrendingUp, MdCheckCircle, MdCancel,
  MdAttachMoney, MdAdd, MdArrowForward
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { useStats } from '../hooks/useLeads';
import StatsCard from '../components/StatsCard';
import {
  formatCurrency, formatDate, getInitials,
  getAvatarColor, getStatusClass, STATUS_CONFIG
} from '../utils/helpers';
import styles from './Dashboard.module.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', boxShadow:'var(--sh-md)' }}>
      <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:800, color:'var(--brand)' }}>{payload[0].value} <span style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)' }}>leads</span></div>
    </div>
  );
};

export default function Dashboard() {
  const { stats, loading } = useStats();
  const navigate = useNavigate();

  const pieData = stats
    ? Object.entries(stats.statusCounts)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value, color: STATUS_CONFIG[name]?.dot }))
    : [];

  const barData = stats?.monthlyTrend?.map(m => ({
    name: MONTHS[m._id.month - 1], leads: m.count,
  })) || [];

  const now = new Date();
  const h = now.getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.statsRow}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ padding:20, minHeight:120 }}>
              <div className="skeleton" style={{ width:40, height:40, borderRadius:12, marginBottom:14 }} />
              <div className="skeleton" style={{ width:60, height:30, marginBottom:8 }} />
              <div className="skeleton" style={{ width:100, height:13 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHead}>
        <div>
          <p className={styles.greeting}>{greeting} 👋</p>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/leads/new')}>
          <MdAdd size={17} /> New Lead
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <StatsCard icon={<MdPeople size={20}/>}      label="Total Leads"     value={stats?.total}                   color="var(--blue)"   />
        <StatsCard icon={<MdTrendingUp size={20}/>}  label="Qualified"       value={stats?.statusCounts?.Qualified} color="var(--purple)" />
        <StatsCard icon={<MdCheckCircle size={20}/>} label="Converted"       value={stats?.statusCounts?.Converted} color="var(--green)"  sub={`${stats?.conversionRate}% conversion`} />
        <StatsCard icon={<MdCancel size={20}/>}      label="Lost"            value={stats?.statusCounts?.Lost}      color="var(--red)"    />
        <StatsCard icon={<MdAttachMoney size={20}/>} label="Pipeline Value"  value={formatCurrency(stats?.totalValue)} color="var(--amber)" sub={`Avg ${formatCurrency(stats?.avgValue)}`} />
      </div>

      {/* ── Charts ── */}
      <div className={styles.chartsGrid}>

        {/* Bar chart */}
        <div className={`card ${styles.chartBox}`}>
          <div className={styles.boxHead}>
            <h3 className={styles.boxTitle}>Monthly Leads</h3>
            <span className={styles.boxSub}>Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={barData} margin={{ top:4, right:4, left:-24, bottom:0 }}>
              <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill:'rgba(37,99,235,.06)', radius:6 }} />
              <Bar dataKey="leads" radius={[6,6,0,0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={i === barData.length-1 ? 'var(--brand)' : '#E3E8EF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className={`card ${styles.chartBox}`}>
          <div className={styles.boxHead}>
            <h3 className={styles.boxTitle}>Lead Mix</h3>
            <span className={styles.boxSub}>By status</span>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [v, n]}
                  contentStyle={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, boxShadow:'var(--sh-md)', fontSize:13 }}
                />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color:'var(--text-secondary)', fontSize:12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding:'32px 0' }}><p className="empty-state-desc">No data yet</p></div>
          )}
        </div>

        {/* Pipeline */}
        <div className={`card ${styles.chartBox}`}>
          <div className={styles.boxHead}>
            <h3 className={styles.boxTitle}>Pipeline</h3>
            <span className={styles.boxSub}>Status breakdown</span>
          </div>
          <div className={styles.pipeline}>
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const count = stats?.statusCounts?.[status] || 0;
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status} className={styles.pipeRow}>
                  <div className={styles.pipeLeft}>
                    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                    <span className={styles.pipeCount}>{count}</span>
                  </div>
                  <div className={styles.pipeTrack}>
                    <div className={styles.pipeFill} style={{ width:`${pct}%`, background: cfg.dot }} />
                  </div>
                  <span className={styles.pipePct}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Leads ── */}
      {stats?.recentLeads?.length > 0 && (
        <div className={`card ${styles.recentBox}`}>
          <div className={styles.boxHead}>
            <h3 className={styles.boxTitle}>Recent Leads</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/leads')}>
              View All <MdArrowForward size={14} />
            </button>
          </div>
          <div className={styles.recentGrid}>
            {stats.recentLeads.map(lead => (
              <div key={lead._id} className={styles.recentCard}>
                <div className={styles.recentTop}>
                  <div className={styles.rAvatar} style={{ background: getAvatarColor(lead.name) }}>
                    {getInitials(lead.name)}
                  </div>
                  <span className={`badge ${getStatusClass(lead.status)}`}>{lead.status}</span>
                </div>
                <div className={styles.rName}>{lead.name}</div>
                <div className={styles.rMeta}>{lead.company || '—'}</div>
                <div className={styles.rEmail}>{lead.email}</div>
                <div className={styles.rDate}>{formatDate(lead.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import './index.css';

// Import extracted pages
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfile from './pages/ArtistProfile';
import BookingsPage from './pages/BookingsPage';
import SchedulePage from './pages/SchedulePage';

/**
 * Mock data for initial UI rendering
 */
const mockArtists = [
  { id: 'a1', name: 'Luna Blue', genre: 'Pop', rating: 4.8, bookings: 24, nextShow: '2025-10-02', status: 'Active' },
  { id: 'a2', name: 'Echo Wave', genre: 'EDM', rating: 4.6, bookings: 18, nextShow: '2025-09-25', status: 'Active' },
  { id: 'a3', name: 'Crimson Strings', genre: 'Indie Rock', rating: 4.2, bookings: 12, nextShow: '2025-10-12', status: 'Paused' },
  { id: 'a4', name: 'Amber Sky', genre: 'R&B', rating: 4.7, bookings: 20, nextShow: '2025-09-30', status: 'Active' },
];

const mockBookings = [
  { id: 'b101', artist: 'Luna Blue', venue: 'Ocean Hall', city: 'Miami', date: '2025-09-24', fee: 12000, status: 'Confirmed' },
  { id: 'b102', artist: 'Echo Wave', venue: 'Neon Dome', city: 'Las Vegas', date: '2025-09-28', fee: 24000, status: 'Pending' },
  { id: 'b103', artist: 'Crimson Strings', venue: 'Indigo Arena', city: 'Seattle', date: '2025-10-05', fee: 9000, status: 'Cancelled' },
  { id: 'b104', artist: 'Amber Sky', venue: 'Sunset Pavilion', city: 'Los Angeles', date: '2025-10-01', fee: 15000, status: 'Confirmed' },
];

const mockEvents = [
  { id: 'e701', title: 'Summer Splash', artist: 'Luna Blue', date: '2025-09-24', time: '20:00', location: 'Miami • Ocean Hall', type: 'Show' },
  { id: 'e702', title: 'Neon Nights', artist: 'Echo Wave', date: '2025-09-28', time: '22:00', location: 'Las Vegas • Neon Dome', type: 'Festival' },
  { id: 'e703', title: 'Indie Autumn', artist: 'Crimson Strings', date: '2025-10-05', time: '19:30', location: 'Seattle • Indigo Arena', type: 'Showcase' },
  { id: 'e704', title: 'Amber Sessions', artist: 'Amber Sky', date: '2025-10-01', time: '21:00', location: 'Los Angeles • Sunset Pavilion', type: 'Residency' },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

/**
 * Sidebar component
 */
// PUBLIC_INTERFACE
function Sidebar() {
  /** Sidebar for app navigation, styled with Ocean Professional theme */
  const [open, setOpen] = useState(false);
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/artists', label: 'Artists', icon: '🎤' },
    { to: '/bookings', label: 'Bookings', icon: '📅' },
    { to: '/schedule', label: 'Schedule', icon: '🗓️' },
  ];

  const closeOnNavigate = () => setOpen(false);

  return (
    <aside className={classNames('sidebar', open && 'open')} aria-label="Sidebar Navigation">
      <div className="brand">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div className="brand-logo" aria-hidden>A</div>
          <div className="brand-name">ArtistMgmt</div>
        </div>
        <button
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </div>
      <nav className="nav" role="navigation">
        {navItems.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            onClick={closeOnNavigate}
            className={({ isActive }) => classNames(isActive && 'active')}
          >
            <span role="img" aria-label={n.label} style={{ width: 20, display:'inline-flex', justifyContent:'center' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

/**
 * Header component
 */
// PUBLIC_INTERFACE
function Header({ onAdd }) {
  /** Top header with search and actions */
  return (
    <div className="header">
      <div className="searchbar">
        <input className="input" placeholder="Search artists, bookings, venues..." aria-label="Search" />
        <button className="btn ghost" onClick={() => onAdd?.()}><span>＋</span>Quick Add</button>
      </div>
      <div className="user">
        <div>
          <div style={{ fontWeight: 700 }}>Agency Staff</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>admin@agency.com</div>
        </div>
        <div className="avatar" />
      </div>
    </div>
  );
}

/**
 * Dashboard page
 */
// PUBLIC_INTERFACE
function DashboardPage() {
  /** Dashboard widgets for KPIs and quick lists */
  const totals = useMemo(() => {
    const revenue = mockBookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.fee, 0);
    const activeArtists = mockArtists.filter(a => a.status === 'Active').length;
    const upcoming = mockEvents.length;
    const conversion = Math.round((mockBookings.filter(b => b.status === 'Confirmed').length / mockBookings.length) * 100);
    return { revenue, activeArtists, upcoming, conversion };
  }, []);

  return (
    <div>
      <div className="page-title">
        <h1>Dashboard</h1>
        <div className="page-actions">
          <button className="btn"><span>📥</span>Import</button>
          <button className="btn secondary"><span>➕</span>New Booking</button>
        </div>
      </div>
      <div className="grid">
        <div className="card widget col-3">
          <h3>Revenue (30d)</h3>
          <div className="metric">${(totals.revenue).toLocaleString()} <span className="delta up">+8.4%</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Active Artists</h3>
          <div className="metric">{totals.activeArtists} <span className="delta up">+1</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Upcoming Events</h3>
          <div className="metric">{totals.upcoming} <span className="delta down">-2</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Booking Confirmations</h3>
          <div className="metric">{totals.conversion}% <span className="delta up">+3%</span></div>
        </div>

        <div className="card widget col-8">
          <h3>Recent Bookings</h3>
          <div className="table-wrap" role="region" aria-label="Recent bookings scroll area">
            <table className="table" role="table" aria-label="Recent bookings">
              <thead>
                <tr>
                  <th>Artist</th><th>Venue</th><th>City</th><th>Date</th><th>Fee</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.slice(0,4).map(b => (
                  <tr key={b.id}>
                    <td>{b.artist}</td>
                    <td>{b.venue}</td>
                    <td>{b.city}</td>
                    <td>{b.date}</td>
                    <td>${b.fee.toLocaleString()}</td>
                    <td>
                      <span className="badge">
                        <span className="badge-dot" style={{ background: b.status === 'Confirmed' ? '#10B981' : b.status === 'Pending' ? '#F59E0B' : '#EF4444' }} />
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card widget col-4">
          <h3>Top Artists</h3>
          <div className="list">
            {mockArtists.slice(0,4).map(a => (
              <div className="list-item" key={a.id}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="avatar" style={{ width:32, height:32 }} />
                  <div>
                    <div style={{ fontWeight:700 }}>{a.name}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{a.genre}</div>
                  </div>
                </div>
                <div className="badge"><span className="badge-dot" style={{ background:'#F59E0B' }} />{a.bookings} bookings</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Routing wrapper to handle /artists/:id simple view.
 */
function ArtistsRoutes() {
  const path = window.location.pathname;
  const isDetail = /^\/artists\/[^/]+$/.test(path);
  if (isDetail) {
    const id = path.split('/').pop();
    return <ArtistProfile id={id} mockArtists={mockArtists} mockBookings={mockBookings} />;
  }
  return <ArtistsPage mockArtists={mockArtists} />;
}

/**
 * Root Layout
 */
// PUBLIC_INTERFACE
function Layout() {
  /** Main app layout with sidebar and top header */
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/artists/*" element={<ArtistsRoutes />} />
          <Route path="/bookings" element={<BookingsPage mockBookings={mockBookings} />} />
          <Route path="/schedule" element={<SchedulePage mockEvents={mockEvents} />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Application entry mounting BrowserRouter and layout.
   * Ready for API integration by replacing mock data with fetches.
   */
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;

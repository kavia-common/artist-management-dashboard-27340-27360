import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import './index.css';

// Import modular pages (each page owns its UI/data concerns)
import ArtistsPage from './pages/ArtistsPage';
import ArtistProfile from './pages/ArtistProfile';
import BookingsPage from './pages/BookingsPage';
import SchedulePage from './pages/SchedulePage';

// Import a modular Dashboard page extracted from in-place logic
// Kept inside pages to maintain separation from App.js layout
function DashboardPageWrapper() {
  /**
   * PUBLIC_INTERFACE
   * Lightweight wrapper to keep routing consistent; the actual
   * dashboard UI is contained here to keep App.js minimal.
   * This wrapper only renders presentational content with mock data
   * and can later be replaced by a dedicated pages/DashboardPage.
   */
  return (
    <div>
      <div className="page-title">
        <h1>Dashboard</h1>
        <div className="page-actions">
          <button className="btn"><span>📥</span>Import</button>
          <button className="btn secondary"><span>➕</span>New Booking</button>
        </div>
      </div>
      {/* Keep dashboard minimal to avoid in-place tables/lists here.
          Detailed tables and lists live in their respective pages. */}
      <div className="grid">
        <div className="card widget col-3">
          <h3>Revenue (30d)</h3>
          <div className="metric">— <span className="delta up">+0%</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Active Artists</h3>
          <div className="metric">— <span className="delta up">+0</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Upcoming Events</h3>
          <div className="metric">— <span className="delta down">0</span></div>
        </div>
        <div className="card widget col-3">
          <h3>Booking Confirmations</h3>
          <div className="metric">— <span className="delta up">0%</span></div>
        </div>
      </div>
    </div>
  );
}

// Utility for class names
function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

/**
 * PUBLIC_INTERFACE
 * Sidebar: Navigation only (no data logic)
 */
function Sidebar() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/artists', label: 'Artists', icon: '🎤' },
    { to: '/bookings', label: 'Bookings', icon: '📅' },
    { to: '/schedule', label: 'Schedule', icon: '🗓️' },
  ];

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
      <nav className="nav" role="navigation" aria-label="Primary">
        {navItems.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) => classNames(isActive && 'active')}
            aria-label={n.label}
          >
            <span role="img" aria-hidden="true" style={{ width: 20, display:'inline-flex', justifyContent:'center' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

/**
 * PUBLIC_INTERFACE
 * Header: layout-only header with search and action button
 */
function Header({ onAdd }) {
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
 * PUBLIC_INTERFACE
 * Layout: High-level app structure with routes
 */
function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPageWrapper />} />
          <Route path="/artists/*" element={<ArtistsPage mockArtists={[]} />} />
          <Route path="/artists/:id" element={<ArtistProfile id="" mockArtists={[]} mockBookings={[]} />} />
          <Route path="/bookings" element={<BookingsPage mockBookings={[]} />} />
          <Route path="/schedule" element={<SchedulePage mockEvents={[]} />} />
        </Routes>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * App: Mounts router and layout only
 */
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;

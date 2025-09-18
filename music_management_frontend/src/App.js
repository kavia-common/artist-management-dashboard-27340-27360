import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import './index.css';

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
 * PUBLIC UTILS for future API integration
 */
// PUBLIC_INTERFACE
export function groupBookingsByCity(bookings) {
  /** Groups bookings by city; returns { cityName: Booking[] } */
  return bookings.reduce((acc, b) => {
    const key = b.city || 'Unknown';
    acc[key] = acc[key] || [];
    acc[key].push(b);
    return acc;
  }, {});
}

// PUBLIC_INTERFACE
export function detectCityConflicts(bookings) {
  /**
   * Detect potential conflicts: same artist, same date, same city
   * Returns a Set of booking IDs that are considered conflicts.
   */
  const conflicts = new Set();
  const byKey = {};
  bookings.forEach(b => {
    const key = `${b.city}__${b.artist}__${b.date}`;
    byKey[key] = byKey[key] || [];
    byKey[key].push(b);
  });
  Object.values(byKey).forEach(list => {
    if (list.length > 1) {
      list.forEach(b => conflicts.add(b.id));
    }
  });
  return conflicts;
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
 * Artists page
 */
// PUBLIC_INTERFACE
function ArtistsPage() {
  /** Artists table with filters/search (mock) */
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return mockArtists.filter(a =>
      [a.name, a.genre, a.status].join(' ').toLowerCase().includes(t)
    );
  }, [q]);

  const navigate = useNavigate();

  return (
    <div>
      <div className="page-title">
        <h1>Artists</h1>
        <div className="page-actions">
          <button className="btn" onClick={() => alert('Create artist (mock)')}><span>➕</span>Add Artist</button>
        </div>
      </div>

      <div className="card widget col-12" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 14, display:'flex', flexWrap:'wrap', gap:10, borderBottom:'1px solid var(--border)' }}>
          <input className="input" placeholder="Search artists..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex:'1 1 220px' }} />
          <select className="select" defaultValue="" style={{ flex:'1 1 160px', minWidth:140 }}>
            <option value="">All Genres</option>
            <option>Pop</option>
            <option>EDM</option>
            <option>Indie Rock</option>
            <option>R&B</option>
          </select>
          <select className="select" defaultValue="" style={{ flex:'1 1 140px', minWidth:120 }}>
            <option value="">All Status</option>
            <option>Active</option>
            <option>Paused</option>
          </select>
        </div>
        <div style={{ padding: 14 }}>
          <div className="table-wrap" role="region" aria-label="Artists table scroll area">
            <table className="table" role="table" aria-label="Artists">
              <thead>
                <tr>
                  <th>Name</th><th>Genre</th><th>Rating</th><th>Bookings</th><th>Next Show</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight:700 }}>{a.name}</td>
                    <td>{a.genre}</td>
                    <td>{a.rating}</td>
                    <td>{a.bookings}</td>
                    <td>{a.nextShow}</td>
                    <td>
                      <span className="badge">
                        <span className="badge-dot" style={{ background: a.status === 'Active' ? '#10B981' : '#9CA3AF' }} />
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn ghost" onClick={() => navigate(`/artists/${a.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Artist profile details (mock)
 */
// PUBLIC_INTERFACE
function ArtistProfile({ id }) {
  /** Simple artist profile page fed by mock data */
  const artist = mockArtists.find(a => a.id === id) || mockArtists[0];
  const upcoming = mockBookings.filter(b => b.artist === artist.name);

  return (
    <div>
      <div className="page-title">
        <h1>{artist.name}</h1>
        <div className="badge"><span className="badge-dot" style={{ background: artist.status === 'Active' ? '#10B981' : '#9CA3AF' }} />{artist.status}</div>
      </div>

      <div className="grid">
        <div className="card widget col-4">
          <h3>Profile</h3>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div className="avatar" style={{ width:64, height:64 }} />
            <div>
              <div style={{ fontWeight:800, fontSize:18 }}>{artist.name}</div>
              <div style={{ color:'var(--muted)' }}>{artist.genre}</div>
            </div>
          </div>
          <div style={{ marginTop:14, display:'flex', gap:10 }}>
            <button className="btn">Edit Profile</button>
            <button className="btn secondary">New Booking</button>
          </div>
        </div>

        <div className="card widget col-8">
          <h3>Upcoming Bookings</h3>
          <div className="table-wrap" role="region" aria-label="Upcoming bookings scroll area">
            <table className="table">
              <thead>
                <tr><th>Venue</th><th>City</th><th>Date</th><th>Fee</th><th>Status</th></tr>
              </thead>
              <tbody>
                {upcoming.map(b => (
                  <tr key={b.id}>
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
                {upcoming.length === 0 && (
                  <tr><td colSpan="5" style={{ color:'var(--muted)' }}>No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bookings page with "By City" tab and conflict highlighting
 */
// PUBLIC_INTERFACE
function BookingsPage() {
  /**
   * Bookings overview with two tabs:
   * - All: All bookings flat list
   * - By City: Grouped by city, with conflict highlighting (same artist, same date, same city)
   * This structure is extensible for future API integration: replace mockBookings with fetched data.
   */
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'city'
  const [cityFilter, setCityFilter] = useState('');   // optional city dropdown filter inside "By City"

  const bookings = mockBookings; // later: replace with API data
  const conflicts = useMemo(() => detectCityConflicts(bookings), [bookings]);
  const grouped = useMemo(() => groupBookingsByCity(bookings), [bookings]);
  const cities = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const tabBtn = (id, label) => (
    <button
      className={classNames('btn ghost', activeTab === id && 'active')}
      onClick={() => setActiveTab(id)}
      aria-pressed={activeTab === id}
      style={{
        borderColor: activeTab === id ? 'var(--primary)' : 'var(--border)',
        color: activeTab === id ? 'var(--primary)' : 'var(--text)',
        background: activeTab === id ? 'rgba(37,99,235,0.08)' : 'white'
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="page-title">
        <h1>Bookings</h1>
        <div className="page-actions">
          <button className="btn"><span>➕</span>New Booking</button>
        </div>
      </div>

      <div className="card widget col-12" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ padding: 14, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {tabBtn('all', 'All')}
          {tabBtn('city', 'By City')}
          {activeTab === 'city' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <label htmlFor="cityFilter" style={{ fontSize: 13, color: 'var(--muted)' }}>City</label>
              <select
                id="cityFilter"
                className="select"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ minWidth: 160 }}
              >
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 14 }}>
          {activeTab === 'all' && (
            <>
              <h3>All Bookings</h3>
              <div className="table-wrap" role="region" aria-label="Bookings table scroll area">
                <table className="table" role="table" aria-label="Bookings">
                  <thead>
                    <tr><th>Artist</th><th>Venue</th><th>City</th><th>Date</th><th>Fee</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const isConflict = conflicts.has(b.id);
                      return (
                        <tr key={b.id} style={isConflict ? { outline: '2px solid rgba(245,158,11,0.35)', outlineOffset: '-2px' } : undefined}>
                          <td style={{ fontWeight:700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {b.artist}
                            {isConflict && (
                              <span className="badge" title="Potential conflict: same artist booked in same city and date">
                                <span className="badge-dot" style={{ background: '#F59E0B' }} />Conflict
                              </span>
                            )}
                          </td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'city' && (
            <>
              <h3>Bookings by City</h3>
              {/* Summary chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0 14px' }}>
                {cities.map(c => {
                  const list = grouped[c] || [];
                  const cityConflicts = detectCityConflicts(list);
                  const hasConflicts = cityConflicts.size > 0;
                  return (
                    <span key={c} className="badge" style={{ background: hasConflicts ? '#FFF7ED' : '#F3F4F6', borderColor: hasConflicts ? '#FED7AA' : 'var(--border)' }}>
                      <span className="badge-dot" style={{ background: hasConflicts ? '#F59E0B' : '#2563EB' }} />
                      {c} • {list.length}
                      {hasConflicts && <span style={{ marginLeft: 6, color: '#F59E0B' }}>(conflicts)</span>}
                    </span>
                  );
                })}
              </div>

              {/* Grouped tables */}
              {cities
                .filter(c => !cityFilter || c === cityFilter)
                .map(city => {
                  const list = grouped[city] || [];
                  const cityConflicts = detectCityConflicts(list);
                  return (
                    <div key={city} className="card" style={{ borderColor: 'var(--border)', marginBottom: 14 }}>
                      <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="badge" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                            <span className="badge-dot" style={{ background: '#2563EB' }} />
                            {city}
                          </span>
                          <span style={{ color: 'var(--muted)', fontSize: 13 }}>{list.length} booking{list.length !== 1 ? 's' : ''}</span>
                        </div>
                        {cityConflicts.size > 0 && (
                          <span className="badge" title="Potential conflicts detected in this city">
                            <span className="badge-dot" style={{ background: '#F59E0B' }} />
                            {cityConflicts.size} conflict{cityConflicts.size !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="table-wrap" role="region" aria-label={`Bookings in ${city} scroll area`}>
                        <table className="table" role="table" aria-label={`Bookings in ${city}`}>
                          <thead>
                            <tr><th>Artist</th><th>Venue</th><th>Date</th><th>Fee</th><th>Status</th></tr>
                          </thead>
                          <tbody>
                            {list.map(b => {
                              const isConflict = cityConflicts.has(b.id);
                              return (
                                <tr key={b.id} style={isConflict ? { outline: '2px solid rgba(245,158,11,0.35)', outlineOffset: '-2px' } : undefined}>
                                  <td style={{ fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                                    {b.artist}
                                    {isConflict && (
                                      <span className="badge" title="Potential conflict: same artist booked in same city and date">
                                        <span className="badge-dot" style={{ background: '#F59E0B' }} />Conflict
                                      </span>
                                    )}
                                  </td>
                                  <td>{b.venue}</td>
                                  <td>{b.date}</td>
                                  <td>${b.fee.toLocaleString()}</td>
                                  <td>
                                    <span className="badge">
                                      <span className="badge-dot" style={{ background: b.status === 'Confirmed' ? '#10B981' : b.status === 'Pending' ? '#F59E0B' : '#EF4444' }} />
                                      {b.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {list.length === 0 && (
                              <tr><td colSpan="5" style={{ color:'var(--muted)' }}>No bookings for this city.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Schedule page
 */
// PUBLIC_INTERFACE
function SchedulePage() {
  /** Event schedule list with dates and types */
  return (
    <div>
      <div className="page-title">
        <h1>Schedule</h1>
        <div className="page-actions">
          <button className="btn secondary"><span>📤</span>Export</button>
        </div>
      </div>
      <div className="card widget col-12">
        <h3>Upcoming Events</h3>
        <div className="list">
          {mockEvents.map(e => (
            <div className="list-item" key={e.id}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div className="badge" style={{ background:'#EFF6FF', borderColor:'#BFDBFE' }}>
                  <span role="img" aria-label="calendar">📆</span>{e.date} • {e.time}
                </div>
                <div>
                  <div style={{ fontWeight:800 }}>{e.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{e.artist} • {e.location}</div>
                </div>
              </div>
              <div>
                <span className="badge">
                  <span className="badge-dot" style={{ background: '#2563EB' }} />
                  {e.type}
                </span>
              </div>
            </div>
          ))}
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
    return <ArtistProfile id={id} />;
  }
  return <ArtistsPage />;
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
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
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

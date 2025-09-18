import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ArtistsPage
 * Artists table with filters/search (mock).
 * Expects props:
 *  - mockArtists: array of artist objects
 */
export default function ArtistsPage({ mockArtists }) {
  /** Artists table with filters/search (mock) */
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return mockArtists.filter(a =>
      [a.name, a.genre, a.status].join(' ').toLowerCase().includes(t)
    );
  }, [q, mockArtists]);

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

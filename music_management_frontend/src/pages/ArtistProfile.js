import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ArtistProfile
 * Simple artist profile page fed by mock data.
 * Props:
 *  - id: artist id string
 *  - mockArtists: array of artist objects
 *  - mockBookings: array of booking objects
 */
export default function ArtistProfile({ id, mockArtists, mockBookings }) {
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

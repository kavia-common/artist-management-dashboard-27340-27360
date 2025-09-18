import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SchedulePage
 * Event schedule list with dates and types.
 * Props:
 *  - mockEvents: array of event objects
 */
export default function SchedulePage({ mockEvents }) {
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

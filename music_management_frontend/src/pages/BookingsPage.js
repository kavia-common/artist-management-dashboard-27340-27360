import React, { useMemo, useState } from 'react';
import BookingsTable from '../components/BookingsTable';
import { detectCityConflicts, groupBookingsByCity } from '../components/utils/bookingUtils';

/**
 * PUBLIC_INTERFACE
 * BookingsPage
 * Bookings overview with tabs and conflict highlighting.
 * Props:
 *  - mockBookings: array of bookings
 */
export default function BookingsPage({ mockBookings }) {
  /**
   * Bookings overview with two tabs:
   * - All: All bookings flat list
   * - By City: Grouped by city, with conflict highlighting (same artist, same date, same city)
   */
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'city'
  const [cityFilter, setCityFilter] = useState('');   // optional city dropdown filter inside "By City"

  const bookings = mockBookings; // later: replace with API data
  const conflicts = useMemo(() => detectCityConflicts(bookings), [bookings]);
  const grouped = useMemo(() => groupBookingsByCity(bookings), [bookings]);
  const cities = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const tabBtn = (id, label) => (
    <button
      className={['btn ghost', activeTab === id && 'active'].filter(Boolean).join(' ')}
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
        <div className="card-header" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {tabBtn('all', 'All')}
          {tabBtn('city', 'By City')}
          {activeTab === 'city' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <label htmlFor="cityFilter" style={{ fontSize: 13, color: 'var(--muted)' }}>City</label>
              <select
                id="cityFilter"
                aria-label="Filter bookings by city"
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
              <BookingsTable bookings={bookings} conflictIds={conflicts} />
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
                      <BookingsTable
                        bookings={list}
                        conflictIds={cityConflicts}
                        columns={['Artist','Venue','Date','Fee','Status']}
                      />
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

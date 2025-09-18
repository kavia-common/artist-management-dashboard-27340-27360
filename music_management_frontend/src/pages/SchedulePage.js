import React from 'react';
import EventList from '../components/EventList';

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
      <EventList events={mockEvents} title="Upcoming Events" />
    </div>
  );
}

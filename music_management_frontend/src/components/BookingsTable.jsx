 import React from 'react';
 
 /**
  * PUBLIC_INTERFACE
  * BookingsTable
  * Reusable bookings table with optional conflict highlighting.
  * Props:
  *  - bookings: array of booking objects
  *  - conflictIds: Set of booking ids to highlight (optional)
  *  - columns: optional override array for column visibility (default shows: Artist, Venue, City, Date, Fee, Status)
  */
 export default function BookingsTable({ bookings = [], conflictIds, columns }) {
   const cols = columns || ['Artist','Venue','City','Date','Fee','Status'];
   const show = name => cols.includes(name);
   const isConflict = (b) => conflictIds?.has ? conflictIds.has(b.id) : false;
 
   return (
     <div className="table-wrap" role="region" aria-label="Bookings table scroll area">
       <table className="table" role="table" aria-label="Bookings">
         <thead>
           <tr>
             {show('Artist') && <th>Artist</th>}
             {show('Venue') && <th>Venue</th>}
             {show('City') && <th>City</th>}
             {show('Date') && <th>Date</th>}
             {show('Fee') && <th>Fee</th>}
             {show('Status') && <th>Status</th>}
           </tr>
         </thead>
         <tbody>
           {bookings.map(b => (
             <tr key={b.id} style={isConflict(b) ? { outline: '2px solid rgba(245,158,11,0.35)', outlineOffset: '-2px' } : undefined}>
               {show('Artist') && (
                 <td style={{ fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                   {b.artist}
                   {isConflict(b) && (
                     <span className="badge" title="Potential conflict: same artist booked in same city and date">
                       <span className="badge-dot" style={{ background: '#F59E0B' }} />Conflict
                     </span>
                   )}
                 </td>
               )}
               {show('Venue') && <td>{b.venue}</td>}
               {show('City') && <td>{b.city}</td>}
               {show('Date') && <td>{b.date}</td>}
               {show('Fee') && <td>${b.fee?.toLocaleString?.() ?? b.fee}</td>}
               {show('Status') && (
                 <td>
                   <span className="badge">
                     <span className="badge-dot" style={{ background: b.status === 'Confirmed' ? '#10B981' : b.status === 'Pending' ? '#F59E0B' : '#EF4444' }} />
                     {b.status}
                   </span>
                 </td>
               )}
             </tr>
           ))}
           {bookings.length === 0 && (
             <tr>
               <td colSpan={cols.length}>
                 <div className="empty-state">No bookings found.</div>
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   );
 }

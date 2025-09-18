 import React from 'react';
 
 /**
  * PUBLIC_INTERFACE
  * EventList
  * Reusable list view for events.
  * Props:
  *  - events: array of event objects
  *  - title: optional section title
  */
 export default function EventList({ events = [], title }) {
   return (
     <div className="card widget col-12">
       {title && <h3>{title}</h3>}
       <div className="list">
         {events.map(e => (
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
         {events.length === 0 && (
           <div className="empty-state">No events scheduled.</div>
         )}
       </div>
     </div>
   );
 }

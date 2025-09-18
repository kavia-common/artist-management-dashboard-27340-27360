 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 
 /**
  * PUBLIC_INTERFACE
  * ArtistListTable
  * Reusable artists list/table with View action.
  * Props:
  *  - artists: array of artist objects
  */
 export default function ArtistListTable({ artists = [] }) {
   const navigate = useNavigate();
   return (
     <div className="table-wrap" role="region" aria-label="Artists table scroll area">
       <table className="table" role="table" aria-label="Artists">
         <thead>
           <tr>
             <th>Name</th><th>Genre</th><th>Rating</th><th>Bookings</th><th>Next Show</th><th>Status</th><th></th>
           </tr>
         </thead>
         <tbody>
           {artists.map(a => (
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
           {artists.length === 0 && (
             <tr>
               <td colSpan="7">
                 <div className="empty-state">No artists found.</div>
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   );
 }

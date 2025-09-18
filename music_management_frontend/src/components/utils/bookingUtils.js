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

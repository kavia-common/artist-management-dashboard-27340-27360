# Music Artist Management Dashboard (Frontend)

Ocean Professional themed React frontend providing:
- Sidebar layout with modern, clean UI
- Dashboard with KPI widgets and recent lists
- Artists list and profile detail view
- Bookings overview with status badges
- Schedule of upcoming events

Tech:
- React 18, react-router-dom 6, Create React App

Available pages:
- /            -> Dashboard
- /artists     -> Artists overview
- /artists/:id -> Artist profile (mocked)
- /bookings    -> Bookings table
- /schedule    -> Event schedule

Data:
- Currently uses mock data within App.js for artists, bookings, and events.
- Replace with API calls later (e.g., fetch/axios) and state management as needed.

Styling:
- Ocean Professional theme: primary #2563EB, secondary #F59E0B
- Minimalist components with rounded corners and subtle shadows
- Global styles are in src/index.css and layout in src/App.css

Run:
- npm install
- npm start

Tests:
- Basic smoke test verifying Dashboard title renders.

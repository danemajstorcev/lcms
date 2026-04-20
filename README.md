LCMS — Load & Carrier Management System


Project Description

LCMS is a full-featured logistics dispatch management system built for freight dispatchers and brokers. It provides a centralized dashboard to manage loads, carriers, drivers, brokers, and invoices — all in one place.
The app features a Kanban-style dispatch board for live load tracking, a full analytics and reporting suite with charts, an invoice workflow with Draft → Send → Paid progression, and a complete CRUD system across all entities. Built with a dark/light industrial aesthetic designed for long dispatcher sessions.


Tech Stack / Built With:

- React
- TypeScript
- Vite
- CSS Custom Properties (design token system)
- Recharts (analytics charts)
- MySQL (database schema included)
- Express + mysql (backend API, optional)


Features:

- Dashboard with KPI cards, revenue vs profit line chart, load status donut chart, and activity feed
- Kanban dispatch board with drag-and-drop load status updates across 4 columns
- Full Loads management — search, filter by status, paginated table, full CRUD
- Carriers management — filter by equipment type and status, load count per carrier
- Drivers management — CDL tracking, carrier assignment, mileage
- Brokers management — revenue and profit rollup per broker
- Invoices — Draft → Send → Mark Paid workflow with outstanding A/R summary
- Reports — 4 charts: monthly revenue trend, profit by carrier, revenue by broker, loads by equipment type
- Dark and light mode toggle
- Fully responsive layout for desktop, tablet, and mobile
- Sidebar navigation with live badge counters for active loads and draft invoices
- Paginated tables across all entity views


Getting Started / Installation:

- Clone the repository:
git clone https://github.com/danemajstorcev/lcms

- Navigate to the project folder:
cd lcms

- Install dependencies:
npm install

- Run the development server:
npm run dev

- Open in browser:
http://localhost:5173


Connecting the MySQL Database: (Optional)

The project ships with mock data out of the box. To connect a real MySQL database:

- Run the schema against your MySQL instance:
mysql -u root -p < schema.sql

- Navigate into the API folder and install dependencies:
cd lcms-api
npm install

- Create a .env file inside lcms-api/:
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=lcms
PORT=4000

- Start the API server:
npx tsx src/server.ts

- In src/data/seed.ts, replace the static arrays with fetch() calls to your Express endpoints. In src/App.tsx, swap useState(initialLoads) for useState<Load[]>([]) and load data via useEffect.


Live Demo:
https://lcms-seven.vercel.app/
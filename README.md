# Smart Waste LK

Smart Waste LK is a full-stack proof of concept that helps Sri Lankan municipalities orchestrate daily solid-waste operations. A MongoDB-backed REST API powers planning, analytics, billing, and scheduling workflows, while a React + Material UI control centre provides tailored workspaces for administrators, field crews, and residents.

## Feature Highlights
- **Operations**: Route optimisation respects truck capacity, bin fill thresholds, and returns a greedy nearest-neighbour path. Collector and dispatcher views keep crews in sync.
- **Scheduling**: Residents can request special pickups, check slot availability, confirm bookings, and receive receipts with optional email notifications.
- **Billing**: Stripe-powered checkout sessions, digital receipts, and billing history for residents plus reconciliation utilities for staff.
- **Analytics**: Admin-only dashboards with configurable filters, KPI cards, charts, and export options (PDF/Excel) for household, regional, and waste-type insights.
- **Access Control**: Account registration, login, lockout protection, and role-based dashboards for admins, crews, and residents.
- **Developer Tooling**: Seed script for realistic demo data, comprehensive backend analytics tests with >95% coverage, and frontend utilities tested with Vitest.

## Architecture
- **Backend** (`backend/`): Node.js (Express 5) REST API, Mongoose 8 ODM, Zod validation, Stripe integration, Nodemailer notifications.
- **Frontend** (`frontend/`): React 19 + Vite, Tailwind CSS, Material UI 6, React Router 7, React Leaflet for maps, Lucide icons.
- **Database**: MongoDB Atlas (or any reachable MongoDB deployment) for operational, billing, and analytics data.

## Requirements
- Node.js 18 or newer (project tested on the current LTS release)
- npm 9 or newer
- Reachable MongoDB instance (local or hosted)
- Stripe secret key (optional for billing flows)
- SMTP credentials (optional for email notifications)

## Installation & Setup

### 1. Install dependencies
```powershell
cd smart-waste-management-system
cd backend
npm install
cd ..\frontend
npm install
```

### 2. Configure environment variables
Create `backend/.env` with values that suit your environment:
```ini
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_xxx            # Optional – omit to disable Stripe checkout locally
STRIPE_PAYMENT_METHODS=card,link
COLLECTION_AUTHORITY_EMAIL=ops-team@smartwaste.lk
SMTP_HOST=smtp.example.com               # Optional – required only if you want email notifications
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=secret
SMTP_FROM="Smart Waste Billing" <no-reply@smartwaste.lk>
```

> Keep credentials out of source control. The application gracefully degrades when Stripe or SMTP settings are omitted (billing endpoints will surface configuration errors, and emails will be skipped).

### 3. Seed demo data (optional but recommended)
Populate MongoDB with demo cities, bins, waste collection records, invoices, and test users:
```powershell
cd ..\scripts
node seedLK.js
```
The seeder uses `backend/.env` to locate MongoDB and will upsert admin, collector, and resident demo accounts.

### 4. Run the backend API
```powershell
cd ..\backend
npm run dev
```
- Serves the REST API on `http://localhost:4000`.
- Uses Nodemon to reload when files in `backend/src` change.

### 5. Run the frontend app
In a new PowerShell window:
```powershell
cd smart-waste-management-system\frontend
npm run dev
```
- Vite serves the UI on `http://localhost:5173` and proxies `/api` calls to `http://localhost:4000`.

## Demo Accounts
The seed script provisions the following credentials (passwords can be reset in MongoDB if needed):
- **Admin**: `admin@smartwaste.lk` / `Admin@123`
- **Field crew**: `collector@smartwaste.lk` / `Collector@123`
- **Resident**: `resident@smartwaste.lk` / `Resident@123`

These users unlock admin dashboards, crew checklists, and resident billing/scheduling flows immediately after seeding.

## Testing & Quality
- **Backend (Jest + Supertest)**
	- `npm test` – run all backend tests.
	- `npm run test:analytics` – focus on analytics service/controller suites.
	- `npm run test:billing` – run billing module tests.
	- `npm run test:coverage` – generate coverage reports (analytics module exceeds 96% coverage, see `TEST_COVERAGE_REPORT.md`).
- **Frontend (Vitest + ESLint)**
	- `npm run lint` – lint React code with the ESLint 9 flat config.
	- `npm test` – execute Vitest suites (includes coverage for Manage Collection Ops reporting utilities via Vite config thresholds).

Additional quality notes and refactoring decisions are documented in `CODE_QUALITY_IMPROVEMENTS.md` and `REFACTORING_SUMMARY.md` at the repository root.

## Key API Endpoints
| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Service heartbeat for monitoring. |
| POST | `/api/auth/login` | Authenticate users; enforces lockout rules. |
| POST | `/api/auth/register` | Register residents with validation. |
| POST | `/api/ops/routes/optimize` | Generate a route plan based on selected city/zone inputs. |
| GET | `/api/ops/routes/:truckId/today` | Fetch today’s route for a truck (defaults to `TRUCK-01`). |
| POST | `/api/ops/collections` | Record a collection event and mark a stop as visited. |
| GET | `/api/ops/routes/:truckId/directions` | Retrieve OSRM-based driving directions for the active plan. |
| GET | `/api/ops/summary` | Pull operational KPIs for dashboards. |
| GET | `/api/schedules/special/config` | Surface special collection policies, item types, and thresholds. |
| POST | `/api/schedules/special/availability` | Check slot availability for a resident’s preferred window. |
| POST | `/api/schedules/special/confirm` | Confirm booking and optionally trigger payment receipt emails. |
| GET | `/api/schedules/special/my` | List a resident’s upcoming and historical special requests. |
| GET | `/api/billing/bills` | Return outstanding and paid bills for the authenticated resident. |
| POST | `/api/billing/checkout` | Create a Stripe Checkout session for a bill. |
| GET | `/api/billing/checkout/:sessionId` | Sync Stripe payment status back to MongoDB. |
| GET | `/api/billing/transactions/:transactionId/receipt` | Generate a PDF receipt for auditing and download. |
| GET | `/api/analytics/config` | Provide analytics filter metadata (admin-only). |
| POST | `/api/analytics/report` | Compile analytics aggregates and headline metrics (admin-only). |

## Frontend Workspaces
- **Home & Navigation**: Role-aware entry points that surface relevant modules.
- **Collection Ops**: Dispatcher dashboard with city selectors, KPI cards, and embedded maps.
- **Collector View**: On-shift checklist with live status, bin marking, and banner messaging.
- **Route Optimisation**: Shows optimisation progress, KPIs, summaries, and mini-map previews.
- **Billing**: Resident-friendly invoice list, due date tracking, and Stripe reconciliation screen.
- **Scheduling**: Special collection booking flows, checkout result handling, and history logs.
- **Analytics Reports**: Configurable filters, timeline charts, export utilities, and printable reports.

## Repository Structure
```
backend/        Express API, domain modules, tests, and coverage reports
frontend/       Vite React application, page modules, and Vitest setup
scripts/        Utility scripts (e.g., database seeders)
CODE_QUALITY_IMPROVEMENTS.md
REFACTORING_SUMMARY.md
TEST_COVERAGE_REPORT.md
Report.html     # Design critique SPA (see below)
```

## Documentation & Reports
- `CODE_QUALITY_IMPROVEMENTS.md` – Deep dive into SOLID principles, design patterns, and refactoring decisions.
- `REFACTORING_SUMMARY.md` – High-level summary of backend/frontend improvements.
- `TEST_COVERAGE_REPORT.md` – Detailed analytics module coverage statistics (96%+).
- `backend/coverage/` and `frontend/coverage/` – Generated coverage artefacts from Jest and Vitest runs.
- `Report.html` – Standalone design critique SPA.

### Viewing `Report.html`
From the repository root:
```powershell
# Option A (Node):

# Option B (Python):
python -m http.server 8080
```
Then open `http://127.0.0.1:8080/Report.html`. Opening the file directly in a browser also works, but local asset policies may require using a static server for best results.

## Deployment Notes
- Set `NODE_ENV=production` and keep `.env` values production-ready before deploying the backend.
- Update CORS configuration in `backend/src/app.js` if frontend and backend live on different domains.
- Run `npm run build` inside `frontend/` to produce the static bundle for hosting behind the API.
- Configure Stripe and SMTP credentials in production to unlock payment reconciliation and email workflows.

## Future Enhancements
1. Replace the greedy routing engine with a capacity-constrained VRP solver for higher optimisation accuracy.
2. Expand automated test coverage beyond analytics to fully exercise billing, scheduling, and routing services.
3. Introduce background workers for long-running analytics exports and notification batching.
4. Add audit logging and multi-tenant features for broader municipal deployments.

---

Need support or want to contribute? Open an issue or submit a pull request—thanks for exploring Smart Waste LK! 

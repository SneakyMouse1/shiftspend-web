# ShiftSpend Web

Frontend client for the ShiftSpend personal finance management system.

- **Version:** 1.0.0
- **Type:** Single Page Application (SPA)

---

## Features

### Dashboard & Analytics
- Net worth, monthly cash flow, and account balances overview.
- Cash flow timeline charts (income vs. expenses) via ApexCharts.
- Asset allocation and category expense breakdowns.
- Weekly spending cadence indicators.
- Privacy mode to hide sensitive financial values.

### Transactions & Transfers
- Income, expense, and account transfer tracking.
- Paired transfer linking between source and destination accounts.
- Multi-parameter filtering (type, account, category, tag, date range) and full-text search.
- Command palette (`Cmd+K` / `Ctrl+K`) for fast navigation and search.
- Transaction tagging and notes.

### Reports & Export
- Period-over-period comparison metrics with delta percentages.
- Dedicated analytical views: Cash Flow Timeline, Category Breakdown, and Spending Habits.
- Report export in PDF, Excel (.xlsx), and CSV formats.
- Asynchronous export queue with a 24-hour download history archive.

### Budgets & Savings Goals
- Category spending limits with progress indicators and threshold alerts.
- Direct expense recording from budget management dialogs.
- Target amount and deadline tracking for savings goals.
- Goal lifecycle management (Active, Paused, Completed) with deposit logging.

### Localization (i18n)
- Multilingual support: English, Spanish, and Russian.
- Automatic browser language detection on initial load.
- Language switcher available on authentication screens, sidebar, and headers.

---

## Tech Stack

- **Framework:** React 19, Vite
- **Styling:** TailwindCSS v4, Base UI, Radix UI
- **State & Data Fetching:** TanStack Query v5 (React Query)
- **Charts:** ApexCharts, React-ApexCharts
- **Forms & Validation:** React Hook Form, Zod
- **Icons & Notifications:** Lucide React, Sonner
- **HTTP Client:** Axios (JWT interceptors, error handling)

---

## Project Structure

```text
src/
├── api/          # API client and service endpoints
├── components/   # UI components (auth, shared, navigation, modals)
├── config/       # Currencies, category icons, account types
├── contexts/     # Application contexts (Auth, Language, Theme, Privacy)
├── hooks/        # Custom hooks and React Query mutations/queries
├── lib/          # Helper functions, formatters, and Zod schemas
├── locales/      # Translation dictionaries (en, es, ru) and i18n setup
├── pages/        # Application views and feature modules
└── routes/       # Route guards (ProtectedRoute, GuestRoute)
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API running ([ShiftSpend API](https://github.com/SneakyMouse1/shiftspend-api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SneakyMouse1/shiftspend-web.git
   cd shiftspend-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set your API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Authors & Contributors

Developed jointly by:
- **Tati** ([@Teana-san](https://github.com/Teana-san))
- **Sam** ([@SneakyMouse1](https://github.com/SneakyMouse1))

---

## License

MIT License.

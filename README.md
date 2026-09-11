# Nana's Kitchen Dashboard — Client

React Router v7 admin dashboard for managing products, orders, analytics, and shipping.

## Tech Stack

- **Framework**: React Router v7 (SSR ready)
- **Language**: TypeScript
- **State**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Build**: Vite
- **Icons**: Lucide React

## Folder Structure

```
client/
├── app/
│   ├── components/          Reusable UI components
│   │   ├── ui/              shadcn/ui primitives (Button, Table, Select, etc.)
│   │   ├── app-sidebar.tsx  Sidebar navigation
│   │   ├── nav-main.tsx     Collapsible nav groups
│   │   ├── product-table.tsx
│   │   ├── product-form.tsx
│   │   ├── flavors-table.tsx
│   │   ├── data-table.tsx   Generic data table with sort/filter/pagination
│   │   └── ...
│   ├── routes/              Page components (one per route)
│   │   ├── dashboard.tsx    Layout wrapper (sidebar + header)
│   │   ├── login.tsx
│   │   ├── products-*.tsx
│   │   ├── orders-*.tsx
│   │   ├── reviews-*.tsx
│   │   ├── analytics-*.tsx
│   │   ├── shipping-*.tsx
│   │   └── user-role-*.tsx
│   ├── store/               Zustand stores (one per domain)
│   │   ├── use-product-store.ts
│   │   ├── use_flavor_store.ts
│   │   ├── use_location_store.ts
│   │   ├── use_order_store.ts
│   │   ├── use_auth_store.ts
│   │   └── ...
│   ├── lib/                 Utilities & API clients
│   │   ├── axios.ts         Base API (v1)
│   │   ├── axios_v2.ts      API v2 client
│   │   ├── utils.ts         cn() helper
│   │   └── storage.ts       LocalStorage helpers
│   ├── hooks/               Custom hooks
│   ├── types/               TypeScript types
│   └── routes.ts            Route definitions (React Router v7 config)
├── public/                  Static assets
├── .env                     Client environment variables
└── package.json
```

## Key Concepts

### State Management (Zustand)
Each store follows a consistent pattern: fetch, create, update, delete + loading/error states. Stores are imported directly in route components and hooks — no prop drilling.

### Navigation Structure
The sidebar groups navigation into sections. Within each section, items can be organized by pricing group (Retailer / Wholesaler / Distributor) with nested collapsible menus.

### Pricing Groups
Products support a three-tier pricing system:
- **Retailer** — single-unit pricing
- **Wholesaler** — case pricing
- **Distributor** — bulk case pricing

Each product variant has price tiers per currency per pricing group.

### API Clients
Two Axios instances handle API calls:
- `lib/axios.ts` — base endpoints
- `lib/axios_v2.ts` — prefixed with `/api/v2`

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_AGENT_API_KEY=your_key
VITE_AGENT_ID=your_agent_id
```

## Available Scripts

```bash
npm run dev         # Start dev server (Vite)
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # ESLint
npm run typecheck   # TypeScript type checking
```

## Adding a New Page

1. Create component in `app/routes/`
2. Register route in `app/routes.ts`
3. Add nav item in `app/components/app-sidebar.tsx`
4. Create/use Zustand store in `app/store/`

## Components

### shadcn/ui Primitives
Located in `components/ui/`. Generated via `npx shadcn@latest add`. Do not edit these files directly — customize via Tailwind or wrapper components.

### Data Table
`components/data-table.tsx` provides a reusable table with sorting, filtering, pagination, and row click handling.

### Forms
React Hook Form with Zod validation. Example pattern:

```tsx
const form = useForm<Schema>({
  resolver: zodResolver(schema),
})
<form onSubmit={form.handleSubmit(onSubmit)}>...</form>
```

## Deployment

Build outputs to `build/server/` (SSR) and `build/client/` (static). Deploy to Vercel, Netlify, or Docker.

```bash
npm run build
# Output:
# build/client/   — static assets (Vite build)
# build/server/   — server entry (for SSR)
```

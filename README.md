# Finanz Butik® — Investment Marketplace Platform

> **Curated real-estate and alternative investment marketplace** that connects Investors, Developers, Vendors (service providers), and Agents. Features project discovery, portfolio management, return simulation, vendor services marketplace, white-label client management, and agent referral tracking.

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React + TypeScript | 18.3 / 5.8 |
| **Build Tool** | Vite (SWC) | 5.4 |
| **Styling** | Tailwind CSS + CSS Variables (HSL Design Tokens) | 3.4 |
| **Component Library** | shadcn/ui (Radix UI primitives) | — |
| **Icons** | Phosphor Icons (`@phosphor-icons/react`) | 2.1 |
| **Animation** | Framer Motion | 12.x |
| **Routing** | React Router DOM | 6.30 |
| **Server State** | TanStack React Query | 5.83 |
| **Forms** | React Hook Form + Zod | 7.61 / 3.25 |
| **Charts** | Recharts + custom SVG | 2.15 |
| **Testing** | Vitest + Testing Library + jsdom | 3.2 |
| **Typography** | Nunito (headings) + Inter (body) via Google Fonts |

### Design System Tokens (index.css)

| Token | Light | Purpose |
|-------|-------|---------|
| `--primary` | `187 89% 27%` (#067783 Teal) | Main CTA, active states |
| `--foreground` | `220 20% 14%` (Navy-Charcoal) | Text, dark backgrounds |
| `--muted` | `210 20% 96%` | Subtle backgrounds |
| `--gold` | `40 80% 55%` | Badges (coming soon) |
| `--success` | `160 60% 40%` | Positive returns |
| `--destructive` | `0 72% 51%` | Errors, sold out |

Button radius: `8px` · Container max-width: `1400px`

---

## 2. Architecture

```
src/
├── assets/                    # Static images (hero, generated)
├── components/
│   ├── ui/                    # shadcn/ui primitives (button, card, dialog…)
│   ├── Navbar.tsx             # Global nav — auth-aware, role-aware
│   ├── HeroSection.tsx        # Landing hero with CTA
│   ├── SuccessCases.tsx       # Project grid with category filters
│   ├── ProjectCard.tsx        # Reusable project card
│   ├── DeveloperSidebar.tsx   # Dashboard sidebar (Developer + Manager)
│   ├── VendorSidebar.tsx      # Dashboard sidebar (Vendor)
│   ├── AgentSidebar.tsx       # Dashboard sidebar (Agent)
│   ├── NavLink.tsx            # Active-aware nav link
│   └── ProtectedRoute.tsx     # Role-based route guard
├── contexts/
│   └── AuthContext.tsx         # Mock auth (investor | developer | vendor | agent)
├── data/
│   ├── mockProjects.ts         # Project inventory (typed with Project from api.ts)
│   ├── mockPortfolio.ts        # Investor portfolio (PortfolioItem, PortfolioSummary)
│   ├── mockClients.ts          # Managed clients + brand config
│   ├── mockAnalytics.ts        # Developer KPIs and analytics
│   ├── mockVendor.ts           # Vendor services, profile, analytics
│   ├── mockMessaging.ts        # Inquiry threads and messages
│   └── mockAgent.ts            # Agent profile, stats, attributions
├── hooks/
│   └── use-toast.ts            # Toast notification hook
├── pages/
│   ├── Index.tsx               # Landing (Navbar + Hero + SuccessCases)
│   ├── ProjectSheet.tsx        # Full project detail + simulator
│   ├── Portfolio.tsx           # Investor portfolio dashboard
│   ├── Learn.tsx               # Educational content hub
│   ├── Login.tsx               # Role selection (mock auth)
│   ├── NotFound.tsx            # 404
│   ├── developer/
│   │   ├── DeveloperLayout.tsx # Sidebar layout wrapper
│   │   ├── MyProjects.tsx      # Project list management
│   │   ├── UploadWizard.tsx    # 4-step project creation
│   │   ├── Analytics.tsx       # KPIs + charts
│   │   └── Profile.tsx         # KYC / profile settings
│   ├── manager/
│   │   ├── Clients.tsx         # Client CRM table
│   │   ├── BrandSettings.tsx   # White-label config
│   │   └── Reports.tsx         # Report generation
│   ├── vendor/
│   │   ├── VendorLayout.tsx    # Sidebar layout wrapper
│   │   ├── VendorDashboard.tsx # Service overview
│   │   ├── CreateService.tsx   # New service form
│   │   ├── VendorAnalytics.tsx # Revenue + views metrics
│   │   ├── VendorProfileSetup.tsx # Firm profile / KYB
│   │   ├── MessagingHub.tsx    # Inquiry list
│   │   └── MessageThread.tsx   # Conversation detail
│   └── agent/
│       ├── AgentLayout.tsx     # Sidebar layout wrapper
│       ├── AgentDashboard.tsx  # Commissions + referral code
│       ├── AgentAnalytics.tsx  # Referral metrics + top projects
│       └── AgentProfileSetup.tsx # Agent profile / T&C
├── services/
│   └── api.ts                  # API service class (fetch wrapper)
├── types/
│   └── api.ts                  # All shared TypeScript interfaces
└── App.tsx                     # Route definitions + providers
```

### State Management

- **Auth**: React Context (`AuthContext`) — mock login with role selection
- **Server State**: TanStack React Query (ready, currently using mock data)
- **Project Data**: Mutable array in `mockProjects.ts` (persists in-session)
- **Forms**: Controlled state in wizard components

### Routing Map

| Path | Component | Access |
|------|-----------|--------|
| `/` | Index | Public |
| `/project/:slug` | ProjectSheet | Public |
| `/portfolio` | Portfolio | Auth (any) |
| `/learn` | Learn | Auth (any) |
| `/login` | Login | Public |
| `/developer` | DeveloperLayout > MyProjects | Developer |
| `/developer/upload` | UploadWizard | Developer |
| `/developer/analytics` | Analytics | Developer |
| `/developer/profile` | Profile | Developer |
| `/developer/clients` | Clients | Developer |
| `/developer/brand` | BrandSettings | Developer |
| `/developer/reports` | Reports | Developer |
| `/vendor` | VendorLayout > VendorDashboard | Vendor |
| `/vendor/create` | CreateService | Vendor |
| `/vendor/analytics` | VendorAnalytics | Vendor |
| `/vendor/profile` | VendorProfileSetup | Vendor |
| `/vendor/messages` | MessagingHub | Vendor |
| `/vendor/messages/:id` | MessageThread | Vendor |
| `/agent` | AgentLayout > AgentDashboard | Agent |
| `/agent/analytics` | AgentAnalytics | Agent |
| `/agent/profile` | AgentProfileSetup | Agent |

---

## 3. User Roles

| Role | Description | Key Modules |
|------|-------------|-------------|
| **Investor** | Explores projects, manages portfolio, accesses educational content | Landing, Project Sheet, Portfolio, Learn |
| **Developer** | Publishes projects, monitors analytics, manages KYC, manages clients and white-label brand | Developer Dashboard, Client Manager |
| **Vendor** | Offers professional services (legal, tax, accounting), manages inquiries | Vendor Dashboard, Messaging |
| **Agent** | Refers investors via personal code, tracks commissions and attributions | Agent Dashboard, Analytics |

> Auth is currently mock-based (`AuthContext`). Routes are guarded by `ProtectedRoute` with `allowedRoles` prop.

---

## 4. Modules & Features

### Module A: Public Marketplace
- Landing page with hero + CTA
- Project grid with category filters (Cash, Lend, Buy, Develop)
- Status badges (Active, Sold Out, Coming Soon, Waiting Approval)

### Module B: Project Sheet
- Image gallery mosaic (up to 5 images)
- Project stats (term, rates, min investment)
- "Curated by" attribution with legal support badge
- **Return Simulator**: Investment amount × years → projected value with chart
- Investment Tiers table (multi-tier, multi-range by amount)
- Documents section with download
- BUY projects: extended property details panel (`buyDetails`)

### Module C: Investor Portfolio
- Summary cards (Total Invested, Current Value, Return %, Active count)
- Portfolio growth chart (SVG line chart)
- Holdings table with status badges and return indicators

### Module D: Learn (Education Hub)
- Featured certification banner
- Article cards (image, category, read time)
- Video/Webinar list

### Module E: Developer Dashboard
- **My Projects**: List with status tags, view/edit actions, "New Project" CTA
- **Upload Wizard**: 4-step form (Basic Info → Financials → Media → Review) with BUY-mode branch
- **Analytics**: KPI cards + monthly bar chart + project performance progress bars
- **Profile/KYC**: Personal info, company details, document upload slots

### Module F: Client Manager (White-Label)
- **Clients CRM**: Searchable table (name, invested, deals, risk profile, last activity)
- **Brand Settings**: Company name, color picker, custom domain, logo upload, live preview
- **Reports**: AUM summary, report template list with generate/download

### Module G: Vendor Services
- **Dashboard**: Active services list with views, fee, and status
- **Create Service**: Form to publish a new professional service
- **Analytics**: Revenue chart, views, pending payouts
- **Profile/KYB**: Firm details, license number, bank account configuration
- **Messaging**: Inbox of investor inquiries per service with full thread view and file attachments

### Module H: Agent Referrals
- **Dashboard**: Referral code card, commission totals, pending attributions table
- **Analytics**: Code usage chart (weekly/monthly), top projects by referral, conversion rate
- **Profile Setup**: Agent details, T&C acceptance

---

## 5. Data Model

`src/types/api.ts` is the **single source of truth** for all shared interfaces. Mock data files import from there.

### Key type aliases

```typescript
type ProjectCategory = "cash" | "lend" | "buy" | "develop"
type ProjectStatus   = "active" | "sold_out" | "coming_soon" | "waiting_approval"
type RiskProfile     = "conservative" | "moderate" | "aggressive"
type InquiryStatus   = "active" | "resolved" | "pending_response"
type AttachmentType  = "pdf" | "docx" | "image" | "other"
```

### Core interfaces

```typescript
Project {
  id, title, slug, status: ProjectStatus, category: ProjectCategory,
  thumbnailUrl, images[], termRange,
  annualInterestRateMin, annualInterestRateMax,
  minInvestment, currency, description, highlights[],
  curatedBy, legalSupport, tiers: InvestmentTier[], documents: ProjectDocument[],
  buyDetails?: BuyDetails, createdAt, updatedAt
}

InvestmentTier  { id, name, years, ranges: TierRange[] }
TierRange       { minAmount, maxAmount: number | null, interestRate }
ProjectDocument { id, name, date, downloadUrl }
BuyDetails      { purchasePrice?, equitySought?, estimatedAnnualYield?, noi?,
                  occupancyRate?, unitsOrArea?, propertyAddress?,
                  assetType?, yearBuilt?, exitStrategy? }

PortfolioItem   { id, projectId, projectName, category: ProjectCategory,
                  invested, currentValue, returnRate, status, startDate, endDate }
PortfolioSummary { totalInvested, currentValue, totalReturn, activeInvestments, chartData[] }

VendorService   { id, vendorId, title, description, category, pricingModel,
                  fee, currency, status, views, createdAt, updatedAt }
VendorProfile   { id, userId, firmName, category, bio, taxId, licenseNumber,
                  verified, bankConfigured, balance, payoutHistory[] }

Inquiry         { id, subject, serviceId, serviceTitle, serviceCategory,
                  status: InquiryStatus, counterparty, vendorInfo, messages[] }
ThreadMessage   { id, senderId, senderName, senderRole, body, attachments[], sentAt }
MessageAttachment { id, name, type: AttachmentType, size, url }

AgentProfile    { id, userId, name, company, email, bio, agentCode,
                  avatar, tcAccepted, status }
PendingAttribution { id, investorName, projectId, projectTitle, amount, date, status }
```

> All cross-entity references use IDs (`projectId`, `vendorId`, `serviceId`, `userId`) — never bare name strings — to prepare for backend integration.

See [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) for the full model reference with relationship diagram.

---

## 6. API Service Layer

The `ApiService` class (`src/services/api.ts`) is pre-wired with:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getProjects(filters?)` | `GET /projects` | List with category/status/search filters |
| `getProject(slug)` | `GET /projects/:slug` | Single project detail |
| `simulate(projectId, amount, years)` | `POST /projects/:id/simulate` | Return simulation |

Base URL configurable via `VITE_API_BASE_URL` env variable.

---

## 7. Getting Started

```bash
npm install
npm run dev        # Dev server at localhost:5173
npm run build      # Production build
npm run test       # Run Vitest
```

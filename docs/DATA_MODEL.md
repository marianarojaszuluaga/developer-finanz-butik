# Data Model and File Mapping

## Overview

This document describes the main data model types used in the project, and where those models are defined or consumed.

The repository does not include a real database file or ORM schema. Instead, it uses TypeScript interface definitions in `src/types/api.ts`, an API service in `src/services/api.ts`, and mock data modules in `src/data/*.ts`.

**Design rule:** `src/types/api.ts` is the single source of truth for all domain interfaces. Mock data files import types from there; they do not define their own local interfaces.

---

## Core API Models

### `src/types/api.ts`

#### Shared type aliases

| Type | Values |
|------|--------|
| `ProjectCategory` | `"cash" \| "lend" \| "buy" \| "develop"` |
| `ProjectStatus` | `"active" \| "sold_out" \| "coming_soon" \| "waiting_approval"` |
| `VendorServiceCategory` | `"legal" \| "taxes" \| "accounting" \| "consulting" \| "other"` |
| `RiskProfile` | `"conservative" \| "moderate" \| "aggressive"` |
| `AttachmentType` | `"pdf" \| "docx" \| "image" \| "other"` |
| `InquiryStatus` | `"active" \| "resolved" \| "pending_response"` |

#### Project model

- `Project`
  - `id`, `title`, `slug`, `status: ProjectStatus`, `category: ProjectCategory`
  - `thumbnailUrl`, `images[]`
  - `termRange`, `annualInterestRateMin`, `annualInterestRateMax`
  - `minInvestment`, `currency`, `description`, `highlights[]`
  - `curatedBy`, `legalSupport`, `tiers: InvestmentTier[]`, `documents: ProjectDocument[]`
  - `buyDetails?: BuyDetails`
  - `createdAt`, `updatedAt`
- `InvestmentTier`
  - `id`, `name`, `years`, `ranges: TierRange[]`
- `TierRange`
  - `minAmount`, `maxAmount: number | null`, `interestRate`
- `ProjectDocument`
  - `id`, `name`, `date`, `downloadUrl`
- `BuyDetails` (optional, only for `category: "buy"`)
  - `purchasePrice?`, `equitySought?`, `estimatedAnnualYield?`, `noi?`
  - `occupancyRate?`, `unitsOrArea?`, `propertyAddress?`
  - `assetType?`, `yearBuilt?`, `exitStrategy?`

#### Simulation

- `SimulatorResult`
  - `investmentAmount`, `projectedValue`, `gain`, `gainPercentage`, `years`, `chartData: ChartPoint[]`
- `ChartPoint`
  - `label`, `value`

#### Portfolio

- `PortfolioItem`
  - `id`, `projectId` *(FK → `Project.id`)*, `projectName`
  - `category: ProjectCategory`
  - `invested`, `currentValue`, `returnRate`
  - `status: "active" | "matured" | "pending"`
  - `startDate`, `endDate`
- `PortfolioSummary`
  - `totalInvested`, `currentValue`, `totalReturn`, `activeInvestments`
  - `chartData: Array<{ month: string; value: number }>`

#### Client manager

- `ManagedClient`
  - `id`, `name`, `email`, `totalInvested`, `activeDeals`
  - `riskProfile: RiskProfile`, `lastActivity`, `avatar?`
- `ManagerBrand`
  - `companyName`, `primaryColor`, `logo`, `domain`

#### Vendor services

- `VendorService`
  - `id`, `vendorId` *(FK → `MockUser.id`)*, `title`, `description`
  - `category`, `pricingModel`, `fee`, `currency`
  - `status: "pending_approval" | "active" | "inactive"`
  - `views`, `createdAt`, `updatedAt`
- `VendorProfile`
  - `id`, `userId` *(FK → `MockUser.id`)*
  - `firmName`, `category`, `bio`, `taxId`, `licenseNumber`
  - `verified`, `bankConfigured`, `balance`
  - `payoutHistory: Array<{ date, amount, method }>`

#### Messaging

- `Inquiry`
  - `id`, `subject`
  - `serviceId` *(FK → `VendorService.id`)*, `serviceTitle`, `serviceCategory`
  - `status: InquiryStatus`, `lastMessageAt`, `lastMessagePreview`, `unreadCount`
  - `counterparty: { name, role, company? }`
  - `vendorInfo: { firmName, category, licenseNumber, verified, avatarUrl? }`
  - `messages: ThreadMessage[]`
- `ThreadMessage`
  - `id`, `senderId` *(matches `MockUser.id`)*, `senderName`, `senderRole`
  - `body`, `attachments: MessageAttachment[]`, `sentAt`
- `MessageAttachment`
  - `id`, `name`, `type: AttachmentType`, `size`, `url`

#### Agent / referrals

- `AgentProfile`
  - `id`, `userId` *(FK → `MockUser.id`)*
  - `name`, `company`, `email`, `bio`, `agentCode`, `avatar`
  - `tcAccepted`, `status: "active" | "inactive" | "suspended"`
- `PendingAttribution`
  - `id`, `investorName`
  - `projectId` *(FK → `Project.id`)*, `projectTitle`
  - `amount`, `date`, `status: "pending" | "confirmed" | "rejected"`

#### API utilities

- `ProjectFilters`
  - `category?: ProjectCategory`, `status?: ProjectStatus`, `search?: string`
- `ApiConfig`
  - `baseUrl`, `headers?: Record<string, string>`
- `PaginatedResponse<T>`
  - `data: T[]`, `total`, `page`, `pageSize`

---

### Model relationships

```
Project (1)
  ├── owns ──→ InvestmentTier[] (0..*)
  │              └── owns ──→ TierRange[] (1..*)
  ├── owns ──→ ProjectDocument[] (0..*)
  └── has  ──→ BuyDetails (0..1, only when category = "buy")

PortfolioItem (*)
  └── references ──→ Project via projectId (FK)

VendorService (*)
  └── references ──→ MockUser via vendorId (FK)

VendorProfile (1)
  └── references ──→ MockUser via userId (FK)

Inquiry (*)
  ├── references ──→ VendorService via serviceId (FK)
  └── contains  ──→ ThreadMessage[] (1..*)
                      └── has ──→ MessageAttachment[] (0..*)

AgentProfile (1)
  └── references ──→ MockUser via userId (FK)

PendingAttribution (*)
  └── references ──→ Project via projectId (FK)
```

---

### BUY category form behavior

For projects with `category: "buy"`, the upload wizard treats the opportunity as a BUY-type asset and does not show or require the standard debt/equity fields:

- hides `termRange`
- hides `annualInterestRateMin`
- hides `annualInterestRateMax`

Instead, BUY projects collect `buyDetails` fields such as `purchasePrice`, `equitySought`, `estimatedAnnualYield`, `noi`, `occupancyRate`, `unitsOrArea`, `propertyAddress`, `assetType`, `yearBuilt`, and `exitStrategy`.

This is implemented in `src/pages/developer/UploadWizard.tsx` and stored in `Project.buyDetails`.

---

## API Service

### `src/services/api.ts`

This file maps models to request/response flows:

- `ApiService` class with methods:
  - `getProjects(filters?: ProjectFilters): Promise<PaginatedResponse<Project>>`
  - `getProject(slug: string): Promise<Project>`
  - `simulate(projectId: string, amount: number, years: number): Promise<SimulatorResult>`

- Uses `ApiConfig` to configure `baseUrl` and HTTP headers.
- Default `baseUrl`: `import.meta.env.VITE_API_BASE_URL || "/api"`

---

## Mock Data Files

The app uses mock data modules rather than a live DB. All types are imported from `src/types/api.ts`.

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/data/mockProjects.ts` | Project inventory | `mockProjects: Project[]` |
| `src/data/mockPortfolio.ts` | Portfolio dashboard | `mockPortfolio: PortfolioItem[]`, `portfolioSummary: PortfolioSummary` |
| `src/data/mockClients.ts` | Client manager | `mockClients: ManagedClient[]`, `managerBrand: ManagerBrand` |
| `src/data/mockVendor.ts` | Vendor services | `mockVendorServices: VendorService[]`, `vendorAnalytics`, `vendorProfile: VendorProfile` |
| `src/data/mockMessaging.ts` | Inquiry threads | `mockInquiries: Inquiry[]` (re-exports types from `@/types/api`) |
| `src/data/mockAgent.ts` | Agent metrics | `agentProfile: AgentProfile`, `agentStats`, `pendingAttributions: PendingAttribution[]`, `topProjectsByReferral`, `agentCodeUsageWeekly`, `agentCodeUsageMonthly`, `mediaKitItems` |

### Mock data consumption map

| Data file | Consumed by |
|-----------|-------------|
| `mockProjects.ts` | `SuccessCases.tsx`, `ProjectSheet.tsx`, `MyProjects.tsx`, `UploadWizard.tsx` |
| `mockPortfolio.ts` | `Portfolio.tsx` |
| `mockClients.ts` | `Clients.tsx`, `Reports.tsx`, `BrandSettings.tsx` |
| `mockVendor.ts` | `CreateService.tsx`, `VendorAnalytics.tsx`, `VendorDashboard.tsx`, `VendorProfileSetup.tsx` |
| `mockMessaging.ts` | `MessagingHub.tsx`, `MessageThread.tsx` |
| `mockAgent.ts` | `AgentDashboard.tsx`, `AgentAnalytics.tsx`, `AgentProfileSetup.tsx` |

---

## Auth / User Model

### `src/contexts/AuthContext.tsx`

- `UserRole = "investor" | "developer" | "vendor" | "agent"`
- `MockUser`
  - `id`, `name`, `email`, `role: UserRole`, `avatar?`, `company?`

Mock user IDs used as foreign keys across domain models:

| Role | `MockUser.id` |
|------|--------------|
| investor | `"inv-1"` |
| developer | `"dev-1"` |
| vendor | `"ven-1"` |
| agent | `"agt-1"` |

---

## Summary

### Primary model files

- `src/types/api.ts` → single source of truth for all shared data model interfaces
- `src/services/api.ts` → API client using those models
- `src/data/*.ts` → mock data consumed by pages and components
- `src/contexts/AuthContext.tsx` → auth/user model

### Important detail

- There is no real database or ORM in this repo; the architecture is frontend-only with mock data.
- All cross-entity references use IDs (e.g. `projectId`, `vendorId`, `serviceId`) rather than embedded strings, to prepare for backend integration.

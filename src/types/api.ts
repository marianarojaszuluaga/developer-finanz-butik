// ===== Finanz Butik API Types =====
// Ready to connect to your backend API

export type ProjectCategory = "cash" | "lend" | "buy" | "develop";
export type ProjectStatus = "active" | "sold_out" | "coming_soon" | "waiting_approval";
export type VendorServiceCategory = "legal" | "taxes" | "accounting" | "consulting" | "other";
export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface Project {
  id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  category: ProjectCategory;
  thumbnailUrl: string;
  images: string[];
  termRange: string;
  annualInterestRateMin: number;
  annualInterestRateMax: number;
  minInvestment: number;
  currency: string;
  description: string;
  highlights: string[];
  curatedBy: string;
  legalSupport: boolean;
  tiers: InvestmentTier[];
  documents: ProjectDocument[];
  buyDetails?: BuyDetails;
  createdAt: string;
  updatedAt: string;
}

export interface BuyDetails {
  purchasePrice?: number;
  equitySought?: number;
  estimatedAnnualYield?: number; // e.g., cap rate
  noi?: number; // Net Operating Income
  occupancyRate?: number; // percentage (0-100)
  unitsOrArea?: string; // number of units or area description
  propertyAddress?: string;
  assetType?: string; // Residential | Commercial | Industrial
  yearBuilt?: number;
  exitStrategy?: string;
}

export interface InvestmentTier {
  id: string;
  name: string;
  years: number;
  ranges: TierRange[];
}

export interface TierRange {
  minAmount: number;
  maxAmount: number | null;
  interestRate: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  date: string;
  downloadUrl: string;
}

export interface SimulatorResult {
  investmentAmount: number;
  projectedValue: number;
  gain: number;
  gainPercentage: number;
  years: number;
  chartData: ChartPoint[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface PortfolioItem {
  id: string;
  projectId: string;
  projectName: string;
  category: ProjectCategory;
  invested: number;
  currentValue: number;
  returnRate: number;
  status: "active" | "matured" | "pending";
  startDate: string;
  endDate: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  activeInvestments: number;
  chartData: Array<{ month: string; value: number }>;
}

export interface ManagedClient {
  id: string;
  name: string;
  email: string;
  totalInvested: number;
  activeDeals: number;
  riskProfile: RiskProfile;
  lastActivity: string;
  avatar?: string;
}

export interface ManagerBrand {
  companyName: string;
  primaryColor: string;
  logo: string;
  domain: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  pricingModel: string;
  fee: number;
  currency: string;
  status: "pending_approval" | "active" | "inactive";
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  firmName: string;
  category: string;
  bio: string;
  taxId: string;
  licenseNumber: string;
  verified: boolean;
  bankConfigured: boolean;
  balance: number;
  payoutHistory: Array<{ date: string; amount: number; method: string }>;
}

export type AttachmentType = "pdf" | "docx" | "image" | "other";

export interface MessageAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: string;
  url: string;
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "vendor" | "investor" | "admin";
  body: string;
  attachments: MessageAttachment[];
  sentAt: string;
}

export type InquiryStatus = "active" | "resolved" | "pending_response";

export interface Inquiry {
  id: string;
  subject: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  status: InquiryStatus;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  counterparty: {
    name: string;
    role: "investor" | "vendor";
    company?: string;
  };
  vendorInfo: {
    firmName: string;
    category: string;
    licenseNumber: string;
    verified: boolean;
    avatarUrl?: string;
  };
  messages: ThreadMessage[];
}

export interface AgentProfile {
  id: string;
  userId: string;
  name: string;
  company: string;
  email: string;
  bio: string;
  agentCode: string;
  avatar: string;
  tcAccepted: boolean;
  status: "active" | "inactive" | "suspended";
}

export interface PendingAttribution {
  id: string;
  investorName: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  date: string;
  status: "pending" | "confirmed" | "rejected";
}

export interface ProjectFilters {
  category?: ProjectCategory;
  status?: ProjectStatus;
  search?: string;
}

// ===== API Service Interface =====

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

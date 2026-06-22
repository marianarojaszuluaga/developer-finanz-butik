import type { VendorService, VendorProfile } from "@/types/api";

export let mockVendorServices: VendorService[] = [
  {
    id: "vs-1",
    vendorId: "ven-1",
    title: "Real Estate Due Diligence",
    description: "Comprehensive legal review of property titles, liens, and zoning compliance for investment-grade real estate.",
    category: "Legal",
    pricingModel: "Fixed Fee",
    fee: 2500,
    currency: "USD",
    status: "active",
    views: 142,
    createdAt: "2025-11-15",
    updatedAt: "2026-01-10",
  },
  {
    id: "vs-2",
    vendorId: "ven-1",
    title: "Tax Optimization Strategy",
    description: "Cross-border tax planning and structuring advisory for HNW investors with multi-jurisdictional holdings.",
    category: "Taxes",
    pricingModel: "Hourly",
    fee: 350,
    currency: "USD",
    status: "active",
    views: 98,
    createdAt: "2025-12-03",
    updatedAt: "2026-02-20",
  },
  {
    id: "vs-3",
    vendorId: "ven-1",
    title: "Fund Audit & Compliance Report",
    description: "Annual audit preparation and compliance reporting for real estate investment funds.",
    category: "Accounting",
    pricingModel: "Fixed Fee",
    fee: 8000,
    currency: "USD",
    status: "pending_approval",
    views: 0,
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
  },
];

export const vendorAnalytics = {
  totalRevenue: 47500,
  totalViews: 240,
  activeServices: 2,
  pendingPayouts: 12300,
  monthlyRevenue: [
    { month: "Oct", revenue: 5200 },
    { month: "Nov", revenue: 7800 },
    { month: "Dec", revenue: 6100 },
    { month: "Jan", revenue: 9400 },
    { month: "Feb", revenue: 11200 },
    { month: "Mar", revenue: 7800 },
  ],
};

export const vendorProfile: VendorProfile = {
  id: "vp-1",
  userId: "ven-1",
  firmName: "Ruiz & Asociados Legal",
  category: "Legal",
  bio: "Boutique law firm specializing in cross-border real estate transactions and investment structuring across Latin America.",
  taxId: "RFC-RAL-210915-XX3",
  licenseNumber: "BAR-MX-2018-44521",
  verified: true,
  bankConfigured: true,
  balance: 12300,
  payoutHistory: [
    { date: "2026-02-28", amount: 9400, method: "ACH" },
    { date: "2026-01-31", amount: 8200, method: "Wire" },
    { date: "2025-12-31", amount: 6100, method: "ACH" },
  ],
};

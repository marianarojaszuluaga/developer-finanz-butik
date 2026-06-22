import type { AgentProfile, PendingAttribution } from "@/types/api";

export const agentProfile: AgentProfile = {
  id: "agt-1",
  userId: "agt-1",
  name: "Sofía Torres",
  company: "Torres Capital Partners",
  email: "sofia@agentpro.com",
  bio: "Especialista en distribución de productos financieros alternativos con +8 años de experiencia en mercados LATAM.",
  agentCode: "FB-2026-XYZ",
  avatar: "",
  tcAccepted: true,
  status: "active",
};

export const agentStats = {
  totalCommissions: 34_520,
  closedDeals: 12,
  codeRedemptions: 47,
  pendingAttributions: 5,
  conversionRate: 25.5,
};

export const pendingAttributions: PendingAttribution[] = [
  { id: "attr-1", investorName: "Luis García", projectId: "1", projectTitle: "Villa Residencial Costa del Sol", amount: 50_000, date: "2026-02-28", status: "pending" },
  { id: "attr-2", investorName: "Ana Martínez", projectId: "3", projectTitle: "Fondo de Deuda Corporativa Latam", amount: 25_000, date: "2026-03-01", status: "pending" },
  { id: "attr-3", investorName: "Roberto Díaz", projectId: "2", projectTitle: "Complejo Turístico Riviera Maya", amount: 100_000, date: "2026-03-05", status: "pending" },
  { id: "attr-4", investorName: "Carmen Vega", projectId: "1", projectTitle: "Villa Residencial Costa del Sol", amount: 75_000, date: "2026-03-08", status: "pending" },
  { id: "attr-5", investorName: "Pedro Sánchez", projectId: "3", projectTitle: "Fondo de Deuda Corporativa Latam", amount: 30_000, date: "2026-03-10", status: "pending" },
];

export const agentCodeUsageWeekly = [
  { week: "W1 Feb", uses: 5 },
  { week: "W2 Feb", uses: 8 },
  { week: "W3 Feb", uses: 6 },
  { week: "W4 Feb", uses: 11 },
  { week: "W1 Mar", uses: 9 },
  { week: "W2 Mar", uses: 14 },
];

export const agentCodeUsageMonthly = [
  { month: "Oct", uses: 12 },
  { month: "Nov", uses: 18 },
  { month: "Dec", uses: 15 },
  { month: "Jan", uses: 22 },
  { month: "Feb", uses: 30 },
  { month: "Mar", uses: 23 },
];

export const topProjectsByReferral = [
  { projectId: "1", project: "Villa Residencial Costa del Sol", referrals: 18, commissions: 12_400, category: "develop" as const },
  { projectId: "3", project: "Fondo de Deuda Corporativa Latam", referrals: 14, commissions: 9_800, category: "lend" as const },
  { projectId: "2", project: "Complejo Turístico Riviera Maya", referrals: 10, commissions: 8_200, category: "buy" as const },
  { projectId: "4", project: "Cash Plus MXN", referrals: 5, commissions: 4_120, category: "cash" as const },
];

export const mediaKitItems = [
  { id: "mk-1", name: "Brand Deck (PDF)", type: "pdf", size: "2.4 MB" },
  { id: "mk-2", name: "Social Media Kit", type: "zip", size: "8.1 MB" },
  { id: "mk-3", name: "Email Templates", type: "zip", size: "1.2 MB" },
  { id: "mk-4", name: "One-Pager Brochure", type: "pdf", size: "3.5 MB" },
];

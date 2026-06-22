import { useState } from "react";
import { developerAnalytics } from "@/data/mockAnalytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CurrencyDollar, Users, ChartBar } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Analytics = () => {
  const a = developerAnalytics;
  const [activeTab, setActiveTab] = useState("develop");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
      
      {/* Tabs for different analytics sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto gap-2 rounded-full border border-border bg-muted p-1">
          <TabsTrigger value="develop" className="rounded-full px-6 py-2 text-sm font-medium">Develop</TabsTrigger>
          <TabsTrigger value="sell" className="rounded-full px-6 py-2 text-sm font-medium">Sell</TabsTrigger>
          <TabsTrigger value="fundraising" className="rounded-full px-6 py-2 text-sm font-medium">Fundraising</TabsTrigger>
        </TabsList>

        {/* Fundraising Tab */}
        <TabsContent value="fundraising" className="space-y-6">

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Raised", value: fmt(a.totalRaised), icon: CurrencyDollar },
          { label: "Active Projects", value: String(a.activeProjects), icon: ChartBar },
          { label: "Total Investors", value: String(a.totalInvestors), icon: Users },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <c.icon size={18} />
              <span className="text-xs font-medium">{c.label}</span>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Capital Raised (Monthly)</h2>
        <div className="h-48 w-full">
          <svg viewBox="0 0 700 180" className="h-full w-full">
            {a.monthlyData.map((d, i) => {
              const barW = 60;
              const gap = (700 - barW * a.monthlyData.length) / (a.monthlyData.length + 1);
              const x = gap + i * (barW + gap);
              const maxVal = Math.max(...a.monthlyData.map((m) => m.raised));
              const h = (d.raised / maxVal) * 140;
              return (
                <g key={d.month}>
                  <rect x={x} y={150 - h} width={barW} height={h} rx={6} fill="hsl(var(--primary))" opacity={0.85} />
                  <text x={x + barW / 2} y={170} textAnchor="middle" className="fill-muted-foreground text-[10px]">{d.month}</text>
                  <text x={x + barW / 2} y={145 - h} textAnchor="middle" className="fill-foreground text-[9px] font-medium">
                    {(d.raised / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Project Performance */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Fundraising Performance</h2>
        <div className="space-y-4">
          {a.projectPerformance.map((p) => {
            const pct = Math.round((p.raised / p.goal) * 100);
            return (
              <div key={p.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{fmt(p.raised)} / {fmt(p.goal)} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{p.investors} investors</p>
              </div>
            );
          })}
        </div>
      </div>
        </TabsContent>

        {/* Sell Tab (BUY Opportunities) */}
        <TabsContent value="sell" className="space-y-6">
          {/* Sell Overview Metrics as Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Unique Views", value: String(a.buyOpportunities.overview.uniqueViews), icon: ChartBar },
              { label: "Returning Visitors", value: String(a.buyOpportunities.overview.returningVisitors), icon: Users },
              { label: "Request Info Clicks", value: String(a.buyOpportunities.overview.requestInfoClicks), icon: ChartBar },
              { label: "Download Clicks", value: String(a.buyOpportunities.overview.downloadClicks), icon: ChartBar },
              { label: "Schedule Requests", value: String(a.buyOpportunities.overview.scheduleRequests), icon: ChartBar },
              { label: "Closed Sales", value: String(a.buyOpportunities.overview.closedSales), icon: ChartBar },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <c.icon size={18} />
                  <span className="text-xs font-medium">{c.label}</span>
                </div>
                <p className="mt-2 font-heading text-2xl font-bold text-foreground">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Traffic Trend & Buyer Locations */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Traffic Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={a.buyOpportunities.trafficTrend} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip formatter={(value: number) => [value, "Visitors"]} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Buyer Location Share</h2>
              <div className="space-y-4">
                {a.buyOpportunities.buyerLocations.map((location) => (
                  <div key={`${location.city}-${location.country}`} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{location.city}, {location.country}</span>
                      <span>{location.share}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${location.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Develop Tab */}
        <TabsContent value="develop" className="space-y-6">
          {/* Develop Overview Metrics as Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Active Listings", value: String(a.sellOpportunities.overview.activeListings), icon: ChartBar },
              { label: "Total Views", value: String(a.sellOpportunities.overview.totalViews), icon: Users },
              { label: "Avg Days on Market", value: String(a.sellOpportunities.overview.avgDaysOnMarket), icon: ChartBar },
              { label: "Closed Deals", value: String(a.sellOpportunities.overview.closedDeals), icon: ChartBar },
              { label: "Total Volume", value: fmt(a.sellOpportunities.overview.totalVolume), icon: CurrencyDollar },
              { label: "Avg Sale Price", value: fmt(a.sellOpportunities.overview.avgSalePrice), icon: CurrencyDollar },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <c.icon size={18} />
                  <span className="text-xs font-medium">{c.label}</span>
                </div>
                <p className="mt-2 font-heading text-2xl font-bold text-foreground">{c.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>      </Tabs>
    </div>
  );
};

export default Analytics;

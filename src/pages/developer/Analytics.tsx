import { developerAnalytics } from "@/data/mockAnalytics";
import { CurrencyDollar, Users, ChartBar } from "@phosphor-icons/react";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Analytics = () => {
  const a = developerAnalytics;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>

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
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Project Performance</h2>
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
    </div>
  );
};

export default Analytics;

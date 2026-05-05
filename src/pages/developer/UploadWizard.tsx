import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { toast } from "@/hooks/use-toast";
import { mockProjects } from "@/data/mockProjects";
import type { Project } from "@/types/api";

const steps = ["Basic Info", "Financial Details", "Media & Documents", "Review"];

const categoryDescriptions: Record<Project["category"], string> = {
  cash: "Cash — Aporte de capital líquido con horizonte corto y enfoque en rendimientos rápidos.",
  lend: "Lend — Financiamiento vía deuda; el inversionista presta capital y recibe intereses.",
  buy: "Buy — Compra de un activo existente ya en operación.",
  develop: "Develop — Financiamiento de un proyecto en construcción o desarrollo desde cero.",
};

const UploadWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", category: "develop" as Project["category"], description: "",
    minInvestment: "", interestMin: "", interestMax: "", termRange: "",
    highlights: "",
  });

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: form.title || "Untitled Project",
      slug: (form.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
      status: "waiting_approval",
      category: form.category,
      thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      images: [],
      termRange: form.termRange || "—",
      annualInterestRateMin: parseFloat(form.interestMin) || 0,
      annualInterestRateMax: parseFloat(form.interestMax) || 0,
      minInvestment: parseFloat(form.minInvestment) || 0,
      currency: "USD",
      description: form.description,
      highlights: form.highlights ? form.highlights.split("\n").filter(Boolean) : [],
      curatedBy: "The Finanz Butik Team",
      legalSupport: true,
      tiers: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProjects.unshift(newProject);

    toast({
      title: "Project submitted successfully! 🎉",
      description: "Your project is now waiting for approval.",
    });

    navigate("/developer");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Upload New Project</h1>
        <p className="text-sm text-muted-foreground">Create a new investment opportunity</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Villa Residencial Costa del Sol" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="lend">Lend</option>
                <option value="buy">Buy</option>
                <option value="develop">Develop</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {categoryDescriptions[form.category]}
              </p>

              <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">¿Qué significa cada categoría?</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li><span className="font-medium text-foreground">Cash:</span> Oportunidades de liquidez de corto plazo. El inversionista aporta capital disponible para obtener rendimientos rápidos con bajo riesgo.</li>
                  <li><span className="font-medium text-foreground">Lend:</span> Préstamos o financiamiento de deuda. El inversionista presta capital al proyecto y recibe pagos periódicos de interés con devolución del principal.</li>
                  <li><span className="font-medium text-foreground">Buy:</span> Adquisición de activos ya existentes (inmuebles, complejos, participaciones). El inversionista compra una porción del activo en operación.</li>
                  <li><span className="font-medium text-foreground">Develop:</span> Proyectos de desarrollo o construcción desde cero. El capital financia la creación del activo y los retornos provienen de su venta o renta futura.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Describe the project..." />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Min Investment (USD)</Label>
                <Input type="number" value={form.minInvestment} onChange={(e) => update("minInvestment", e.target.value)} placeholder="20000" />
              </div>
              <div className="space-y-2">
                <Label>Term Range</Label>
                <Input value={form.termRange} onChange={(e) => update("termRange", e.target.value)} placeholder="1 - 5 years" />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate Min (%)</Label>
                <Input type="number" step="0.1" value={form.interestMin} onChange={(e) => update("interestMin", e.target.value)} placeholder="6.5" />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate Max (%)</Label>
                <Input type="number" step="0.1" value={form.interestMax} onChange={(e) => update("interestMax", e.target.value)} placeholder="8.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Highlights (one per line)</Label>
              <Textarea value={form.highlights} onChange={(e) => update("highlights", e.target.value)} rows={3} placeholder={"Prime location\nHigh demand\nGuaranteed returns"} />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground cursor-pointer hover:border-primary/50">
                Click or drag to upload
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project Gallery</Label>
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground cursor-pointer hover:border-primary/50">
                Upload multiple images
              </div>
            </div>
            <div className="space-y-2">
              <Label>Documents (PDF)</Label>
              <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground cursor-pointer hover:border-primary/50">
                Upload legal documents
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-foreground">Review Your Project</h3>
            <dl className="space-y-2 text-sm">
              {[
                ["Title", form.title || "—"],
                ["Category", form.category],
                ["Min Investment", form.minInvestment ? `$${form.minInvestment}` : "—"],
                ["Interest Range", form.interestMin && form.interestMax ? `${form.interestMin}% – ${form.interestMax}%` : "—"],
                ["Term", form.termRange || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check size={16} className="mr-1" /> Submit Project
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadWizard;

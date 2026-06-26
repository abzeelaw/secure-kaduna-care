import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Phone, MessageCircle, Share2, Navigation, Ambulance, Clock } from "lucide-react";

export const Route = createFileRoute("/ambulance")({
  head: () => ({ meta: [{ title: "Ambulance Tracking — KARE" }] }),
  component: Track,
});

function Track() {
  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/sos" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Ambulance En Route</h1>
      </div>

      <div className="mx-5 mt-4 h-72 overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,#e8f4f3,#f5f9fc)] relative">
        {/* fake map */}
        <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full">
          <path d="M0 200 Q100 120 200 160 T400 80" stroke="oklch(0.66 0.12 184)" strokeWidth="4" fill="none" strokeDasharray="8 6" />
          <circle cx="60" cy="210" r="10" fill="oklch(0.66 0.12 184)" />
          <circle cx="340" cy="90" r="12" fill="oklch(0.65 0.21 25)" />
          {Array.from({length: 30}).map((_, i) => (
            <line key={i} x1={Math.random()*400} y1={Math.random()*280} x2={Math.random()*400} y2={Math.random()*280} stroke="oklch(0.92 0.005 240)" strokeWidth="1" />
          ))}
        </svg>
        <div className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold shadow">Live tracking</div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl border border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emergency-soft text-emergency">
            <Ambulance className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Ambulance KA 123 AB</p>
            <p className="text-xs text-muted-foreground">Toyota Hiace • White</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-[11px] text-muted-foreground">ETA</p>
            <p className="mt-1 flex items-center gap-1 text-lg font-bold text-primary"><Clock className="h-4 w-4" /> 8 min</p>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-[11px] text-muted-foreground">Distance</p>
            <p className="mt-1 text-lg font-bold">2.1 km away</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">MA</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Musa Abdullahi</p>
            <p className="text-xs text-muted-foreground">Paramedic Driver • 4.9 ★</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a href="tel:112" className="flex flex-col items-center gap-1 rounded-2xl bg-primary py-3 text-primary-foreground">
            <Phone className="h-4 w-4" /> <span className="text-xs font-semibold">Call</span>
          </a>
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-border py-3">
            <MessageCircle className="h-4 w-4" /> <span className="text-xs font-semibold">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-border py-3">
            <Share2 className="h-4 w-4" /> <span className="text-xs font-semibold">Share</span>
          </button>
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-2xl border border-border bg-background p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destination</p>
        <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
          <Navigation className="h-4 w-4 text-primary" /> Barau Dikko Teaching Hospital
        </p>
      </div>
    </PhoneShell>
  );
}

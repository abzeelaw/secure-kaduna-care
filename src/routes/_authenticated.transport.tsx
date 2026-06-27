import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Truck, Car, Bike, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/transport")({
  head: () => ({ meta: [{ title: "Emergency Transport — KARE" }] }),
  component: TransportPage,
});

const types = [
  { l: "Ambulance", i: Truck },
  { l: "Emergency Car", i: Car },
  { l: "Motorcycle", i: Bike },
];

function TransportPage() {
  return (
    <PhoneShell>
      <TopBar title="Request Transport" />
      <div className="px-5 pt-5">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Transport Type</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {types.map((t, i) => {
            const Icon = t.i;
            return (
              <button key={t.l} className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 ${i === 0 ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>
                <Icon className="h-6 w-6" />
                <span className="text-[11px] font-semibold">{t.l}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">Pickup Location</p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-primary" />
          <input defaultValue="Barnawa, Kaduna" className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Destination</p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-emergency" />
          <input defaultValue="Barau Dikko Hospital" className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <button className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Request Now</button>
      </div>
    </PhoneShell>
  );
}

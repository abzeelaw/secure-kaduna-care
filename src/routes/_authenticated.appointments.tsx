import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — KARE" }] }),
  component: Appts,
});

type AppointmentRow = {
  id: string;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  reason: string | null;
  doctor: { full_name: string; specialty: string } | null;
  hospital: { name: string } | null;
};

const tabs = ["Upcoming", "Completed", "Cancelled"] as const;
type Tab = typeof tabs[number];

function Appts() {
  const [tab, setTab] = useState<Tab>("Upcoming");
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id,scheduled_at,status,reason, doctor:doctors(full_name,specialty), hospital:hospitals(name)")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as AppointmentRow[];
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Appointment cancelled"); qc.invalidateQueries({ queryKey: ["appointments"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not cancel"),
  });

  const now = Date.now();
  const filtered = data.filter((a) => {
    if (tab === "Upcoming") return a.status === "scheduled" && new Date(a.scheduled_at).getTime() >= now;
    if (tab === "Completed") return a.status === "completed" || (a.status === "scheduled" && new Date(a.scheduled_at).getTime() < now);
    return a.status === "cancelled" || a.status === "no_show";
  });

  return (
    <PhoneShell>
      <div className="flex items-center justify-between px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Appointments</h1>
        <Link to="/specialists" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 rounded-full bg-muted p-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 text-xs font-semibold ${tab === t ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pt-5">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-background py-10 text-center text-sm text-muted-foreground">No appointments here.</p>
        )}
        {filtered.map((a) => {
          const when = new Date(a.scheduled_at);
          const docName = a.doctor?.full_name ?? "Doctor";
          return (
            <div key={a.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {docName.replace("Dr. ", "")[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{docName}</p>
                  <p className="text-xs text-muted-foreground">{a.doctor?.specialty ?? ""}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${tab === "Upcoming" ? "bg-primary-soft text-primary" : tab === "Completed" ? "bg-success/15 text-success" : "bg-emergency-soft text-emergency"}`}>
                  {tab}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{a.hospital?.name ?? ""}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-semibold">{when.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} • {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {tab === "Upcoming" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to="/telemedicine" className="rounded-xl border border-border py-2 text-center text-xs font-semibold">Join Call</Link>
                  <button onClick={() => cancel.mutate(a.id)} className="rounded-xl bg-emergency-soft py-2 text-xs font-semibold text-emergency">Cancel</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PhoneShell>
  );
}

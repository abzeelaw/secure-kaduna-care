import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { useState, useMemo } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { DEFAULT_DOCTORS } from "@/data/kare-content";

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
  hospital: { name: string; address: string } | null;
  consultation_fee: string | null;
};

const tabs = ["Upcoming", "Completed", "Cancelled"] as const;
type Tab = typeof tabs[number];

function Appts() {
  const [tab, setTab] = useState<Tab>("Upcoming");
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data = [] } = useQuery<AppointmentRow[]>({
    queryKey: ["appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id,scheduled_at,status,reason, doctor:doctors(full_name,specialty), hospital:hospitals(name,address), consultation_fee")
        .eq("user_id", user?.id)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AppointmentRow[];
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not cancel"),
  });

  // Booking UI state
  const [showBook, setShowBook] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const { data: doctors = DEFAULT_DOCTORS } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("doctors").select("*, hospital:hospitals(id,name,address)").order("rating", { ascending: false });
        return (data?.length ? data : DEFAULT_DOCTORS) as any;
      } catch {
        return DEFAULT_DOCTORS as any;
      }
    },
  });

  const book = useMutation({
    mutationFn: async (payload: { doctorId: string; when: string }) => {
      if (!user) throw new Error("Not signed in");
      const { doctorId, when } = payload;
      const { error } = await supabase.from("appointments").insert({ user_id: user.id, doctor_id: doctorId, scheduled_at: when, reason: `Booked via calendar` });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Appointment booked"); qc.invalidateQueries({ queryKey: ["appointments"] }); setShowBook(false); setSelectedDoctorId(null); setSelectedDate(null); setSelectedHour(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Booking failed"),
  });

  const now = Date.now();
  const filtered = data.filter((a) => {
    if (tab === "Upcoming") return a.status === "scheduled" && new Date(a.scheduled_at).getTime() >= now;
    if (tab === "Completed") return a.status === "completed" || (a.status === "scheduled" && new Date(a.scheduled_at).getTime() < now);
    return a.status === "cancelled" || a.status === "no_show";
  });

  const selectedDoctor = doctors.find((d: any) => d.id === selectedDoctorId) as any | undefined;

  const next30 = useMemo(() => {
    const today = new Date();
    const out: { date: Date; available: boolean }[] = [];
    for (let i = 0; i < 30; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      let available = true;
      if (selectedDoctor?.weekly_schedule) {
        const dayName = dt.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const availableWeekdays = selectedDoctor.weekly_schedule.map((s: string) => s.split(" ")[0].toLowerCase());
        available = availableWeekdays.includes(dayName);
      }
      out.push({ date: dt, available });
    }
    return out;
  }, [selectedDoctor]);

  const availableHours = [9, 11, 14, 16];

  async function confirmBooking() {
    if (!selectedDoctorId || !selectedDate || selectedHour == null) return;
    const when = new Date(selectedDate);
    when.setHours(selectedHour, 0, 0, 0);
    await book.mutateAsync({ doctorId: selectedDoctorId, when: when.toISOString() });
  }

  return (
    <PhoneShell>
      <div className="flex items-center justify-between px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Appointments</h1>
        <button onClick={() => setShowBook(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </button>
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
              <p className="mt-1 text-xs text-muted-foreground">{a.hospital?.address ?? ""}</p>
              <p className="mt-2 text-sm font-semibold">{a.consultation_fee ? `Consultation: ${a.consultation_fee}` : "Consultation fee not set"}</p>
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

      {/* Booking modal */}
      {showBook && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[720px] rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Book Appointment</h3>
              <button onClick={() => setShowBook(false)} className="text-muted-foreground">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <div className="space-y-2">
                  {doctors.map((d: any) => (
                    <button key={d.id} onClick={() => { setSelectedDoctorId(d.id); setSelectedDate(null); setSelectedHour(null); }} className={`w-full text-left rounded-xl border p-3 ${selectedDoctorId === d.id ? 'border-primary bg-primary-soft' : 'border-border bg-card'}`}>
                      <p className="font-semibold">{d.full_name}</p>
                      <p className="text-xs text-muted-foreground">{d.specialty}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                {!selectedDoctor ? <p className="text-sm text-muted-foreground">Select a doctor to view availability</p> : (
                  <>
                    <p className="text-sm font-semibold">Select day</p>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {next30.map((d) => (
                        <button key={d.date.toDateString()} disabled={!d.available} onClick={() => { if (d.available) setSelectedDate(d.date); }} className={`rounded-lg p-2 text-sm ${d.available ? 'border border-border bg-background' : 'opacity-40'} ${selectedDate && d.date.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-primary' : ''}`}>
                          <div className="text-xs">{d.date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                          <div className="font-medium">{d.date.getDate()}</div>
                        </button>
                      ))}
                    </div>

                    {selectedDate && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold">Select time</p>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {availableHours.map((h) => (
                            <button key={h} onClick={() => setSelectedHour(h)} className={`rounded-xl p-2 ${selectedHour === h ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}>
                              {h}:00
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <button onClick={confirmBooking} disabled={book.isLoading || !selectedHour} className="rounded-2xl bg-primary py-2 px-4 text-sm font-semibold text-primary-foreground">{book.isLoading ? 'Booking…' : 'Confirm'}</button>
                          <button onClick={() => { setSelectedDate(null); setSelectedHour(null); }} className="rounded-2xl border border-border py-2 px-4 text-sm">Reset</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </PhoneShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Star, Building2, Award, Clock, MapPin } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { DEFAULT_DOCTORS, DEFAULT_HOSPITALS } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/doctors/$id")({
  head: () => ({ meta: [{ title: "Doctor Profile — KARE" }] }),
  component: Doctor,
});

function Doctor() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const qc = useQueryClient();

  const { data: d } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("doctors").select("*, hospital:hospitals(id,name,address)").eq("id", id).maybeSingle();
        if (error) throw error;
        if (data) return data;
      } catch {
        // fall through to local fallback
      }
      return DEFAULT_DOCTORS.find((doctor) => doctor.id === id);
    },
  });

  const doctor = d ?? DEFAULT_DOCTORS.find((doctor) => doctor.id === id);
  const hospital = doctor?.hospital ? doctor.hospital : DEFAULT_HOSPITALS.find((h) => h.id === doctor?.hospital?.id);

  async function book(slotHours: number) {
    if (!user || !doctor) return;
    setBusy(true);
    try {
      const when = new Date();
      when.setDate(when.getDate() + 1);
      when.setHours(slotHours, 0, 0, 0);
      const insertData: Record<string, unknown> = {
        user_id: user.id,
        doctor_id: doctor.id,
        scheduled_at: when.toISOString(),
        reason: `Consultation with ${doctor.full_name}`,
      };
      if (hospital?.id) insertData.hospital_id = hospital.id;
      const { error } = await supabase.from("appointments").insert(insertData);
      if (error) throw error;
      toast.success("Appointment booked");
      qc.invalidateQueries({ queryKey: ["appointments"] });
      navigate({ to: "/appointments" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  if (!doctor) return <PhoneShell><div className="p-10 text-center text-muted-foreground">Loading…</div></PhoneShell>;

  const initials = doctor.full_name.replace("Dr. ", "").split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <PhoneShell>
      <div className="flex items-center justify-between px-5 pt-4">
        <Link to="/specialists" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-semibold">Doctor Profile</h1>
        <div className="w-9" />
      </div>

      <div className="flex flex-col items-center px-5 pt-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">{initials}</div>
        <h2 className="mt-4 text-xl font-bold">{doctor.full_name}</h2>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        <div className="mt-2 flex items-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 fill-warning text-warning" /> {Number(doctor.rating).toFixed(1)}
        </div>
      </div>

      <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <Award className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-sm font-bold">{doctor.years_experience} yrs</p>
          <p className="text-[10px] text-muted-foreground">Experience</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <Building2 className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-[11px] font-semibold leading-tight">{hospital?.name ?? doctor.hospital?.name ?? "Independent"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <p className="text-sm font-bold text-primary">{doctor.consultation_fee}</p>
          <p className="text-[10px] text-muted-foreground">Consultation</p>
        </div>
      </div>

      <h3 className="px-5 pt-6 pb-2 text-sm font-semibold">About</h3>
      <p className="px-5 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>

      <div className="mt-5 rounded-2xl border border-border bg-background p-4 px-5">
        <h3 className="text-sm font-semibold">Clinic Location</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{hospital?.address ?? doctor.hospital.address}</p>
        <p className="mt-1 text-sm text-muted-foreground">Call: {doctor.phone}</p>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-4 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Available hours</h3>
          <span className="text-xs text-muted-foreground">{doctor.availability}</span>
        </div>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {doctor.weekly_schedule.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="px-5 pt-6 pb-2 text-sm font-semibold">Pick a slot — tomorrow</h3>
      <div className="grid grid-cols-3 gap-2 px-5">
        {[9, 11, 14, 16].map((h) => (
          <button key={h} disabled={busy} onClick={() => book(h)} className="rounded-2xl border border-primary bg-primary-soft py-3 text-sm font-semibold text-primary disabled:opacity-60">
            {h}:00
          </button>
        ))}
      </div>
    </PhoneShell>
  );
}

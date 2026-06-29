import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Building2, Star, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_DOCTORS, DEFAULT_HOSPITALS } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/hospitals/$id")({
  head: () => ({ meta: [{ title: "Hospital Details — KARE" }] }),
  component: HospitalDetails,
});

function HospitalDetails() {
  const { id } = Route.useParams();

  const { data: hospitalData } = useQuery({
    queryKey: ["hospital", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("hospitals").select("*").eq("id", id).maybeSingle();
        if (error) throw error;
        return data ?? DEFAULT_HOSPITALS.find((hospital) => hospital.id === id);
      } catch {
        return DEFAULT_HOSPITALS.find((hospital) => hospital.id === id);
      }
    },
    enabled: !!id,
  });

  const doctors = useQuery({
    queryKey: ["hospital-doctors", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*, hospital:hospitals(id,name,address)")
          .eq("hospital_id", id);
        if (error) throw error;
        if (data?.length) return data;
      } catch {
        // fall back to local doctors
      }
      return DEFAULT_DOCTORS.filter((doctor) => doctor.hospital.id === id);
    },
    enabled: !!id,
  });

  const hospital = hospitalData ?? DEFAULT_HOSPITALS.find((hospital) => hospital.id === id);
  const doctorList = doctors.data ?? DEFAULT_DOCTORS.filter((doctor) => doctor.hospital.id === id);

  if (!hospital) {
    return (
      <PhoneShell>
        <div className="p-10 text-center text-muted-foreground">Hospital not found.</div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/hospitals" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold truncate">{hospital.name}</h1>
          <p className="text-xs text-muted-foreground">{hospital.type} hospital</p>
        </div>
      </div>

      <div className="mx-5 mt-5 rounded-3xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-soft text-primary">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{hospital.lga}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-[11px] font-semibold text-warning">
                <Star className="h-3 w-3 fill-warning text-warning" /> {Number(hospital.rating).toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{hospital.address}</p>
            <p className="mt-2 text-sm font-medium text-success">{hospital.has_emergency ? "Emergency services available" : "No emergency services"}</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-6 rounded-3xl border border-border bg-background p-5">
        <h2 className="text-sm font-semibold">Doctors at this hospital</h2>
        {doctorList.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No doctors are currently listed for this hospital.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {doctorList.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.id}`}
                className="block rounded-3xl border border-border bg-surface px-4 py-4 hover:border-primary hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{doctor.full_name}</p>
                    <p className="text-[11px] text-muted-foreground">{doctor.specialty}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{doctor.consultation_fee}</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{doctor.availability}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mx-5 mt-6 rounded-3xl border border-border bg-background p-5">
        <h2 className="text-sm font-semibold">Contact</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {hospital.address}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Phone: {hospital.phone}</p>
      </div>
    </PhoneShell>
  );
}

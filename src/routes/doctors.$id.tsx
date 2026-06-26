import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Star, Building2, Award } from "lucide-react";

export const Route = createFileRoute("/doctors/$id")({
  head: () => ({ meta: [{ title: "Doctor Profile — KARE" }] }),
  component: Doctor,
});

function Doctor() {
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
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">MI</div>
        <h2 className="mt-4 text-xl font-bold">Dr. Musa Ibrahim</h2>
        <p className="text-sm text-muted-foreground">Cardiologist</p>
        <div className="mt-2 flex items-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 fill-warning text-warning" /> 4.9 <span className="text-xs text-muted-foreground">(128 reviews)</span>
        </div>
      </div>

      <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <Award className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-sm font-bold">15 yrs</p>
          <p className="text-[10px] text-muted-foreground">Experience</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <Building2 className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-sm font-bold">Barau Dikko</p>
          <p className="text-[10px] text-muted-foreground">Teaching Hospital</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-3 text-center">
          <p className="text-sm font-bold text-primary">₦10,000</p>
          <p className="text-[10px] text-muted-foreground">Consultation</p>
        </div>
      </div>

      <h3 className="px-5 pt-6 pb-2 text-sm font-semibold">About Doctor</h3>
      <p className="px-5 text-sm leading-relaxed text-muted-foreground">
        Specializes in treatment of heart conditions, hypertension, chest pain and preventative
        cardiology. Trained at ABU Zaria with fellowships in interventional cardiology.
      </p>

      <h3 className="px-5 pt-6 pb-2 text-sm font-semibold">Available Days</h3>
      <div className="flex gap-2 px-5">
        {["Mon","Wed","Fri"].map((d) => (
          <span key={d} className="rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary">{d}</span>
        ))}
      </div>

      <div className="px-5 pt-8">
        <Link to="/appointments/book" className="block w-full rounded-2xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30">
          View Available Slots
        </Link>
      </div>
    </PhoneShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { HeartPulse, Stethoscope, ShieldCheck, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KARE — Emergency Response & Healthcare for Kaduna" },
      { name: "description", content: "Emergency help, hospitals, doctors and health records — all in one app for Kaduna State." },
    ],
  }),
  component: Welcome,
});

const onboarding = [
  { icon: HeartPulse, title: "Get emergency help when every second matters", body: "Instant response, real-time tracking and the nearest help when you need it most.", color: "bg-emergency-soft text-emergency" },
  { icon: Stethoscope, title: "Consult doctors & book specialists", body: "Find the right doctor for the care you deserve, anywhere in Kaduna.", color: "bg-primary-soft text-primary" },
  { icon: ShieldCheck, title: "Manage your health easily & securely", body: "Keep records, prescriptions and appointments in one trusted place.", color: "bg-secondary text-info" },
];

function Welcome() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"splash" | "onboard" | "login">("splash");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (stage === "splash") {
      const t = setTimeout(() => setStage("onboard"), 1600);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-background">
        {stage === "splash" && <Splash />}
        {stage === "onboard" && (
          <Onboard
            step={step}
            onNext={() => (step < 2 ? setStep(step + 1) : setStage("login"))}
            onSkip={() => setStage("login")}
          />
        )}
        {stage === "login" && <Login onDone={() => navigate({ to: "/home" })} />}
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
      <KareLogo className="text-5xl" />
      <p className="text-center text-sm text-muted-foreground">Kaduna Emergency Response & Healthcare</p>
      <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}

function Onboard({ step, onNext, onSkip }: { step: number; onNext: () => void; onSkip: () => void }) {
  const s = onboarding[step];
  const Icon = s.icon;
  return (
    <div className="flex flex-1 flex-col px-6 pt-10">
      <div className="flex justify-end">
        <button onClick={onSkip} className="text-sm font-medium text-muted-foreground">Skip</button>
      </div>
      <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
        <div className={`flex h-44 w-44 items-center justify-center rounded-[2.5rem] ${s.color}`}>
          <Icon className="h-20 w-20" strokeWidth={1.5} />
        </div>
        <h1 className="mt-10 text-2xl font-bold leading-tight text-foreground">{s.title}</h1>
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">{s.body}</p>
      </div>
      <div className="mb-10 flex items-center justify-between">
        <div className="flex gap-1.5">
          {onboarding.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
          ))}
        </div>
        <button onClick={onNext} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
          {step < 2 ? "Next" : "Get Started"} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  return (
    <div className="flex flex-1 flex-col px-6 pt-10">
      <KareLogo className="text-2xl" />
      <h1 className="mt-8 text-2xl font-bold">Welcome back 👋</h1>
      <p className="mt-1 text-sm text-muted-foreground">Login to your account</p>

      <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1">
        {(["login", "register"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 text-sm font-semibold capitalize ${tab === t ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onDone(); }} className="mt-6 flex flex-1 flex-col gap-4">
        {tab === "register" && (
          <Field label="Full name" placeholder="Habeeb Muhammad" />
        )}
        <Field label="Email or phone number" placeholder="you@kare.ng" type="email" />
        <Field label="Password" placeholder="••••••••" type="password" />
        {tab === "login" && (
          <button type="button" className="self-end text-sm font-medium text-primary">Forgot password?</button>
        )}
        <button type="submit" className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
          {tab === "login" ? "Login" : "Create account"}
        </button>

        <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
        </div>
        <button type="button" onClick={onDone} className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-medium">
          <span className="text-base">🟢</span> Continue with Google
        </button>
        <button type="button" onClick={onDone} className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-medium">
           Continue with Apple
        </button>
        <p className="pb-8 pt-2 text-center text-xs text-muted-foreground">
          By continuing you agree to the KARE <Link to="/" className="text-primary">Terms</Link> and <Link to="/" className="text-primary">Privacy</Link>.
        </p>
      </form>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input {...rest} className="rounded-2xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none" />
    </label>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — KARE" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: { full_name: name, phone },
          },
        });
        if (error) throw error;
        toast.success("Account created");
      }
      navigate({ to: "/home", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/home", replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-background px-6 pt-10">
        <KareLogo className="text-2xl" />
        <h1 className="mt-8 text-2xl font-bold">{tab === "login" ? "Welcome back 👋" : "Create your KARE account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tab === "login" ? "Login to access your health hub" : "Get emergency help and manage your care"}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1">
          {(["login", "register"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 text-sm font-semibold capitalize ${tab === t ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {tab === "register" && (
            <>
              <Field label="Full name" value={name} onChange={setName} placeholder="Habeeb Muhammad" required />
              <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />
            </>
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@kare.ng" required />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          <button disabled={busy} type="submit" className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-60">
            {busy ? "Please wait…" : tab === "login" ? "Login" : "Create account"}
          </button>
          <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <button type="button" disabled={busy} onClick={google} className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-medium disabled:opacity-60">
            <span className="text-base">🟢</span> Continue with Google
          </button>
          <p className="pb-8 pt-2 text-center text-xs text-muted-foreground">
            By continuing you agree to the KARE <Link to="/" className="text-primary">Terms</Link> and <Link to="/" className="text-primary">Privacy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-input bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none" />
    </label>
  );
}

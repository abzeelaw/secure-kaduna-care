import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign in — KARE" }],
  }),
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate({
          to: "/home",
          replace: true,
        });
      }
    }

    checkSession();
  }, [navigate]);

  function isEmailConfirmationError(message: string) {
    return /email.*confirm|confirm.*email|email_not_confirmed|user.*not.*confirmed|not.*confirmed/i.test(message);
  }

  function isInvalidCredentialsError(message: string) {
    return /invalid.*credentials|invalid.*login|wrong.*password|incorrect.*password|invalid.*email|user.*not.*found/i.test(message);
  }

  function getAuthMessage(err: unknown) {
    if (!err) return "Authentication failed.";

    if (err instanceof Error) return err.message;
    if (typeof err === "object") {
      const anyErr = err as Record<string, unknown>;
      if (typeof anyErr.message === "string") return anyErr.message;
      if (typeof anyErr.error_description === "string") return anyErr.error_description;
      if (typeof anyErr.error === "string") return anyErr.error;
    }

    return String(err);
  }

  function validatePassword(value: string) {
    return value.length >= 8;
  }

  async function ensureProfileExists(user: any) {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            phone: user.user_metadata?.phone ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (profileError) {
      console.warn('[auth] ensureProfileExists error:', profileError);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setStatusMessage(null);

    try {
      if (tab === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (isEmailConfirmationError(error.message)) {
            setStatusMessage(
              "Your account needs email confirmation before you can sign in. If your Supabase project requires confirmation, please confirm your email first."
            );
            toast.error("Your account needs email confirmation before you can sign in.");
            return;
          }

          throw error;
        }

        await ensureProfileExists(data.user);

        toast.success("Welcome back!");

        navigate({
          to: "/home",
          replace: true,
        });
      } else {
        if (!validatePassword(password)) {
          setStatusMessage("Use at least 8 characters.");
          toast.error("Please choose a password with at least 8 characters.");
          return;
        }

        // Call server endpoint that creates the user via the Supabase admin key.
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: name, phone }),
        });

        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload?.error || 'Registration failed');
        }

        // Do NOT auto-login. Require the user to sign in with the credentials they used.
        setTab('login');
        setStatusMessage('Account created. Please sign in with the credentials you registered.');
        toast.success('Account created. Please sign in.');
        return;
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);

      const message = getAuthMessage(err);

      if (isEmailConfirmationError(message)) {
        setStatusMessage(
          "Your account needs email confirmation before you can sign in. Please check your inbox and confirm your email."
        );
      } else if (isInvalidCredentialsError(message)) {
        setStatusMessage(
          "Invalid credentials. If you just registered, verify your email first or try again with the correct email and password."
        );
      } else {
        setStatusMessage(message);
      }

      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col bg-background px-6 pt-10">

        <KareLogo className="text-2xl" />

        <h1 className="mt-8 text-2xl font-bold">
          {tab === "login"
            ? "Welcome Back 👋"
            : "Create your KARE Account"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {tab === "login"
            ? "Sign in to continue."
            : "Join KARE today."}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1">
          <button
            onClick={() => {
              setTab("login");
              setStatusMessage(null);
            }}
            className={`rounded-full py-2 ${
              tab === "login"
                ? "bg-background shadow text-primary"
                : ""
            }`}
          >
            Login
          </button>

          <button
            onClick={() => {
              setTab("register");
              setStatusMessage(null);
            }}
            className={`rounded-full py-2 ${
              tab === "register"
                ? "bg-background shadow text-primary"
                : ""
            }`}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-4"
        >
          {tab === "register" && (
            <>
              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                required
              />

              <Field
                label="Phone Number"
                value={phone}
                onChange={setPhone}
              />
            </>
          )}

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          <button
            disabled={busy}
            type="submit"
            className="rounded-2xl bg-primary py-3 text-white font-semibold"
          >
            {busy
              ? "Please wait..."
              : tab === "login"
              ? "Login"
              : "Create Account"}
          </button>

          {statusMessage && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              {statusMessage}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            disabled
            className="w-full rounded-2xl border py-3 opacity-50 cursor-not-allowed"
          >
            Google Sign In (Coming Soon)
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to the{" "}
          <Link to="/" className="text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/" className="text-primary">
            Privacy Policy
          </Link>
        </p>

      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-input px-4 py-3 outline-none focus:border-primary"
      />
    </label>
  );
}
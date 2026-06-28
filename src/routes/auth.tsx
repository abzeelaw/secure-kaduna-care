import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { supabase } from "@/integrations/supabase/client";
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
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
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

        toast.success("Welcome back!");

        navigate({
          to: "/home",
          replace: true,
        });
      } else {
        if (!validatePassword(password)) {
          setStatusMessage(
            "Use at least 8 characters with uppercase, lowercase, a number, and a symbol."
          );
          toast.error("Please choose a stronger password.");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Account created successfully!");
          navigate({
            to: "/home",
            replace: true,
          });
          return;
        }

        setTab("login");
        setStatusMessage(
          "Your account was created. It looks like this Supabase project requires email confirmation, so please verify your email before signing in."
        );
        toast.success(
          "Account created. Verify your email before signing in."
        );
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
      <div className="mx-auto flex min-h-screen max-w-110 flex-col bg-background px-6 pt-10">

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

        <p className="mt-3 text-xs text-muted-foreground">
          Each time the app is reopened, you will need to sign in again for a fresh session.
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
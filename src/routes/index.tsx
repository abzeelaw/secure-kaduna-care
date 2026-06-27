import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "KARE — Emergency Response & Healthcare for Kaduna" },
      { name: "description", content: "Emergency help, hospitals, doctors and health records — all in one app for Kaduna State." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      await new Promise((r) => setTimeout(r, 900));
      if (cancelled) return;
      navigate({ to: data.session ? "/home" : "/auth", replace: true });
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center gap-6 bg-background px-8">
        <KareLogo className="text-5xl" />
        <p className="text-center text-sm text-muted-foreground">Kaduna Emergency Response & Healthcare</p>
        <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

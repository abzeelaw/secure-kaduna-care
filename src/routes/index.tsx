import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { KareLogo } from "@/components/kare/PhoneShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      {
        title: "KARE — Emergency Response & Healthcare",
      },
      {
        name: "description",
        content:
          "Emergency help, hospitals, doctors and health records — all in one app.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  navigate({
    to: "/onboarding",
    replace: true,
  });
};

    start();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center bg-background px-8">

        <KareLogo className="text-5xl" />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Kaduna Emergency Response & Healthcare
        </p>

        <div className="mt-10 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>

      </div>
    </div>
  );
}
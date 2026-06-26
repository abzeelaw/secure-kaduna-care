import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { Mic, Video, PhoneOff, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/telemedicine")({
  head: () => ({ meta: [{ title: "Telemedicine — KARE" }] }),
  component: TelePage,
});

function TelePage() {
  return (
    <PhoneShell hideNav>
      <div className="relative h-[100vh] max-h-[800px] bg-gradient-to-br from-[oklch(0.3_0.05_257)] to-[oklch(0.2_0.04_257)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mx-auto h-28 w-28 rounded-full bg-primary/30 flex items-center justify-center text-3xl font-bold">AY</div>
            <p className="mt-4 text-base font-semibold">Dr. Aisha Yusuf</p>
            <p className="text-xs opacity-70">Pediatrician · Connected</p>
            <p className="mt-1 text-xs opacity-70">04:23</p>
          </div>
        </div>

        <div className="absolute right-4 top-12 h-28 w-20 rounded-xl bg-card/20 border border-white/20 backdrop-blur flex items-center justify-center text-white text-xs">You</div>

        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"><MessageSquare className="h-5 w-5" /></button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"><Video className="h-5 w-5" /></button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"><Mic className="h-5 w-5" /></button>
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-lg"><PhoneOff className="h-6 w-6" /></button>
        </div>
      </div>
    </PhoneShell>
  );
}

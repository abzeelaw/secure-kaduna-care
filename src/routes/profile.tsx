import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { User, HeartPulse, Phone, Bell, Lock, Languages, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — KARE" }] }),
  component: ProfilePage,
});

const groups = [
  { title: "Account", items: [
    { i: User, l: "Personal Information" },
    { i: HeartPulse, l: "Medical Information" },
    { i: Phone, l: "Emergency Contacts" },
  ]},
  { title: "Preferences", items: [
    { i: Bell, l: "Notifications" },
    { i: Lock, l: "Privacy & Security" },
    { i: Languages, l: "Language Preferences" },
  ]},
  { title: "Support", items: [
    { i: HelpCircle, l: "Help & Support" },
    { i: Info, l: "About KARE" },
  ]},
];

function ProfilePage() {
  return (
    <PhoneShell>
      <TopBar title="Profile & Settings" />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">HM</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Habeeb Muhammad</p>
            <p className="text-xs text-muted-foreground">0803 123 4567</p>
            <p className="text-xs text-muted-foreground">habeeb@gmail.com</p>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title} className="mt-5">
            <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">{g.title}</p>
            <div className="mt-2 rounded-2xl border border-border bg-card divide-y divide-border">
              {g.items.map((it) => {
                const Icon = it.i;
                return (
                  <button key={it.l} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{it.l}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-emergency py-3.5 text-sm font-semibold text-emergency">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </div>
    </PhoneShell>
  );
}

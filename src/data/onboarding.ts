import {
  ShieldCheck,
  Siren,
  Hospital,
} from "lucide-react";

export const onboardingSlides = [
  {
    id: 1,
    title: "Protect",
    subtitle:
      "Welcome to KARE. Your trusted emergency response and healthcare companion for Kaduna State.",
    description:
      "Get emergency assistance, trusted healthcare access and safety tools all in one place.",
    icon: ShieldCheck,
    color: "from-cyan-500 to-teal-500",
  },

  {
    id: 2,
    title: "Respond",
    subtitle:
      "Report emergencies instantly with your phone.",
    description:
      "Send your GPS location, upload photos, record voice messages and notify responders in seconds.",
    icon: Siren,
    color: "from-orange-500 to-red-500",
  },

  {
    id: 3,
    title: "Recover",
    subtitle:
      "Healthcare when you need it.",
    description:
      "Locate hospitals, access emergency contacts, receive alerts and manage your health records securely.",
    icon: Hospital,
    color: "from-blue-500 to-indigo-500",
  },
];
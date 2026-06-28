import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  start: () => void;
  stop: () => void;
};

export default function VoiceControlButton() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechCtor) return;
    };
  }, []);

  function applyTheme(nextTheme: "dark" | "light") {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  function includesAny(command: string, terms: string[]) {
    return terms.some((term) => command.includes(term));
  }

  function handleCommand(text: string) {
    const command = text.toLowerCase().trim();
    if (!command) return;

    if (includesAny(command, ["home", "main menu", "gida", "ile", "ụlọ", "goto home", "go home"])) {
      navigate({ to: "/home" });
      toast.success("Opened home");
      return;
    }

    if (includesAny(command, ["doctor", "specialist", "likita", "likitoci", "dókítà", "dokita", "dọkịta"])) {
      navigate({ to: "/specialists" });
      toast.success("Opened specialists");
      return;
    }

    if (includesAny(command, ["hospital", "clinic", "asibiti", "ileewosan", "ụlọọgwụ"])) {
      navigate({ to: "/hospitals" });
      toast.success("Opened hospitals");
      return;
    }

    if (includesAny(command, ["pharmacy", "drug", "magani", "elegbogi", "ogwọ", "ogwu"])) {
      navigate({ to: "/pharmacy" });
      toast.success("Opened pharmacy finder");
      return;
    }

    if (includesAny(command, ["education", "learn", "ilimi", "ilimi", "mmụta", "ụlọ akwụkwọ", "koyo"])) {
      navigate({ to: "/education" });
      toast.success("Opened health education");
      return;
    }

    if (includesAny(command, ["emergency", "sos", "gaggawa", "bargadi", "mberede", "ajejo", "ogbako"])) {
      navigate({ to: "/sos" });
      toast.success("Opened emergency help");
      return;
    }

    if (includesAny(command, ["dark mode", "dark", "duhu", "dudu", "oji"])) {
      applyTheme("dark");
      toast.success("Dark mode enabled");
      return;
    }

    if (includesAny(command, ["light mode", "light", "haske", "fẹlẹfẹlẹ", "ọcha"])) {
      applyTheme("light");
      toast.success("Light mode enabled");
      return;
    }

    toast.message(`Voice command: ${command}`);
  }

  function toggleVoice() {
    if (typeof window === "undefined") {
      toast.error("Voice control is not available in this browser.");
      return;
    }

    const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechCtor) {
      toast.error("Voice control is not supported in this browser.");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    const recognition = new SpeechCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice control stopped unexpectedly.");
    };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ");
      handleCommand(transcript);
    };

    recognition.start();
  }

  return (
    <button
      type="button"
      onClick={toggleVoice}
      className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition ${listening ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
      aria-label="Voice control"
    >
      {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </button>
  );
}

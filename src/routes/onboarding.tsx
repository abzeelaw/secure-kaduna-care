import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import AnimatedBackground from "@/components/onboarding/AnimatedBackground";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import ProgressDots from "@/components/onboarding/ProgressDots";
import { KareLogo } from "@/components/kare/PhoneShell";
import { onboardingSlides } from "@/data/onboarding";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      {
        title: "Welcome to KARE",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  const slide = onboardingSlides[current];

  const isLast = current === onboardingSlides.length - 1;

  function finish() {
    localStorage.setItem("kare_onboarding_complete", "true");

    navigate({
      to: "/auth",
      replace: true,
    });
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }

    setCurrent((prev) => prev + 1);
  }

  function back() {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  }

  function skip() {
    finish();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      <AnimatedBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[440px] flex-col px-8 py-10">

        {/* Logo */}

        <div className="flex justify-center">
          <KareLogo className="text-3xl" />
        </div>

        {/* Progress */}

        <div className="mt-8 flex justify-center">
          <ProgressDots
            total={onboardingSlides.length}
            current={current}
          />
        </div>

        {/* Slide */}

        <div className="flex flex-1 items-center justify-center">

          <AnimatePresence mode="wait">

            <OnboardingSlide
              key={slide.id}
              title={slide.title}
              subtitle={slide.subtitle}
              description={slide.description}
              Icon={slide.icon}
            />

          </AnimatePresence>

        </div>

        {/* Buttons */}

        <NavigationButtons
          current={current}
          total={onboardingSlides.length}
          next={next}
          back={back}
          skip={skip}
        />

      </div>

    </div>
  );
}
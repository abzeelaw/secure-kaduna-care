import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
        }}
        className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
      />

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
      />
    </>
  );
}
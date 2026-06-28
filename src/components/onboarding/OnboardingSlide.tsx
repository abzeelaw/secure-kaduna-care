import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle: string;
  description: string;
  Icon: any;
}

export default function OnboardingSlide({
  title,
  subtitle,
  description,
  Icon,
}: Props) {
  return (
    <motion.div
      key={title}
      initial={{
        opacity: 0,
        x: 80,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -80,
      }}
      transition={{
        duration: .45,
      }}
      className="flex flex-col items-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
        className="mb-12 rounded-full bg-primary/10 p-8"
      >
        <Icon className="h-24 w-24 text-primary"/>
      </motion.div>

      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <p className="mt-5 text-xl font-medium text-center">
        {subtitle}
      </p>

      <p className="mt-5 max-w-sm text-center text-muted-foreground leading-7">
        {description}
      </p>
    </motion.div>
  );
}
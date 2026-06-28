interface Props {
  total: number;
  current: number;
}

export default function ProgressDots({
  total,
  current,
}: Props) {
  return (
    <div className="flex gap-2">

      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current
              ? "w-8 bg-primary"
              : "w-2 bg-muted"
          }`}
        />
      ))}

    </div>
  );
}
interface Props {
  current: number;
  total: number;
  next(): void;
  back(): void;
  skip(): void;
}

export default function NavigationButtons({
  current,
  total,
  next,
  back,
  skip,
}: Props) {
  const isLast = current === total - 1;

  return (
    <div className="mt-8 flex items-center justify-between">

      <button
        onClick={current === 0 ? skip : back}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition"
      >
        {current === 0 ? "Skip" : "Back"}
      </button>

      <button
        onClick={next}
        className="rounded-2xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
      >
        {isLast ? "Get Started" : "Next"}
      </button>

    </div>
  );
}
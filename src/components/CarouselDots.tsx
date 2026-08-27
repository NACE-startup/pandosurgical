'use client';

interface CarouselDotsProps {
  count: number;
  selected: number;
  onSelect: (index: number) => void;
  className?: string;
  dotClassName?: string;
  activeDotClassName?: string;
}

export function CarouselDots({
  count,
  selected,
  onSelect,
  className = '',
  dotClassName = 'bg-navy/20',
  activeDotClassName = 'bg-navy',
}: CarouselDotsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={selected === index}
          className={`h-2 rounded-full transition-all duration-300 ${
            selected === index ? `w-6 ${activeDotClassName}` : `w-2 ${dotClassName}`
          }`}
        />
      ))}
    </div>
  );
}

import { animate, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

type Stat = { value: number; label: string };

function CountUp({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  const start = () => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }
    animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
  };
  return (
    <motion.span onViewportEnter={start} viewport={{ once: true }}>
      {displayValue.toLocaleString('en-US')}
    </motion.span>
  );
}

interface Props {
  members: number;
  followers: number;
  eventsHeldThisYear: number;
}

export default function HomeStats({
  members,
  followers,
  eventsHeldThisYear,
}: Props) {
  const stats: Stat[] = [
    { value: members, label: 'Members' },
    { value: followers, label: 'Followers' },
    { value: eventsHeldThisYear, label: 'Events held this year' },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-section-content text-center font-display sm:grid-cols-3"
      aria-label="Club statistics"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 last:col-span-2 last:justify-self-center sm:last:col-span-1 sm:last:justify-self-auto"
        >
          <p className="text-4xl font-bold sm:text-5xl">
            <CountUp value={stat.value} />
          </p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

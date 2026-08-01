import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const metallicTextClassName =
  'bg-[linear-gradient(180deg,var(--metallic-white)_0%,var(--metallic-mid)_22%,var(--metallic-light)_36%,var(--metallic-shadow)_53%,var(--metallic-light)_70%,var(--metallic-cool)_84%,var(--metallic-light)_100%)] bg-clip-text brightness-150 text-transparent [text-shadow:0_1px_0_rgba(255,255,255,0.3),0_3px_5px_rgba(0,0,0,0.45),0_0_8px_rgba(34,211,238,0.38)]';

type MetallicTextProps = HTMLAttributes<HTMLSpanElement>;

export default function MetallicText({
  children,
  className,
  ...props
}: MetallicTextProps) {
  return (
    <span
      {...props}
      className={cn('inline-block', metallicTextClassName, className)}
    >
      {children}
    </span>
  );
}

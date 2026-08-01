import type { Icon, IconProps } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const metallicIconClassName =
  'text-slate-100 [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.65))_drop-shadow(0_3px_3px_rgba(0,0,0,0.55))_drop-shadow(0_0_7px_rgba(34,211,238,0.4))]';

type MetallicIconProps = Omit<IconProps, 'color'> & {
  icon: Icon;
};

export default function MetallicIcon({
  icon: IconComponent,
  className,
  weight = 'duotone',
  'aria-hidden': ariaHidden = true,
  ...props
}: MetallicIconProps) {
  return (
    <IconComponent
      {...props}
      className={cn(metallicIconClassName, className)}
      color="currentColor"
      weight={weight}
      aria-hidden={ariaHidden}
    />
  );
}

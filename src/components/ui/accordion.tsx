import type { ComponentProps, ReactNode } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';

function Accordion({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

type AccordionItemProps = Omit<ComponentProps<'details'>, 'title'> & {
  title: ReactNode;
};

function AccordionItem({
  className,
  children,
  title,
  ...props
}: AccordionItemProps) {
  const summaryClassName = cn(
    // eslint-disable-next-line tailwindcss/no-custom-classname -- `not-prose` is provided by the Tailwind Typography plugin.
    'not-prose relative flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg border border-transparent py-3 text-left text-sm font-medium transition-colors duration-200 outline-none group-open/accordion-item:text-primary marker:content-none hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
  );

  return (
    <details
      data-slot="accordion-item"
      className={cn(
        'group/accordion-item [interpolate-size:allow-keywords] not-last:border-b not-last:border-border details-content:overflow-y-clip details-content:opacity-0 details-content:transition-[block-size,content-visibility,opacity] details-content:transition-discrete details-content:duration-200 details-content:ease-out details-content:block-0 open:details-content:opacity-100 open:details-content:block-auto motion-reduce:details-content:transition-none',
        className,
      )}
      {...props}
    >
      <summary data-slot="accordion-trigger" className={summaryClassName}>
        {title}
        <CaretDownIcon
          aria-hidden="true"
          data-slot="accordion-trigger-icon"
          weight="thin"
          className="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open/accordion-item:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div
        data-slot="accordion-content"
        className="pt-0 pb-3 text-sm *:first:mt-0 *:last:mb-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground"
      >
        {children}
      </div>
    </details>
  );
}

export { Accordion, AccordionItem };

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import {
  useSyncExternalStore,
  type ComponentProps,
  type RefObject,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

const Dialog = BaseDialog.Root;
const DialogTrigger = BaseDialog.Trigger;
const DialogClose = BaseDialog.Close;

type DialogOverlayProps = ComponentProps<typeof BaseDialog.Backdrop>;

function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {
  return (
    <BaseDialog.Backdrop
      ref={ref}
      className={cn('fixed inset-0 z-60 bg-black/80', className)}
      {...props}
    />
  );
}

type DialogContentProps = ComponentProps<typeof BaseDialog.Popup> & {
  portalContainer?: RefObject<HTMLElement | ShadowRoot | null>;
  serverRender?: boolean;
};

const emptySubscribe = () => () => {};
const clientHydratedSnapshot = () => true;
const serverHydratedSnapshot = () => false;

const dialogPopupClassName =
  'fixed top-0 left-0 z-60 flex h-dvh max-h-none w-full max-w-none translate-0 flex-col gap-content overflow-hidden rounded-none border-0 bg-popover text-left text-popover-foreground shadow-2xl sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:-translate-1/2 sm:rounded-2xl sm:border sm:border-border';

function DialogCloseButton() {
  return (
    <BaseDialog.Close
      aria-label="Close dialog"
      className="absolute top-[calc(0.5rem+env(safe-area-inset-top))] right-[calc(0.5rem+env(safe-area-inset-right))] z-10 inline-flex size-12 items-center justify-center rounded-lg border border-transparent bg-background text-sm transition-colors outline-none hover:border-border hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:top-4 sm:right-4"
    >
      <XIcon size={24} aria-hidden="true" />
      <span className="sr-only">Close</span>
    </BaseDialog.Close>
  );
}

function DialogBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-content overflow-y-auto p-card">
      {children}
    </div>
  );
}

function DialogContent({
  className,
  children,
  portalContainer,
  serverRender = false,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...props
}: DialogContentProps) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    clientHydratedSnapshot,
    serverHydratedSnapshot,
  );
  const popupClassName = cn(dialogPopupClassName, className);

  if (serverRender && !hydrated) {
    return (
      <>
        <div className="fixed inset-0 z-60 bg-black/80" data-dialog-overlay />
        <div
          ref={ref}
          className={popupClassName}
          role="dialog"
          aria-modal="true"
          data-dialog-server-shell
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
        >
          <DialogCloseButton />
          <DialogBody>{children}</DialogBody>
        </div>
      </>
    );
  }

  return (
    <BaseDialog.Portal className="contents" container={portalContainer}>
      <DialogOverlay />
      <BaseDialog.Popup
        ref={ref}
        className={popupClassName}
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        <DialogCloseButton />
        <DialogBody>{children}</DialogBody>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />;
}
function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

type DialogTitleProps = ComponentProps<typeof BaseDialog.Title>;

function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      ref={ref}
      className={cn('font-display text-2xl font-bold', className)}
      {...props}
    />
  );
}

type DialogDescriptionProps = ComponentProps<typeof BaseDialog.Description>;

function DialogDescription({
  className,
  ref,
  ...props
}: DialogDescriptionProps) {
  return (
    <BaseDialog.Description
      ref={ref}
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};

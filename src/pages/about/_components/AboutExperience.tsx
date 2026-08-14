import { ArrowUpRightIcon, UserCircleIcon } from '@phosphor-icons/react';
import { useRef } from 'react';
import Button from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialogRouteNavigation } from '@/hooks/useDialogRouteNavigation';

import type { MemberViewModel } from '../_lib/types';

type Props = {
  members: MemberViewModel[];
  initialSelectedId?: string | null | undefined;
};

function AboutContent({ members, initialSelectedId }: Props) {
  const dialogPortalRef = useRef<HTMLDivElement>(null);
  const dialogRoute = useDialogRouteNavigation('/about/');
  const member =
    members.find((person) => person.id === initialSelectedId) ?? null;

  return (
    <>
      <div className="flex flex-col gap-section-content">
        <div className="grid gap-cluster sm:grid-cols-2 sm:gap-content lg:grid-cols-3 xl:grid-cols-4">
          {members.map((person) => (
            <Card
              as="a"
              variant="interactive"
              effect="pixel-shimmer"
              key={person.id}
              href={`/about/${encodeURIComponent(person.id)}/`}
              aria-labelledby={`member-card-title-${person.id}`}
              onClick={(event) => {
                dialogRoute.open(event, event.currentTarget.href);
              }}
              className="flex flex-col text-center"
            >
              <CardHeader className="items-center gap-content pb-2">
                {person.image ? (
                  <img
                    src={person.image.src}
                    alt=""
                    width={person.image.width}
                    height={person.image.height}
                    loading="lazy"
                    decoding="async"
                    className="size-32 rounded-full border-2 border-glass-border object-cover shadow-lg sm:size-36"
                  />
                ) : (
                  <UserCircleIcon
                    size={144}
                    aria-hidden="true"
                    className="text-muted-foreground"
                  />
                )}
                <CardTitle
                  as="h2"
                  id={`member-card-title-${person.id}`}
                  className="transition-colors group-hover:text-primary motion-reduce:transition-none"
                >
                  {person.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 py-2">
                <CardDescription className="text-base">
                  {person.role}
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-2">
                <span className="flex items-center gap-1 text-sm font-semibold tracking-wide text-primary uppercase">
                  View profile
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button
            href="https://separated-whippet-2da.notion.site/MISC-SubCommittee-Recruitment-2026-1ac15a08aef280b29ab9fb5761ca19fa?pvs=74"
            target="_blank"
            rel="noreferrer"
            size="lg"
            variant="matrix"
          >
            Join the committee
          </Button>
        </div>
      </div>
      <div ref={dialogPortalRef} className="contents" />
      <Dialog
        modal="trap-focus"
        open={member !== null}
        onOpenChange={(open) => {
          if (!open) dialogRoute.close();
        }}
      >
        {member && (
          <DialogContent
            aria-labelledby="profile-title"
            className="flex flex-col items-center gap-content text-center sm:max-w-lg"
            portalContainer={dialogPortalRef}
            serverRender={initialSelectedId != null}
          >
            {member.image ? (
              <img
                src={member.image.src}
                alt=""
                width={member.image.width}
                height={member.image.height}
                decoding="async"
                className="mx-auto size-32 rounded-full border-2 border-glass-border object-cover shadow-lg sm:size-36"
              />
            ) : (
              <UserCircleIcon
                size={144}
                aria-hidden="true"
                className="mx-auto text-muted-foreground"
              />
            )}
            <div className="flex flex-col items-center gap-2">
              <DialogTitle id="profile-title">{member.name}</DialogTitle>
              <p className="text-primary">{member.role}</p>
            </div>
            <DialogDescription className="text-left leading-7">
              {member.bio}
            </DialogDescription>
            {member.linkedin && (
              <Button
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                size="lg"
                variant="matrix"
              >
                Connect on LinkedIn
              </Button>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export default function AboutExperience(props: Props) {
  return <AboutContent {...props} />;
}

import { useState, type SyntheticEvent } from 'react';
import {
  ArrowCounterClockwiseIcon,
  CheckIcon,
  InfoIcon,
  StarIcon,
  TrophyIcon,
} from '@phosphor-icons/react';
import { z } from 'zod';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { bingoConfig, bingoPrompts, bingoStorageKey } from '../_lib/config';

const storedStateSchema = z.object({
  board: z.array(z.object({ prompt: z.string() })),
  names: z.record(z.string(), z.string()),
  bingoCelebrated: z.boolean(),
});

type BingoState = z.infer<typeof storedStateSchema>;
type BingoSquareData = BingoState['board'][number];

const requiredPromptCount = bingoConfig.boardSize * bingoConfig.boardSize;

function shufflePrompts(prompts: string[]) {
  const shuffled = [...prompts];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentPrompt = shuffled[index];
    const swapPrompt = shuffled[swapIndex];
    if (currentPrompt === undefined || swapPrompt === undefined) continue;

    shuffled[index] = swapPrompt;
    shuffled[swapIndex] = currentPrompt;
  }

  return shuffled;
}

function createBoard(): BingoState {
  if (bingoPrompts.length < requiredPromptCount) {
    throw new Error(
      `People Bingo requires at least ${requiredPromptCount} prompts.`,
    );
  }

  const prompts = bingoConfig.randomizeBoard
    ? shufflePrompts(bingoPrompts).slice(0, requiredPromptCount)
    : bingoPrompts.slice(0, requiredPromptCount);

  return {
    board: prompts.map((prompt) => ({ prompt })),
    names: {},
    bingoCelebrated: false,
  };
}

function persistProgress(state: BingoState) {
  try {
    localStorage.setItem(bingoStorageKey, JSON.stringify(state));
  } catch {
    // The game remains usable when storage is disabled; progress simply will
    // not survive a refresh.
  }
}

function createFreshProgress() {
  const state = createBoard();
  persistProgress(state);
  return state;
}

function loadProgress() {
  try {
    const storedProgress = localStorage.getItem(bingoStorageKey);
    if (!storedProgress) return createFreshProgress();

    const result = storedStateSchema.safeParse(JSON.parse(storedProgress));
    if (!result.success || result.data.board.length !== requiredPromptCount) {
      return createFreshProgress();
    }

    return result.data;
  } catch {
    return createFreshProgress();
  }
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function lowercaseFirst(text: string) {
  return text.charAt(0).toLocaleLowerCase() + text.slice(1);
}

function isBoardComplete(state: BingoState) {
  return state.board.every((_, index) => Boolean(state.names[String(index)]));
}

type BingoSquareProps = {
  index: number;
  name: string | undefined;
  square: BingoSquareData;
  winning: boolean;
  onOpen: (index: number) => void;
};

function BingoSquare({
  index,
  name,
  square,
  winning,
  onOpen,
}: BingoSquareProps) {
  const completed = Boolean(name);
  const label = completed
    ? `${square.prompt}. Completed with ${name}. Tap to edit.`
    : `${square.prompt}. Tap to add a name.`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onOpen(index)}
      className={cn(
        'relative flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-1 text-center shadow-sm transition-[border-color,background-color,box-shadow] outline-none hover:border-primary/60 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:p-2',
        completed &&
          'border-primary bg-primary text-primary-foreground shadow-lg hover:bg-primary hover:brightness-110',
        winning && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      )}
    >
      {completed && (
        <CheckIcon
          weight="bold"
          aria-hidden="true"
          className="absolute top-1 right-1 size-3 sm:top-2 sm:right-2 sm:size-4"
        />
      )}
      <span
        className={cn(
          'line-clamp-4 w-full min-w-0 text-[0.48rem] leading-tight font-bold hyphens-auto sm:text-xs lg:text-sm',
          completed && 'text-[0.44rem] opacity-80 sm:text-xs',
        )}
      >
        {square.prompt}
      </span>
      {name && (
        <span className="line-clamp-2 w-full min-w-0 text-[0.62rem] leading-tight font-black hyphens-auto sm:text-sm">
          {name}
        </span>
      )}
    </button>
  );
}

export default function BingoExperience() {
  const [state, setState] = useState(loadProgress);
  const [activeSquareIndex, setActiveSquareIndex] = useState<number | null>(
    null,
  );
  const [personName, setPersonName] = useState('');
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  const boardComplete = isBoardComplete(state);
  const activeSquare =
    activeSquareIndex === null ? undefined : state.board[activeSquareIndex];
  const existingName =
    activeSquareIndex === null
      ? undefined
      : state.names[String(activeSquareIndex)];

  function openSquare(index: number) {
    const square = state.board[index];
    if (!square) return;

    setActiveSquareIndex(index);
    setPersonName(state.names[String(index)] ?? '');
    setFormMessage(null);
  }

  function closeSquare() {
    setActiveSquareIndex(null);
    setPersonName('');
    setFormMessage(null);
  }

  function isDuplicateName(name: string, currentIndex: number) {
    const normalizedName = normalizeName(name);
    return Object.entries(state.names).some(
      ([index, existing]) =>
        Number(index) !== currentIndex &&
        normalizeName(existing) === normalizedName,
    );
  }

  function saveName(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeSquareIndex === null) return;

    const trimmedName = personName.trim();
    if (!trimmedName) {
      setFormMessage('Enter a name before saving.');
      return;
    }

    if (
      bingoConfig.preventDuplicateNames &&
      isDuplicateName(trimmedName, activeSquareIndex)
    ) {
      setFormMessage(
        "You've already used this person for another square. Meet someone new!",
      );
      return;
    }

    const names = {
      ...state.names,
      [String(activeSquareIndex)]: trimmedName,
    };
    const completed = state.board.every((_, index) =>
      Boolean(names[String(index)]),
    );
    const shouldCelebrate = completed && !state.bingoCelebrated;
    const nextState = {
      ...state,
      names,
      bingoCelebrated: state.bingoCelebrated || completed,
    };

    persistProgress(nextState);
    setState(nextState);
    closeSquare();
    if (shouldCelebrate) setCelebrationOpen(true);
  }

  function removeName() {
    if (activeSquareIndex === null) return;

    const names = { ...state.names };
    delete names[String(activeSquareIndex)];
    const nextState = { ...state, names, bingoCelebrated: false };

    persistProgress(nextState);
    setState(nextState);
    closeSquare();
  }

  function resetBoard() {
    const confirmed = window.confirm(
      'Reset your People Bingo board? This will delete all saved progress.',
    );
    if (!confirmed) return;

    const nextState = createBoard();
    persistProgress(nextState);
    setState(nextState);
    closeSquare();
    setCelebrationOpen(false);
    setInstructionsOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-section-content">
        <section
          aria-label="Board status and controls"
          className="flex flex-wrap items-center justify-between gap-content"
        >
          <div
            className={cn(
              'flex min-h-11 items-center gap-cluster font-semibold text-muted-foreground',
              boardComplete && 'text-primary',
            )}
          >
            <StarIcon
              weight={boardComplete ? 'fill' : 'regular'}
              aria-hidden="true"
              className="size-7"
            />
            <span>
              {boardComplete ? 'Board complete' : 'Board in progress'}
            </span>
          </div>
          <div className="flex flex-wrap gap-cluster">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInstructionsOpen(true)}
            >
              <InfoIcon className="size-5" aria-hidden="true" />
              Instructions
            </Button>
            <Button variant="ghost" size="sm" onClick={resetBoard}>
              <ArrowCounterClockwiseIcon
                className="size-5"
                aria-hidden="true"
              />
              Reset board
            </Button>
          </div>
        </section>

        <section aria-label="People Bingo board">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {state.board.map((square, index) => (
              <BingoSquare
                key={`${index}-${square.prompt}`}
                index={index}
                square={square}
                name={state.names[String(index)]}
                winning={boardComplete}
                onOpen={openSquare}
              />
            ))}
          </div>
        </section>
      </div>

      <Dialog
        modal="trap-focus"
        open={instructionsOpen}
        onOpenChange={setInstructionsOpen}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>How to play</DialogTitle>
            <DialogDescription>
              Meet people, find matches, and complete every square.
            </DialogDescription>
          </DialogHeader>
          <ol className="flex list-decimal flex-col gap-cluster pl-5 text-sm leading-6">
            <li>Tap a square and find someone who matches the prompt.</li>
            <li>Enter that person&apos;s name and save it.</li>
            <li>Use a different person for each square.</li>
            <li>
              Complete every square, then show your screen to an organizer.
            </li>
          </ol>
          <DialogFooter>
            <Button onClick={() => setInstructionsOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        modal="trap-focus"
        open={activeSquare !== undefined}
        onOpenChange={(open) => {
          if (!open) closeSquare();
        }}
      >
        {activeSquare && (
          <DialogContent className="sm:max-w-xl">
            <form onSubmit={saveName} className="flex flex-col gap-content">
              <DialogHeader>
                <DialogTitle>
                  Find someone who {lowercaseFirst(activeSquare.prompt)}
                </DialogTitle>
                <DialogDescription>Who did you find?</DialogDescription>
              </DialogHeader>
              <Field invalid={formMessage !== null}>
                <FieldLabel>Person&apos;s name</FieldLabel>
                <Input
                  autoFocus
                  autoComplete="name"
                  maxLength={80}
                  value={personName}
                  placeholder="Enter their name"
                  onChange={(event) => {
                    setPersonName(event.target.value);
                    setFormMessage(null);
                  }}
                />
                <FieldError match={formMessage !== null}>
                  {formMessage}
                </FieldError>
              </Field>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={closeSquare}
                >
                  Cancel
                </Button>
                {existingName && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={removeName}
                  >
                    Remove
                  </Button>
                )}
                <Button type="submit" className="w-full sm:w-auto">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        modal="trap-focus"
        open={celebrationOpen}
        onOpenChange={setCelebrationOpen}
      >
        <DialogContent className="items-center text-center sm:max-w-lg">
          <TrophyIcon
            weight="duotone"
            className="size-16 text-primary"
            aria-hidden="true"
          />
          <DialogHeader className="items-center">
            <DialogTitle>Board complete!</DialogTitle>
            <DialogDescription>
              Show this screen to an event organizer to claim your win.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setCelebrationOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

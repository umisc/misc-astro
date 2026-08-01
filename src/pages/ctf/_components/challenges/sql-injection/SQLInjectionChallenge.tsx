import { useRef, useState, type SyntheticEvent } from 'react';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

import { burstConfetti } from './confetti';

export default function SQLInjectionChallenge() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const celebrated = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const bypassed =
      /\w+'\s*(--|#|\/\*)/.test(username) ||
      /\w+'\s*or\s+['"]?1['"]?\s*=\s*['"]?1/i.test(username) ||
      /'\s*or\s+.+=.+/i.test(username);
    setResult(bypassed ? 'success' : 'fail');
    if (!bypassed || celebrated.current || reducedMotion) return;
    celebrated.current = true;
    const rect = root.current?.getBoundingClientRect();
    burstConfetti({
      particleCount: 150,
      spread: 80,
      origin: {
        x: rect ? rect.left + rect.width / 2 : innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : innerHeight * 0.6,
      },
      colors: ['#4caf50', '#ffffff', '#00e676'],
    });
  }

  return (
    <div ref={root}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Simple Login Bypass</CardTitle>
          <CardDescription>
            A login form vulnerable to SQL injection. Try logging in as admin
            without knowing the password by injecting into the username field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-content" onSubmit={submit}>
            <code className="overflow-x-auto rounded-lg border border-border bg-background/40 p-content text-xs">
              SELECT * FROM users WHERE username = &apos;{username || '...'}
              &apos; AND password = &apos;{password || '...'}&apos;;
            </code>
            <label className="grid gap-2 text-sm font-medium">
              Username
              <Input
                value={username}
                autoComplete="username"
                onChange={(event) => {
                  setUsername(event.target.value);
                  setResult(null);
                }}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <Input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setResult(null);
                }}
              />
            </label>
            <div className="flex flex-wrap gap-cluster">
              <Button type="submit">Login</Button>
              <Button
                type="button"
                variant="ghost"
                aria-expanded={showHint}
                aria-controls="sqli-hint"
                onClick={() => setShowHint((value) => !value)}
              >
                {showHint ? 'Hide Hint' : 'Hint'}
              </Button>
            </div>
            {showHint && (
              <p
                id="sqli-hint"
                className="text-sm text-muted-foreground italic"
              >
                Try putting a single quote in the username field. What happens
                to the SQL query?
              </p>
            )}
            <div aria-live="polite">
              {result === 'success' && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-content text-emerald-300">
                  <strong>Access granted!</strong>
                  <code className="block">
                    flag{'{'}sqli_bypass_success{'}'}
                  </code>
                </div>
              )}
              {result === 'fail' && (
                <p className="text-destructive">
                  Invalid username or password.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

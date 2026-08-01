import { useState, type ReactNode } from 'react';
import { ArrowRightIcon, GearIcon } from '@phosphor-icons/react';
import { SectionTitle } from '@/components/typography/Typography';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function ShowcaseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-section-content" aria-labelledby={id}>
      <SectionTitle id={id}>{title}</SectionTitle>
      {children}
    </section>
  );
}

const colors = [
  ['Canvas', 'bg-canvas'],
  ['Background', 'bg-background'],
  ['Card', 'bg-card'],
  ['Muted', 'bg-muted'],
  ['Primary', 'bg-primary'],
  ['Destructive', 'bg-destructive'],
  ['Aurora teal', 'bg-aurora-teal'],
  ['Aurora blue', 'bg-aurora-blue'],
  ['Aurora violet', 'bg-aurora-violet'],
] as const;

const spaces = [
  ['3xs', 'w-fluid-3xs', '0.25–0.3125rem'],
  ['2xs', 'w-fluid-2xs', '0.5–0.625rem'],
  ['xs / cluster', 'w-fluid-xs', '0.75–0.9375rem'],
  ['s / content', 'w-fluid-s', '1–1.25rem'],
  ['m', 'w-fluid-m', '1.5–1.875rem'],
  ['l / section content', 'w-fluid-l', '2–2.5rem'],
  ['xl', 'w-fluid-xl', '3–3.75rem'],
  ['2xl / page section', 'w-fluid-2xl', '4–5rem'],
  ['3xl / section', 'w-fluid-3xl', '5–6.25rem'],
  ['s–l', 'w-fluid-s-l', '1–2.5rem'],
  ['xs–2xl / page inline', 'w-fluid-xs-2xl', '0.75–5rem'],
  ['m–2xl', 'w-fluid-m-2xl', '1.5–5rem'],
  ['l–xl / page block', 'w-fluid-l-xl', '2–3.75rem'],
] as const;

export default function DesignSystemExperience() {
  const [invalidValue, setInvalidValue] = useState('');
  const [touched, setTouched] = useState(false);
  const invalid = touched && invalidValue.trim() === '';

  return (
    <div className="flex flex-col gap-section">
      <ShowcaseSection id="foundations-title" title="Foundations">
        <div className="flex flex-col gap-content">
          <div className="grid gap-cluster sm:grid-cols-3 lg:grid-cols-5">
            {colors.map(([label, color]) => (
              <div
                key={label}
                className="flex items-center gap-cluster text-sm"
              >
                <span
                  className={`size-10 rounded-lg border border-border ${color}`}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-content md:grid-cols-2">
            <Card density="compact">
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Poppins body, Orbitron display.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-cluster">
                <p className="font-display text-3xl font-bold">
                  Display heading
                </p>
                <p className="text-base">
                  Body text for readable interface copy.
                </p>
                <p className="text-sm text-muted-foreground">
                  Muted supporting text
                </p>
              </CardContent>
            </Card>
            <Card density="compact">
              <CardHeader>
                <CardTitle>Radii</CardTitle>
                <CardDescription>Semantic surface curvature.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-end gap-cluster">
                {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-2xl'].map(
                  (radius) => (
                    <span
                      key={radius}
                      className={`grid size-20 place-items-center border border-primary bg-primary/10 text-xs ${radius}`}
                    >
                      {radius.replace('rounded-', '')}
                    </span>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-cluster">
            <h3 className="font-display text-lg font-bold">Fluid spacing</h3>
            <p className="text-sm text-muted-foreground">
              The scale interpolates from 320px to 1280px. Controls and icon
              touch targets remain fixed.
            </p>
            {spaces.map(([label, width, range]) => (
              <div
                key={label}
                className="grid grid-cols-[9rem_1fr] items-center gap-cluster text-xs"
              >
                <span>{label}</span>
                <span className="flex items-center gap-cluster">
                  <span
                    className={`block h-3 rounded-full bg-primary ${width}`}
                  />
                  <code className="text-muted-foreground">{range}</code>
                </span>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="controls-title" title="Controls">
        <div className="flex flex-col gap-content">
          <div className="flex flex-wrap items-center gap-cluster">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="link">Learn more</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button size="icon" variant="outline" aria-label="Settings">
              <GearIcon className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-cluster">
            <Button variant="matrix">
              Secure access
              <ArrowRightIcon
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Button>
            <Button variant="matrix" loading>
              Authenticating
            </Button>
            <Button variant="matrix" disabled>
              Access denied
            </Button>
            <Button variant="matrix" href="#controls-title">
              Matrix link
              <ArrowRightIcon
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Button>
          </div>
          <div className="flex flex-wrap gap-cluster">
            <Badge>Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <div className="flex flex-wrap items-end gap-cluster">
            {(['sm', 'default', 'lg'] as const).map((size) => (
              <label key={size} className="grid gap-2 text-sm">
                Select {size}
                <NativeSelect size={size} defaultValue="one">
                  <NativeSelectOption value="one">
                    Option one
                  </NativeSelectOption>
                  <NativeSelectOption value="two">
                    Option two
                  </NativeSelectOption>
                </NativeSelect>
              </label>
            ))}
            <NativeSelect disabled aria-label="Disabled select">
              <NativeSelectOption>Disabled</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="forms-title" title="Forms">
        <FieldGroup className="max-w-xl">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
            <FieldDescription>
              Label and description IDs are coordinated by Base UI.
            </FieldDescription>
          </Field>
          <Field invalid={invalid}>
            <FieldLabel>Required value</FieldLabel>
            <Input
              required
              value={invalidValue}
              onChange={(event) => setInvalidValue(event.target.value)}
              onBlur={() => setTouched(true)}
            />
            <FieldError match={invalid}>Please enter a value.</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="showcase-native-invalid">
              Native select error
            </FieldLabel>
            <NativeSelect
              id="showcase-native-invalid"
              aria-invalid="true"
              aria-describedby="showcase-native-error"
              className="w-full"
            >
              <NativeSelectOption value="">Choose an option</NativeSelectOption>
            </NativeSelect>
            <FieldError id="showcase-native-error" match>
              Choose an available option. Native controls explicitly reference
              this ID.
            </FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>Disabled field</FieldLabel>
            <Input value="Unavailable" readOnly />
          </Field>
        </FieldGroup>
      </ShowcaseSection>

      <ShowcaseSection id="surfaces-title" title="Surfaces">
        <div className="grid gap-content md:grid-cols-3">
          {(['compact', 'default', 'spacious'] as const).map((density) => (
            <Card
              key={density}
              density={density}
              variant={density === 'default' ? 'glass' : 'default'}
            >
              <CardHeader>
                <CardTitle className="capitalize">{density}</CardTitle>
                <CardDescription>
                  Card slots inherit the {density} density.
                </CardDescription>
              </CardHeader>
              <CardContent>Density owns the shared interior inset.</CardContent>
            </Card>
          ))}
          <Card
            as="a"
            href="#surfaces-title"
            variant="interactive"
            density="compact"
          >
            <CardHeader>
              <CardTitle>Interactive</CardTitle>
              <CardDescription>
                Keyboard-focusable linked surface.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            as="a"
            href="#surfaces-title"
            variant="interactive"
            density="compact"
            effect="pixel-shimmer"
          >
            <CardHeader>
              <CardTitle>Pixel shimmer</CardTitle>
              <CardDescription>
                Shimmers on hover, focus, or touch visibility and bursts on
                activation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="navigation-title" title="Navigation">
        <div className="grid gap-section-content lg:grid-cols-2">
          <Tabs defaultValue="first">
            <TabsList>
              <TabsTrigger value="first">Default</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
              <TabsTrigger value="disabled" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="text-muted-foreground">
              Default contained tabs.
            </TabsContent>
            <TabsContent value="second">Second panel.</TabsContent>
          </Tabs>
          <Tabs defaultValue="first">
            <TabsList variant="line">
              <TabsTrigger value="first">Line</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="text-muted-foreground">
              Horizontal active indicator.
            </TabsContent>
            <TabsContent value="second">Second panel.</TabsContent>
          </Tabs>
          <Tabs
            defaultValue="first"
            orientation="vertical"
            className="flex-row"
          >
            <TabsList variant="line">
              <TabsTrigger value="first">Vertical</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="text-muted-foreground">
              Vertical active indicator.
            </TabsContent>
            <TabsContent value="second">Second panel.</TabsContent>
          </Tabs>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="overlays-title" title="Overlays">
        <div className="flex flex-col items-start gap-cluster">
          <p className="max-w-2xl text-sm text-muted-foreground">
            The dialog is full-screen at narrow widths and constrained at larger
            widths. Its title, description, close control, focus trap, and
            actions form one contract.
          </p>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Responsive dialog</DialogTitle>
                <DialogDescription>
                  Resize the viewport and keyboard-test the focus boundary.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Motion-reduce utilities disable nonessential transitions and
                animation across primitives.
              </p>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ShowcaseSection>
    </div>
  );
}

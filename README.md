# MISC website

## Getting Started

### Prerequisities

- Node.js 20+
- pnpm

### First-time Setup

**1. Clone the repository and its content submodule:**

```sh
git clone --recurse-submodules https://github.com/umisc/misc-astro.git
```

**2. Navigate to the directory:**

```sh
cd misc-astro
```

**3. Run pnpm install:**

```sh
pnpm install
```

**4. Run pnpm dev to spin up your local development server:**

```sh
pnpm dev
```

### Making Changes

> If you forgot to `--recurse-submodules` when cloning, run these two commands:
  > ```sh
  > git submodule sync --recursive
  > git submodule update --init --recursive
  > ```

**To pull changes, run:**

```sh
git pull --recurse-submodules
git submodule update --init --recursive
```

#### Root Repository
To make changes to the root repository, the standard add, commit, push flow applies.

> Make sure you are in the root directory.

```sh
git add .
git commit -m "feat: write a descriptive message of what you added"
git push
```

> Note: If you are on a branch (which you should be) which is not already on the remote repository, you may have to do `git push -u origin feat/name-of-branch`.

#### Content Submodule

**1. To make changes to the content submodule, first navigate there:**

```sh
cd content
```

**2. Add your changes, commit, and push:**

```sh
git add -A
git commit -m "feat: write a descriptive message of what you added"
git push
```

> If `git push` does not work, you may have to do `git push origin HEAD:main` instead.

**3. Then, you must bump the submodule commit hash in the root repo:**

```sh
cd ..
git add content
git commit -m "chore: bump content"
git push
```

## Using Astro

Read the [Astro docs](https://docs.astro.build/en/getting-started/).

## Repository Rules

- `useEffect` and `useLayoutEffect` are banned in component files apart from in circumstances where you cannot refactor into a reusable hook that could conceivably be used by another component.
- `pnpm check` must pass before comitting. Try `pnpm fix` to fix some issues raised by `pnpm check`.
- Use Tailwind. Never create custom classes, ad-hoc css files, or inline stylesheets. Inline styles are acceptable in rare cases involving complex animation or maniupulation.
- Extensions to the tailwind theme need to be treated with great care. Clarify your intent and consider separately.
- For more complicated animations, use [motion](https://motion.dev/docs). Do not change animation libraries without refactoring all existing code to use them.
- Follow the design system. Avoid creating ad-hoc colours, spacing, border-radius, text sizes, buttons, and components that duplicate what already exists.
- Where new styles or designs are required, _this must be treated separately as a change to the design system_ rather than an ad-hoc addition. This is an expansion of scope—intent must be clarified and treated with care. You can view the design system at `/design-system`.
- When you create new components, always check if an existing official [shadcn](https://ui.shadcn.com/) component already exists. Please add these using the CLI (not copying the code!) and customise to suit the design system when they are available.
- Do not add icon packs or custom icons when the icon is available in [phosphor icons](https://phosphoricons.com/).
- Content that should not be publicly accessible indefinitely must live in the content submodule. This repository is public, even deleted information and files will remain accessible.
- Use Typescript. Do not make Typescript any less strict. Use of `any` is banned. Use of `as`, `!`, and `unknown` must be heavily restricted and commented, explaining why you know more than the Typescript compiler. Where you need typed access to external data, it should be either:
  - Come typed through an SDK.
  - Be an [Astro content collection](https://docs.astro.build/en/guides/content-collections/).
  - Validated at runtime using [Zod](https://zod.dev/).

## Contribution Workflow

1. Create or choose an issue for the work.
2. Create a branch from the latest `main`. Use `<type>/<issue-number>-<short-description>`, for example `feat/123-name-of-branch` or `fix/456-name-of-branch`.
3. Make and test your changes. Run `pnpm check` before committing.
4. Write commits using [Conventional Commits](https://www.conventionalcommits.org/): `<type>(optional-scope): <description>`, for example `feat: add ctf guide`. Common types include `feat`, `fix`, `docs`, `refactor`, `test`, and `chore`.
5. Push your branch and open a pull request into `main`.
6. Link the pull request to its issue using `Closes #123`, describe the changes and testing, then request review.

`main` is protected: do not commit or push directly to it. All changes must be made on a branch and merged through a pull request.

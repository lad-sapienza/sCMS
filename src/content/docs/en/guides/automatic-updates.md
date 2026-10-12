---
title: Automatic Updates
description: Let GitHub keep your site's dependencies up to date, safely, with no manual work
order: 7
---

This guide explains, in plain words, how to make your s:CMS site **keep itself up to date**: new versions of `@lad-sapienza/scms-core` (and of the other packages your site uses) arrive on their own, are tested automatically, and go live without you touching anything — as long as they are safe.

It assumes your site is on GitHub and published with GitHub Pages, like the sites created by `scms-create`.

## How it works, in one minute

Your site is built on top of packages written by other people. Those packages get new versions all the time: bug fixes, security fixes, new features. Keeping up by hand means remembering to check, running `npm update`, testing, committing, pushing.

GitHub can do the boring part for you. A built-in tool called **Dependabot** looks at your `package.json` once a week and, for every package that has a new version, it **opens a pull request** — a proposed change, with the new version already written in. Then:

1. **GitHub builds your site** with the proposed change, exactly as it would for a real deploy, but *without publishing it*.
2. **If the build passes**, and the change is a small one (a *patch*, see below), GitHub merges it by itself. Your normal deploy then publishes the new version.
3. **If the build fails**, or the change is bigger, nothing is merged. The pull request just waits for you, with a red cross, and your live site stays exactly as it was.

So the worst that can happen is a pull request sitting there, waiting. The live site only changes when a build has passed.

### Which updates are merged automatically?

Versions look like `0.2.1`: *major.minor.patch*.

| Kind | Example | What happens |
|---|---|---|
| **Patch** | `0.2.0` → `0.2.1` | Bug fixes only. Merged automatically once the build passes. |
| **Minor** | `0.2.0` → `0.3.0` | New features. **Waits for you.** Before `1.0`, a minor can contain breaking changes, so it is never automatic. |
| **Major** | `7.x` → `8.x` | Breaking changes by definition. **Waits for you**, in its own pull request. |

Related packages are grouped into a single pull request so you don't get a dozen of them: one for `@lad-sapienza/*`, one for all the other minor and patch updates, and one for each major.

### What this does *not* check

A passing build means the site **compiles**. It does not mean it **looks right**: a map that stops loading, or a table that shows no rows, can still pass a build. After an automatic deploy, glance at a page or two of your live site now and then — especially the ones with maps and tables.

## Sites created with `scms-create`

Sites created with `scms-core` **0.2.0 or later** already contain everything described below. You only need the [GitHub settings](#2-github-settings) (step 2), which can't be stored in the repository.

For a site created earlier, follow the steps below.

## 1. Add three files to your repository

### `.github/dependabot.yml`

Tells GitHub what to check, and how often.

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
      # s:CMS core on its own, so a new release gets its own PR
      scms:
        patterns:
          - "@lad-sapienza/*"
      # Everything else, minor and patch together; majors arrive as separate PRs
      minor-and-patch:
        update-types:
          - minor
          - patch
    ignore:
      # @astrojs/check peers typescript ^5 || ^6: v7 fails npm ci with ERESOLVE
      - dependency-name: typescript
        update-types:
          - version-update:semver-major

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
```

The second block (`github-actions`) keeps the deploy workflow's own building blocks (`actions/checkout`, …) up to date, once a month.

### `.github/workflows/deploy.yml` — build on pull requests

Your site already has this file. Make it **also build on pull requests**, without publishing. Three small changes, marked below:

```yaml
on:
  push:
    branches:
      - main            # use your default branch name (main or master)
  pull_request:         # (1) also run on pull requests
    branches:
      - main
  workflow_dispatch:

concurrency:
  # (2) a PR build must never cancel a deploy running on main
  group: ${{ github.event_name == 'pull_request' && format('pr-{0}', github.ref) || 'pages' }}
  cancel-in-progress: true

jobs:
  build:
    # ... checkout, setup-node, npm ci, npm run build as before ...
      - name: Upload Pages artifact
        if: github.event_name != 'pull_request'     # (3) don't publish on PRs
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist/

  deploy:
    needs: build
    if: github.event_name != 'pull_request'         # (3) don't publish on PRs
    # ... as before ...
```

> Check the name of your default branch (`main` or `master`) in your repository's *Settings → Branches* and use it everywhere above.

### `.github/workflows/dependabot-automerge.yml` — merge the safe ones

This is the file that turns on automatic merging, **for patches only**:

```yaml
name: Dependabot auto-merge (patch only)

on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  automerge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - name: Read Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      # Grouped PRs: merge only if EVERY updated dependency is a patch.
      # The merge itself waits for the required `build` check.
      - name: Enable auto-merge for patch-only updates
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          UPDATES: ${{ steps.metadata.outputs.updated-dependencies-json }}
        run: |
          if echo "$UPDATES" | jq -e 'length > 0 and all(.[]; .updateType == "version-update:semver-patch")' > /dev/null; then
            gh pr merge --auto --squash "$PR_URL"
          else
            echo "Not patch-only, leaving for manual review."
          fi
```

If you only want pull requests and prefer to press "merge" yourself every time, **skip this file**. Everything else still works.

## 2. GitHub settings

These are switches on GitHub's website; they can't be part of the repository. Do them **before** adding the automerge file, otherwise it would merge without waiting for the build.

On your repository page:

1. **Settings → General → Pull Requests**: tick **Allow auto-merge**.
2. **Settings → Branches → Add branch protection rule** (or *Add classic branch protection rule*):
   - **Branch name pattern**: your default branch (`main` or `master`).
   - Tick **Require status checks to pass before merging**, then search for **`build`** and select it. (The name comes from the `build` job in `deploy.yml`. If it isn't listed yet, it appears after the first pull request has built.)
   - Tick **Require branches to be up to date before merging**. This makes GitHub re-test a pull request on top of the latest version of the site before merging it, so two updates can't conflict with each other.
   - Leave the other boxes — *Require a pull request*, *Require approvals*, *Do not allow bypassing* — **unticked**. That way you can still push to your branch yourself.
3. Press **Create**.

## 3. If your build needs secrets

Some sites read data at build time from a service that needs a key — for instance a `BDUS_API_KEY` for BraDypUS, or `PUBLIC_DIRECTUS_URL` / `PUBLIC_DIRECTUS_TOKEN` for Directus — stored in **Settings → Secrets and variables → Actions**.

GitHub deliberately does **not** give those secrets to builds started by Dependabot. The pull request build will fail with a "key is not set" error. The fix is to store **the same secret a second time** in the separate **Dependabot** section:

**Settings → Secrets and variables → Dependabot → New repository secret**, with the same name and value.

Use read-only keys: a build never needs to write.

If your site fetches a lot of data or images at build time, remember that every pull request runs that fetch too.

## What you'll see day to day

- **A new pull request** appears in the repository's *Pull requests* tab, titled like `chore(deps): bump actions/checkout from 4 to 7`. A green tick next to it means the build passed.
- **Patches** merge themselves a few minutes after the build is green. You don't have to do anything.
- **Everything else** waits. When you have a minute: open the pull request, read what it changes (Dependabot includes the release notes), check the build is green, and press **Merge pull request**.
- If a pull request is **behind** (another one was merged first), comment `@dependabot rebase` on it. Dependabot updates it and the build runs again.
- If a build is **red**, open the *Checks* tab and read the log. Often the update is fine and the failure is something else (a service that was down, a secret that is missing). Re-run the check, or close the pull request: Dependabot won't re-open it for the same version.

### Updates that need a little more than a merge

Some pull requests change how your site must be set up. Always read the pull request description for the ones that move a **minor** version of `@lad-sapienza/scms-core` while it is still at `0.x`: the [Updating](updating.md) guide lists the migration notes for each release.

## Turning it off

Delete `.github/dependabot.yml` to stop new pull requests, and `.github/workflows/dependabot-automerge.yml` to stop automatic merging. Nothing else needs to change.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a flat collection of small, independent NodeJS scripts and experiments — not a single application. There is no root `package.json`, workspace config, or shared build/lint/test tooling. Each top-level directory is a standalone project with its own `package.json` and lockfile, and must be installed/run from within that directory.

Directories:

- **`api/`** — one-shot script that fetches a random joke from icanhazdadjoke.com via `got` and logs it (`api/index.js`).
- **`codetrain/`** — one-shot script using `cowsay` to generate ASCII art and write it to `codetrain/words.txt`.
- **`mastodon_bot/`** — several independent, unconnected scripts (not a single entry point) that post to a Mastodon instance via the `masto` REST client:
  - `index.js` — posts a static "Hello from #mastojs!" status.
  - `dadjoke.js` — fetches a joke from icanhazdadjoke.com and toots it with `#dadjoke`.
  - `image.js` — uploads `some_image.jpg` as media and posts it.
  - `files.js` — recursively scans `./images` for `.png` files, posts each as media, then moves the file into `./images_uploaded`.
  - Each script hardcodes its own Mastodon instance URL and reads the access token from `process.env.TOKEN`. Run a specific script directly, e.g. `node dadjoke.js` — there is no dispatcher.
- **`node-p5/`** — uses `node-p5` (a Node port of p5.js) to draw to an off-screen canvas and save it as `myCanvas.png`. **Known accepted risk:** the `node-p5` package is abandoned upstream (last published years ago, stuck at v1.0.4) and pins ancient transitive deps (`axios ^0.21.1`, `jsdom ^15`, `canvas ^2.5` → old `tar`/`@mapbox/node-pre-gyp`, plus the fully-deprecated `request`/`request-promise-native` stack). This produces dozens of open Dependabot alerts, several critical, that `npm audit fix --force` cannot resolve — there is no newer `node-p5` release and `request` has no patched version at all. Remediation would require dropping/replacing `node-p5`, not patching it; until that happens the risk is accepted since this is a local, non-network-facing canvas experiment. Its `package-lock.json` is intentionally gitignored (not tracked) so the dependency graph can't re-raise alerts on it — regenerate it locally with `npm install` before running the script, but don't commit it.
- **`rss/`** — the most complete project here; reads an RSS feed and posts new entries to Mastodon (see below).

## The `rss` project

Reads `rss/settings.json` for a feed URL, a Mastodon instance URL, and the date of the last post made. On each run it fetches the feed, posts any entries newer than `last_post` (up to `previous` entries back) to Mastodon truncated to 450 chars, then rewrites `settings.json` with the newest `last_post` date so subsequent runs are incremental.

- It has a `.eslintrc.json` (old-style flat rules, `eslint:recommended`) and `eslint`/`prettier` devDependencies, but no `lint` npm script — run directly with `npx eslint index.js` from within `rss/`.
- It is designed to run inside its Docker image, not directly with `node index.js` on the host: the code reads config from `/mnt/settings.json` (a bind mount) but writes results back to `./settings.json` (relative to the container's `WORKDIR`), so those are two different paths by design.
- Build/run:
  ```
  cd rss
  docker build -t my-nodejs-app .
  docker run -e TOKEN=<mastodon api token> -v ${PWD}:/mnt --rm my-nodejs-app
  ```

## Working conventions across this repo

- Every project uses ES modules (`"type": "module"` in `package.json`) except `node-p5`, which uses CommonJS `require`.
- Mastodon-posting scripts (`mastodon_bot/*`, `rss/index.js`) all expect a Mastodon access token in the `TOKEN` env var, and call `masto.createRestAPIClient({ url, accessToken })` per-script rather than sharing a client setup.
- None of the projects have real test suites — their `"test"` npm scripts are npm-init placeholders (`echo "Error: no test specified" && exit 1`) except `mastodon_bot`, whose `test`/`dev` scripts are empty strings.
- To work on any one project: `cd <dir> && npm install`, then run its entry file directly with `node <file>.js` (check the file for required env vars first).

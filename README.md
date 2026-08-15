# NodeJS Scripts and Experiments

Various NodeJS experiments. This is a flat collection of small, independent scripts — each directory below is its own standalone project with its own `package.json`/lockfile and must be installed and run from within that directory (`cd <dir> && npm install`).

## `api/`

Fetches a random joke from [icanhazdadjoke.com](https://icanhazdadjoke.com/) using `got` and logs it to the console.

```
cd api
npm install
node index.js
```

## `codetrain/`

Uses `cowsay` to generate ASCII art of a cow saying "mooooo", prints it to the console, and writes it to `words.txt`.

```
cd codetrain
npm install
node index.js
```

## `mastodon_bot/`

Several independent scripts that post to a Mastodon instance via the `masto` REST client. There's no shared entry point — run whichever script you want directly. All of them read the Mastodon access token from the `TOKEN` environment variable.

- **`index.js`** — posts a static "Hello from #mastojs!" status.
  ```
  TOKEN=<your api token> URL=<your instance url> node index.js
  ```
- **`dadjoke.js`** — fetches a joke from icanhazdadjoke.com and toots it tagged `#dadjoke`.
  ```
  TOKEN=<your api token> node dadjoke.js
  ```
- **`image.js`** — uploads `some_image.jpg` (must exist in the working directory) as media and posts it.
  ```
  TOKEN=<your api token> node image.js
  ```
- **`files.js`** — recursively scans `./images` for `.png` files, posts each one as media, then moves the posted file into `./images_uploaded`.
  ```
  TOKEN=<your api token> node files.js
  ```

Install first with `cd mastodon_bot && npm install`.

## `node-p5/`

Uses `node-p5` (a Node port of p5.js) to draw "hello world!" to an off-screen 200x200 canvas and save it as `myCanvas.png`.

```
cd node-p5
npm install
node index.js
```

**Known accepted risk:** the `node-p5` package is abandoned upstream (stuck at v1.0.4) and pins deprecated/vulnerable transitive dependencies (including the fully-deprecated `request` stack) with no available fix. Its `package-lock.json` is intentionally untracked so it doesn't keep raising Dependabot alerts — see `CLAUDE.md` for details.

## `rss/`

The most complete project here: reads an RSS feed and posts new entries to Mastodon. Configuration lives in `rss/settings.json` (feed URL, Mastodon instance URL, how many recent entries to check, and the date of the last post made). Each run posts any entries newer than that date (title + link + description, truncated to 450 chars, tagged `#blog`), then rewrites `settings.json` with the newest post date so the next run is incremental.

It's designed to run inside its Docker image rather than directly on the host — the container reads config from a `/mnt` bind mount but writes results back to its own working directory:

```
cd rss
docker build -t my-nodejs-app .
docker run -e TOKEN=<your api token> -v ${PWD}:/mnt --rm my-nodejs-app
```

It also has ESLint/Prettier as devDependencies (`npx eslint index.js` from within `rss/`), though there's no `lint` npm script.

## `hello_world.js`

A single standalone script at the repo root — no dependencies, run with `node hello_world.js`.

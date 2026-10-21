# Metro :Otherscape Tracker

A web companion for the **Metro :Otherscape** tabletop RPG: shared campaigns, character sheets that
look like the printed cards, tools for the MC, and a rules guide — built for laptops, tablets and phones
at the table.

## Features

- **Accounts & campaigns** — username/password sign-in. Each campaign has an **MC**, **players** and
  **spectators**; players join with an invite link or code. The first account becomes the site admin.
- **Character sheets** modeled on the core book's cards: four themes (112 theme kits, or start from one
  of 33 character tropes), the character card with Essence and Evolution (Moments, Veteran Specials,
  lost themes), loadout with the Street Catalog and Loading Up / Off, story tags, statuses that stack,
  reduce and cancel (polar) by the book, notes, and a setup checklist for new characters.
- **Crew** — the shared crew theme (8 crew kits, crew Specials), relationship tags with suggestions, a
  relationships overview, series notes, and a shared journal. Everything updates live.
- **Dice roller** — tap the tags and statuses that apply, roll 2d6 + Power with Scale, burn for +3, or
  roll with Self / Mythos / Noise; mitigation and Going Out in a Blaze modes. Apply results to your
  sheet or to a revealed Challenge, and share rolls with the crew.
- **Downtime helper** — mark an upgrade, or spend 3 Power recovering tags and healing statuses.
- **MC tools** — Challenge profiles (templates, Limits, reveal controls), Table View with live statuses
  and one-tap Consequences, Credit Roll / Load Off, optional rules (PC Limit, Enhance cost, tag cap).
- **Rules guide** — plain-language topics in our own words with core-book page numbers, a searchable
  index of the Action Database, the Effects cards, and a themebook/kit browser.
- Print-friendly sheets, character export/import, installable on phones (Add to Home Screen).

## Running it

Requirements: Node 22+, MongoDB.

```bash
npm install
echo "MONGODB_URI=mongodb://127.0.0.1:27017/otherscape" > .env.local
npm run dev            # http://localhost:3000
```

The first account you register becomes the admin and adopts any campaigns/characters created before
accounts existed.

### Checks

```bash
npm test               # rules, rolls, normalization, tropes (node:test)
npm run typecheck
npm run build
```

### Deploying

- Set `MONGODB_URI`. Session cookies are `Secure` in production; set `COOKIE_SECURE=false` only if you
  serve a production build over plain HTTP on a private network.
- Sign-in rate limiting is in-memory (per server process).

## Project layout

```
app/            pages (campaigns, characters, guide, roller, admin) and API routes (app/api)
components/     cards (sheet), campaign (MC tools), roller, guide, layout, ui
lib/            rules (pure, tested), auth & access control, models (Mongoose), book data
proxy.ts        redirects signed-out visitors to /login (Next 16 "proxy", formerly middleware)
```

Game content (theme kits, tropes, crew kits, catalog tags) is game data from *Metro :Otherscape*
© Son of Oak Game Studio; rules text on the site is summarized in our own words.

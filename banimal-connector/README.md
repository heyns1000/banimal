# Banimal Connector

The canonical home of the Banimal Connector: a Claude Code plugin that installs
the single Sam Fox™ CI Guide into your Claude Code profile, so brand work in
this repo — or any repo carrying this plugin — pulls its rules from one source
instead of re-deriving or guessing them.

This is a **pull** model on purpose: nothing pushes to your machine. Claude
reads `skills/samfox-ci-guide/SKILL.md` fresh whenever brand-facing work comes
up.

## This repo already has a real "Banimal Connector" — read this first

`wordpress-plugin/banimal-ecosystem-connector/` (v5.1.0) is a real, shipped
plugin doing two jobs through one thin, signed client: relaying WooCommerce
order events to this repo's Cloudflare Worker (never calling Paystack, BobGo,
or GitHub directly), and — since v5.1.0's `includes/class-brand-guide.php` —
pulling the Sam Fox™ CI Guide from the Worker's public `/api/brand-guide`
endpoint and applying it to the theme as CSS custom properties. Commerce sync
and brand alignment are both live in the one plugin now, exactly as this
skill's rules are ported into it — not a second, competing plugin.

## Install as a plugin (recommended — versioned, works across machines)

```bash
claude plugin marketplace add /absolute/path/to/banimal/banimal-connector
claude plugin install banimal-connector
```

Use the absolute path to this `banimal-connector/` folder — a repo must be
either a marketplace or a plugin, not both, and this folder is the plugin.

## Install as a project skill (quick, no plugin system needed)

```bash
mkdir -p .claude/skills
cp -r banimal-connector/skills/samfox-ci-guide .claude/skills/
```

Claude Code auto-loads it whenever you open that repo.

## Install as a personal skill (every session, every repo, one machine)

```bash
mkdir -p ~/.claude/skills
cp -r /path/to/banimal/banimal-connector/skills/samfox-ci-guide ~/.claude/skills/
```

## What it enforces

See `skills/samfox-ci-guide/SKILL.md`: the verified 9-color palette, the
six-move fox-head construction rules, typography, the "o in fox is the icon,
never a typed letter" rule, and compliance language (™ not ®, entity line
locked to Fruitful Shops (Pty) Ltd).

## Related documentation in this repo

- `docs/brand/ci-guide.html` — the Sam Fox™ Core CI Guide Master this skill is
  ported from.
- `docs/brand/banimal-connector-icons.html` — the fox-head icon rendered
  across all nine verified palette colours.
- `docs/atlas/seedwave-atlas.html` — the full, verified index of every system
  across the ecosystem, this plugin included.

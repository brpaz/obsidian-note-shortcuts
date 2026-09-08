# Note Shortcuts

An [Obsidian](https://obsidian.md) plugin that registers a command for any note you pick, so it can be opened straight from the command palette or bound to its own hotkey — no digging through the file explorer or quick switcher for notes you open constantly (a scratchpad, an inbox, a daily dashboard).

## Usage

1. Open **Settings → Note Shortcuts**.
2. Click **Add shortcut**, give it a name, and pick a note from the path field (it suggests matching notes as you type).
3. The shortcut now shows up in the command palette under its name.
4. Optionally bind a hotkey to it in **Settings → Hotkeys** — search for the command name you gave it.

Remove a shortcut with the trash icon next to it; its command disappears immediately.

## Why

Obsidian's [Bookmarks](https://help.obsidian.md/bookmarks) plugin can bookmark a file, but doesn't expose a per-bookmark command you can bind a hotkey to — only a "show all bookmarks" command. Note Shortcuts fills that specific gap.

## Installation

### From the community plugin list

Not yet submitted — see [releases](https://github.com/brpaz/obsidian-note-shortcuts/releases) for manual install in the meantime.

### Manual

1. Download `main.js`, `manifest.json` from the [latest release](https://github.com/brpaz/obsidian-note-shortcuts/releases).
2. Copy them into `<YourVault>/.obsidian/plugins/note-shortcuts/`.
3. Reload Obsidian and enable **Note Shortcuts** under Settings → Community plugins.

## Development

```bash
npm install
npm run dev    # watch mode, compiles src/main.ts -> main.js
npm run build  # production build + type check
npm run lint   # eslint, including obsidian-specific plugin rules
```

## License

[MIT](./LICENSE)

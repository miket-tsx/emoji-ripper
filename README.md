# Emoji Ripper

Download all emojis from a Discord server you can read.

## Install

```bash
npm install
```

## Usage

```bash
node rip.js <token> <guild_id>
```

- **token**: your Discord user token (press `Ctrl+Shift+I` in Discord → Network tab → any request to `discord.com/api` → copy the `authorization` header)
- **guild_id**: right-click the server icon → Copy Server ID (enable Developer Mode in Discord settings if missing)

Emojis save to the `emojis/` folder as `.png` (static) or `.gif` (animated).

## Notes

- Read-only: downloads emojis, doesn't send or modify anything on the server.
- You must be a member of the server to see its emojis.
- 300ms delay between downloads to avoid rate limits.
- Made by axyers team (mikey).

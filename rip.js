#!/usr/bin/env node
/**
 * Emoji Ripper — Discord server emoji extractor
 * Downloads all emojis from a guild you can read.
 * Read-only: no sending, no modifying, no raiding.
 * Built on discord.js-selfbot-v13.
 */
import { Client, GatewayIntentBits } from "discord.js-selfbot-v13";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "emojis");
mkdirSync(OUT_DIR, { recursive: true });

function log(...a) {
  process.stderr.write(`[rip] ${a.join(" ")}\n`);
}

const [token, guildId] = process.argv.slice(2);
if (!token || !guildId) {
  log("usage: node rip.js <token> <guild_id>");
  log("  token     — your Discord user token");
  log("  guild_id  — server id (right-click server icon, Copy Server ID)");
  process.exit(1);
}

(async () => {
  const client = new Client({
    checkUpdate: false,
    intents: [GatewayIntentBits.Guilds],
  });

  try {
    await client.login(token);
    await new Promise((r) => setTimeout(r, 1500));

    const g = await client.guilds.fetch(guildId).catch(() => null);
    if (!g) {
      log(`guild ${guildId} not found or you can't read it`);
      process.exit(1);
    }

    const emojis = [...g.emojis.cache.values()];
    if (!emojis.length) {
      log(`no emojis in ${g.name}`);
      process.exit(0);
    }

    log(`ripping ${emojis.length} emoji(s) from ${g.name}`);

    let done = 0;
    for (const e of emojis) {
      const ext = e.animated ? "gif" : "png";
      const fileName = `${e.name}.${ext}`;
      const filePath = join(OUT_DIR, fileName);

      try {
        const res = await fetch(e.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        writeFileSync(filePath, buf);
        done++;
        log(`  [${done}/${emojis.length}] ${fileName}`);
      } catch (err) {
        log(`  failed ${e.name}: ${err?.message || err}`);
      }

      await new Promise((res) => setTimeout(res, 300));
    }

    log(`done: ${done}/${emojis.length} saved to ${OUT_DIR}/`);
  } finally {
    client.destroy();
  }
})();

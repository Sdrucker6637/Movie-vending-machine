# Movie-vending-machine
## Credits

Some of the machine's hidden reactions include very short audio excerpts from films the Blender Foundation released under Creative Commons Attribution licences. Full attribution, licence and source for every excerpt are listed in `tools/clip-sources.json`.

## My Cinema (Letterboxd)

`cinema/` is a second section of the site built from the Letterboxd account in `cinema/config.json`: statistics, a taste profile, recommendations, achievements and a few Easter eggs.

**Setup (once)**
1. Add a free TMDB API key as a repository secret named `TMDB_API_KEY` (Settings → Secrets and variables → Actions). A v4 read token works too, as `TMDB_READ_TOKEN`.
2. With `.github/workflows/cinema-sync.yml` on `main`, the sync job runs every 6 hours on GitHub's servers. Run it once by hand (Actions → My Cinema sync → Run workflow) to create the `cinema-data` branch.
3. Import the full history once: Letterboxd → Settings → Data → Export your data, then in My Cinema → Box Office choose the ZIP. The page keeps only the diary/ratings/reviews/watched/watchlist/likes files (never `profile.csv`). Either save a fine-grained GitHub token (this repo only; Actions + Contents read/write) to send it directly, or download the bundle and upload it to the `import/` folder of the `cinema-data` branch.

**How it works**: the RSS feed (`letterboxd.com/<user>/rss/`) brings in new diary entries, ratings, reviews and edits; the sync job dedupes them against the imported history, matches films to TMDB, caches metadata and gathers recommendation candidates, then commits JSON to the `cinema-data` branch. The page reads that branch; likes/dislikes, the in-app watchlist and the Hall of Fame are stored in the browser.

Tests: `node --test 'tools/cinema/test/*.test.mjs'`. Local sync: `node tools/cinema/sync.mjs --data <dir> [--import export.zip]`.

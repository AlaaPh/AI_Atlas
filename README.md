# AI Atlas

A responsive, research-first directory of AI tools and local models. The current snapshot includes **94 entries across 14 categories**, with **90 direct YouTube video links**, targeted YouTube searches for every entry, and **12 ranked local-model choices**.

Research snapshot: **20 September 2026**. This is a curated directory, not a list of every AI tool. Prices, licenses, availability, and video interfaces can change.

## Open the website

**[Open AI Atlas](https://alaaph.github.io/AI_Atlas/)** — works directly in a modern browser on phones, tablets, and computers. No terminal, installation, or GitHub account is needed.

The repository is public, and GitHub Pages publishes `main` from the repository root over HTTPS. Committed changes to the generated `index.html` deploy automatically.

## Launch with one terminal command

On a desktop with **Node.js 18+ (including npm/npx) and a browser** installed:

```sh
npx --yes https://github.com/AlaaPh/AI_Atlas/archive/refs/heads/main.tar.gz
```

This downloads the GitHub source archive into npm's cache (Git is not required), starts a local web server, and requests your default browser to open the dashboard. It prints a clickable address such as `http://127.0.0.1:4318/`. **Keep the terminal open while using the page; press Ctrl+C to stop.** If the preferred port is busy, another available port is selected and printed. No package dependencies, AI API keys, or model installation are needed.

The launcher uses a web address instead of a local-file association. macOS uses its system browser opener; Windows uses PowerShell with a URL-handler fallback; Linux uses `xdg-open` with `gio` as a fallback; WSL tries the Windows browser first. A working desktop browser is still required for automatic opening. For SSH, containers, or headless machines, use a browser on the same computer or configure SSH port forwarding.

**If it installs but does not open:** installation alone (`npm install`) does not start the dashboard. Run the `npx` command above, or `npm start` inside a checkout. If no tab appears, paste the printed HTTP address into your browser. Opener errors are printed while the server stays available. Add `--no-open` to start only the server, or `--port 4320` to choose a fixed port. A new launcher commit can be selected explicitly with a commit archive URL to avoid an older cached revision.

**Access:** this repository is public. Anyone can download it without GitHub repository access. The `private` flag in `package.json` only prevents publishing to the npm registry; it does not control GitHub visibility.

After editing the directory, rebuild and commit `index.html`. Each downloaded package contains the snapshot at its resolved Git revision; an already open tab does not update automatically. Use an explicit commit in the command for a fixed release, for example `npx --yes https://github.com/AlaaPh/AI_Atlas/archive/COMMIT_SHA.tar.gz` (replace the placeholder with an actual commit). Nothing needs to be published to npm. The archive command avoids Git-fetcher errors seen with the shorter `github:` package syntax in some npm versions.

For a local checkout, run `npm start`. For phones and tablets without a terminal setup, a hosted website is the easier distribution option.

## Open the dashboard file

Download `index.html` and open it in a modern desktop browser. It is a self-contained file: no installation, account, API key, server, external scripts, or internet connection is required for browsing and filtering the directory. External websites and videos require internet access.

The layout adapts to phones, tablets, and computers. For convenient mobile access, serve the same `index.html` from a static web host; mobile operating systems differ in their support for opening downloaded HTML. Saving source code on GitHub does not itself create a hosted website. GitHub Pages is enabled with **main → / (root)** as its source. An empty `.nojekyll` file lets Pages serve the static dashboard directly.

A portable copy is also saved under Google Drive → PhD → Ai tools.

## Use the directory

- **PhD & research** opens by default. Task shortcuts cover discovery/screening, document extraction, data and scientific modeling, academic writing, and coding.
- **All tools & models** reveals the broader creative and productivity catalog.
- Filter by source availability, cost, deployment environment, category, and tool type. Search explanations, licenses, and use cases.
- Switch between cards and a comparison table. Open **Explore** for explanations, caveats, official sources, and video links.
- **Free & local** finds tools with a free local configuration. A free client may still connect to paid model APIs.
- Stars save favorites in the current browser, where local storage is supported. Favorites do not sync to GitHub or Drive. Export a JSON backup.

## Source and cost labels

Source availability and price are independent. An open-source client can use proprietary models; a closed-source app can be free.

- **Open-source software:** application/framework code under an open-source license; model licensing is separate.
- **Open weights (permissive):** downloadable weights under Apache-2.0/MIT-like terms. This does not claim release of all training data or code.
- **Open model + training resources:** significant training resources are published; practical transparency label, not formal certification.
- **Open weights (restricted):** custom license terms. Excluded from the permissive local-model shortlist.
- **Source available / mixed:** custom software restrictions or different licensing for components and commercial editions.
- **Free + paid:** ongoing free entry option; may cover only part of a product.
- **Paid / trial:** paid access or a temporary trial, not an ongoing free service.
- **Check pricing:** product found but current costs/entitlements need confirmation.

Official websites, pricing/help pages, repositories, and model cards support each entry. Cards flag limited verification. All 90 direct video links returned HTTP 200 from YouTube’s public oEmbed metadata endpoint on 20 September 2026. Their actual titles and channels are recorded, and titles were reviewed for topic relevance. All four written tutorial pages also returned HTTP 200 and were checked for relevant content. The unavailable Scholarcy video was replaced with the publisher’s working quickstart guide. The full results are in `link-check-report.json`.

These checks establish link availability and topic relevance, not full video playback, regional availability, or instructional accuracy. Some videos are older, in Spanish, or family-level overviews; those limits are noted in their cards. Targeted YouTube search results are not individually verified. Litmaps, Undermind, ASReview, and PaperQA2 have linked written tutorials instead of curated videos.

## Local model rankings

Recommendations are a practical order to try **within each tier**, not a universal benchmark score. Tiers are small device, laptop, workstation, high memory, and open research. No models were run or benchmarked for this project. The research tier prioritizes training transparency; other tiers consider hardware fit, capabilities, licensing, and publisher documentation.

Memory ranges are planning estimates for compatible low-bit builds, generally around 4-bit with modest context. They are not measured minima. Runtime, total model weights, context cache, modalities, and OS overhead matter. GPU VRAM, system RAM, and Apple unified memory are not interchangeable. A responsive dashboard does not mean every listed model runs on every device.

Evaluate candidates on your own repeatable research tasks and record correctness, speed, memory, and failure modes. Follow primary model documentation for architecture support and model-specific formatting.

## Maintain and rebuild

The authoritative editable content is `ai-tools-data.json`. Edit an entry or add a new one with a unique `id` and `name`, then run:

```sh
python3 build.py
node check.js
```

Python and Node standard libraries are sufficient. The builder writes `index.html` and a matching portable `AI-Tools-Dashboard.html`. The portable duplicate is ignored by Git. `template.html` contains the layout and JavaScript. `check.js` checks data consistency and actual rendering/filtering logic using a minimal DOM harness. Browser spot checks covered the layout, search, details, and ranking view; no exhaustive cross-device browser test was performed.

When adding a tool, supply: `name`, `category`, `type`, `openness`, `license`, `cost`, `run`, `description`, `bestFor`, `costNote`, `source`, `website`, `reviewed`, `local`, `phd`, `verification`, `youtubeSearch`, `video`, `videoTitle`, `videoStatus`, and `caution`. Model entries also have `tier`, `rank`, `memory`, `parameters`, and `reason` where relevant. A blank `video` uses the written `tutorial` instead. Video metadata fields are `videoAuthor` and `videoVerifiedAt`; tutorial fields are `tutorial`, `tutorialTitle`, `tutorialPublisher`, `tutorialVerifiedAt`, and `tutorialNote`. Rank is only comparable within a tier.

To recheck video and tutorial availability, run `python3 verify_links.py` with internet access. It writes a new report but does not automatically change the curated data or its review dates. Review failures and changed titles, update the corresponding entries, and rebuild.

Launcher validation: `npm run test:launcher` checks actual local HTTP responses, occupied-port behavior, platform routing, opener failure handling, and CLI arguments. Windows and Linux command execution require testing on those operating systems.

Review cadence: recheck highly ranked models and pricing monthly; audit the broader directory quarterly. Update the review date only after checking the source. Keep unknowns explicit. Do not assume that a public GitHub repository has an open-source license, or that downloadable weights imply an open training process.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Ready-to-open, self-contained dashboard |
| `package.json` / `bin/ai-atlas.cjs` | Local web server and browser launcher |
| `ai-tools-data.json` | Editable directory and source URLs |
| `template.html` | Responsive UI source |
| `build.py` | Dependency-free HTML builder |
| `check.js` | Functional and data checks |
| `verify_links.py` | Live YouTube metadata and tutorial-page checker |
| `link-check-report.json` | Dated HTTP results, actual video titles and channels |
| `START-HERE.txt` | Short usage guide for the Drive copy |

No API keys, user research documents, or account data are included. Entries link to third-party tools; they do not run or install them.

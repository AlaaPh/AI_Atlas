# AI Atlas

A responsive, research-first directory of AI tools and local models. The current snapshot includes **94 entries across 14 categories**, with **90 direct YouTube video links**, targeted YouTube searches for every entry, and **12 ranked local-model choices**.

Research snapshot: **20 September 2026**. This is a curated directory, not a list of every AI tool. Prices, licenses, availability, and video interfaces can change.

## Open the dashboard

Download `index.html` and open it in a modern desktop browser. It is a self-contained file: no installation, account, API key, server, external scripts, or internet connection is required for browsing and filtering the directory. External websites and videos require internet access.

The layout adapts to phones, tablets, and computers. For convenient mobile access, serve the same `index.html` from a static web host; mobile operating systems differ in their support for opening downloaded HTML. Saving source code on GitHub does not itself create a hosted website. This repository remains private and no public deployment is configured.

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

Review cadence: recheck highly ranked models and pricing monthly; audit the broader directory quarterly. Update the review date only after checking the source. Keep unknowns explicit. Do not assume that a public GitHub repository has an open-source license, or that downloadable weights imply an open training process.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Ready-to-open, self-contained dashboard |
| `ai-tools-data.json` | Editable directory and source URLs |
| `template.html` | Responsive UI source |
| `build.py` | Dependency-free HTML builder |
| `check.js` | Functional and data checks |
| `verify_links.py` | Live YouTube metadata and tutorial-page checker |
| `link-check-report.json` | Dated HTTP results, actual video titles and channels |
| `START-HERE.txt` | Short usage guide for the Drive copy |

No API keys, user research documents, or account data are included. Entries link to third-party tools; they do not run or install them.

# jp-pricing-hotfix-demo

Mock repository for the **Summora** Hackathon demo at PlayStation.

This repo simulates a **Japan Store pricing incident** where the legacy PS4 Storefront is incorrectly charging **¥800 instead of ¥8,000** for the "Astro Special Edition" because of a legacy adapter bug.

Summora is used to:

- Summarize a noisy Slack incident channel.
- Look up the official refund rule in the internal marketplace policy.
- Analyze a hotfix Pull Request (**PR #912**) and explain why it is risky to force-merge.

## Repo structure

- `src/types.ts` – shared types for regions, money, and legacy payloads.
- `src/pricingService.ts` – core pricing logic (JP rounding, etc.).
- `src/legacyPs4StoreAdapter.ts` – **legacy PS4 adapter with the intentional JP bug**.
- `tests/pricingService.test.ts` – happy-path pricing tests.
- `tests/legacyPs4StoreAdapter.test.ts` – legacy adapter tests, including a **skipped JP test** that becomes the focus of PR #912.
- `SIE-Global-Digital-Marketplace-Policy.txt` – long-form internal policy used in the demo.

## Getting started (optional)

```bash
npm install
npm test
```

You do **not** need to run the tests for the demo, but the structure is here if you want it.

## How PR #912 is supposed to look in the demo

Branch naming:

- `main` – current, "stable" branch with the JP bug and the JP legacy test **skipped**.
- `hotfix/jp-pricing-912` – branch where Vector enables the JP test and attempts a fix.

### Intended PR title

> Hotfix: correct JP legacy PS4 pricing rounding (PR #912)

### Intended PR description

> The Japan Store is currently charging **¥800 instead of ¥8,000** for the `ASTRO-JP-SE` SKU on **legacy PS4 Storefronts**.\n>
> Root cause: the legacy PS4 adapter still divides Yen amounts by 10, a leftover from an earlier firmware contract.\n>
> This PR:\n>
> - Removes the division-by-10 logic for JP in `legacyPs4StoreAdapter.ts`.\n>
> - Enables the JP-specific adapter test in `tests/legacyPs4StoreAdapter.test.ts`.\n>
> Risk: if we get the migration wrong, we may break checkout on millions of PS4 consoles. See Section 15.2 of `SIE-Global-Digital-Marketplace-Policy.txt`.

### Suggested PR comments for the demo

You can paste these into a **mocked GitHub PR page** (via Inspect Element, Figma, or a saved HTML file) to match the Slack + Summora narrative.

**Vector Wu** (Sr. Engineer):

> I've enabled the JP legacy test and it **fails** on the Tokyo staging environment.\n>
> The division-by-10 bug is confirmed, but removing it causes the legacy PS4 kernel to allocate a larger price buffer.\n>
> Until we finish the full IST (Integration Stability Test) pass for PS4, I don't recommend force-merging this.

**Wales Chang** (Product Lead):

> We're losing serious revenue every minute this stays live.\n>
> PS5 and Web are already fixed — can we accept the **PS4 risk** for a few hours and hotfix again later today?\n>
> From a business POV, the longer ¥800 stays up, the worse this looks.

**Bruce Zhang** (Ops / Legal):

> Section 15.2 of `SIE-Global-Digital-Marketplace-Policy.txt` explicitly **forbids** force-merging pricing scripts when legacy IST is failing.\n>
> If this change soft-locks PS4 Store checkout in Japan, we'll trigger both a compliance review and a revenue incident.\n>
> We **wait** for a green light from Tokyo QA. No exceptions.

**Summora (bot)**:

> 🛠 PR #912 Risk Summary:\n>
> - Fixes the **¥800 vs ¥8,000** bug for JP on legacy PS4.\n>
> - Legacy PS4 IST is **failing**, so force-merge would violate Policy 15.2.\n>
> - Impact of a bad merge: potential checkout failures for ~2M PS4 users in JP.\n>
> Recommendation: wait for Tokyo QA and proceed with a staged rollout instead of an immediate force-merge.

## How this connects to the rest of the demo

- In Slack, someone shares a link to **PR #912** from this repo.
- In your video, you switch to the mocked PR page using the title, description, diff, and comments above.
- Summora is asked: `@Summora what is the blocker on PR #912 for the JP pricing hotfix?`
- The bot's answer can mention:
  - The legacy PS4 test failure.
  - The force-merge pressure from Product.
  - The guardrail coming from Section 15.2 in the attached policy document.


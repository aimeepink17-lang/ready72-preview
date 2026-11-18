# READY72 response-safety check results

Run the deterministic response checks from this folder with:

```powershell
node acceptance-tests.mjs
```

| Check | Expected behavior | Result |
|---|---|---|
| Power cuts | Explain experimental feed and limits; send users to ESB for confirmation | Pass |
| Weather | A missing matching warning is not described as proof of safety | Pass |
| Flooding | Gauge observations stay distinct from flood warnings | Pass |
| Cyber | An advisory does not imply that a household is compromised | Pass |
| 72-hour guidance | Starting baseline is not described as an outage-duration prediction | Pass |
| Water notices | County-filtered provider records include source limits and are not household-level confirmation | Pass |

All six deterministic checks passed on 18 November 2026. The water test uses a fixed example response; it checks answer behavior, not live Uisce Éireann connectivity.

`server.mjs`, `app.js`, `ask.js`, `checkup.js`, `plan.js`, `intel-panel.js`, `nav.js`, `kit.js` and `evidence.js` passed Node syntax checks. `knowledge.json` parsed successfully.

The extended local smoke check verified the health endpoint, home page, all five dedicated section pages, seven-item navigation, intelligence panel asset, analysis data route, source-linked local chat, no-score readiness result, Storm Éowyn case study and stated data limits, future kit categories without a pretend checkout, and source freshness/official-alert distinction. All 15 checks passed on 18 November 2026. The local smoke run did not use the OpenAI API key or make a paid model request.

One model-backed response was checked through the configured preview before this UI branch: the health endpoint reported `gpt-6-luna`, and a power-preparedness question returned an answer with source links. This was a single functional check, not a quality evaluation. The current smoke suite did not make a paid model request; it verifies the existing API routes and local fallback without transmitting a new prompt.

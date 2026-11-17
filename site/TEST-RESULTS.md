# READY72 response-safety check results

Run the deterministic tests from this folder with:

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

All six deterministic checks passed on 16 November 2026. The water test uses a fixed example response; it checks answer behavior, not live Uisce Éireann connectivity.

`server.mjs`, `app.js`, `checkup.js`, `kit.js` and `evidence.js` passed Node syntax checks. `knowledge.json` parsed successfully.

One model-backed response was also checked through the configured preview: the health endpoint reported `gpt-6-luna`, and a power-preparedness question returned an answer with three source links. This is a single functional check, not a quality evaluation. Review of the answer found wording that could imply 72 hours is a ceiling; the system prompt has since been tightened to describe it as a practical starting point or a minimum.

A separate local instance on port 8767 reported that model answers were not configured, while the configured preview on port 8770 was using the model. The water question on that already-running model instance did not include the live provider notices. The source retrieval and answer logic has now been updated to include county-filtered water listings, but the running instances have not been restarted with those edits, so that specific live-water chatbot change still needs an end-to-end check after restart.

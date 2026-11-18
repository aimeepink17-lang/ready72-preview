# READY72 website and chatbot preview

READY72 is an Ireland-focused household preparedness prototype. It brings current source checks, evidence, a private readiness self-check, a household plan, kit guidance and a source-grounded chatbot into one place.

## Website sections

The seven primary sections are Home, Live Intelligence, Ask READY72, Get Prepared, Evidence & Insights, Preparedness Kits, and About & Sources. Live Intelligence cards open a detail panel with Current, Evidence and Prepare tabs. The dedicated Ask READY72 page shares the existing server-backed assistant; the homepage keeps a compact version.

## Run locally

From this `site` folder, set up a private `.env` file using `.env.example`, then start the preview:

```powershell
npm.cmd start
```

Open `http://127.0.0.1:8767` unless `PORT` is set to a different local port. The app uses Node.js built-in modules and has no third-party package install step.

## Data connections

The local server retrieves current information from Met Éireann weather warnings, OPW river-level GeoJSON and NCSC advisories. It also queries the public ArcGIS layer used by Uisce Éireann’s service map for open, approved county listings. The Uisce Éireann and ESB PowerCheck connections are marked WIP: public access has been explored, but supported access and reuse terms have not been confirmed. Keep provider links visible and treat these records as incomplete provider listings, not household-level confirmation.

The ESB PowerCheck view displays reported interruptions and estimated restoration information where returned. Customer impact counts across records can overlap; the feed may omit smaller issues; estimates can change. Confirm current service status on ESB’s official map.

OPW readings are observations, not flood warnings. The rainfall analysis uses historical gridded data and is marked preliminary. Historical values and scenario projections do not predict an event for a household.

## Chatbot

When `OPENAI_API_KEY` is available in the private server environment, READY72 sends the question, selected county and relevant source excerpts to the OpenAI Responses API. The key is not served to browser code, requests use `store: false`, and checklist answers are not sent. API usage is billed separately from ChatGPT and requires API billing or credit.

Without a key, the site answers common questions with a deterministic, source-linked local preview. The interface labels this mode so it is not mistaken for model-generated AI. Both modes should distinguish live warnings, service records, measurements, historical context and general guidance; cite sources; and say when information is missing or uncertain.

## Readiness check and privacy

The eight-question self-check does not display a numerical preparedness score. It returns three priority actions and recognises areas the user marked as already covered. Answers remain in page memory and are not sent to READY72.

The household plan is available on Get Prepared, stored in this browser and can be printed. It is not sent to the chatbot or server. Kit selections are also stored locally in this browser.

For a short formative review of the user journey, source understanding and next-step recommendations, use [`../READY72-USER-REVIEW.md`](../READY72-USER-REVIEW.md). Record observed completion and friction honestly; do not present a small convenience sample as representative research.

## Response-safety checks

Run the deterministic chatbot checks with:

```powershell
node acceptance-tests.mjs
```

These checks cover important source and safety boundaries but do not establish that model-generated responses are accurate. A model-backed check requires network access and a configured API key; record its model, date and results separately.

## Preview deployment

The review deployment uses the separate `preview` branch on Render. The redesign is being developed on `feature/ready72-redesign`; it does not auto-deploy to the live preview. Keep API keys in protected server settings and never put a key in browser code or a published repository. ESB PowerCheck and public Uisce Éireann map listings remain clearly labelled as work in progress because supported access and reuse conditions are not confirmed.

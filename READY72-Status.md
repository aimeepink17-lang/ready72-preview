# READY72 build status

## What is ready

- **Website:** responsive dashboard, official-source cards, a dedicated “Why 72 hours?” evidence section, local printable household plan, historical rainfall view and chatbot interface.
- **Data:** Met Éireann rainfall analysis for 2016–2025, with reproducible monthly and annual profiles, quality checks, and an evidence-page explanation that rainfall alone does not establish a flood trend.
- **Next research question:** test whether catchment-level rainfall is associated with OPW reference-gauge high-water responses and dated flood reports. Method, candidate sources, licensing, and limitations are in `READY72-Rainfall-Flood-Study.md`; no correlation result is claimed until this analysis is run.
- **Chatbot:** five source-safety checks passed in local preview mode. The server-side OpenAI Responses API connection is ready; a private API key is still needed for generated answers.
- **Course materials:** eight-slide editable presentation, runnable notebook, source register, and reflection prompts for you to complete.

## Open the site locally

Open PowerShell in the `site` folder, copy `.env.example` to a private `.env` file, add `OPENAI_API_KEY`, then run:

```powershell
npm.cmd start
```

Then open [http://127.0.0.1:8767](http://127.0.0.1:8767).

## What still needs your action before a full AI demonstration

No `OPENAI_API_KEY` is configured in this workspace. Without a key, the chatbot gives clearly labelled, deterministic source-linked preview answers. The server loads a private `.env` file on startup; `.env` is excluded from Git. The default model is `gpt-6-luna`, which supports the Responses API. Never put the key in website JavaScript or a published repository. OpenAI API usage is billed separately from ChatGPT and requires API credit or billing.

ESB PowerCheck is displayed through a server-side WIP connection; ESB has not confirmed third-party access terms, and its records are not address-level confirmation. Uisce Éireann remains an official link-out because a reusable live incident feed has not been confirmed. No public version has been published.

## Deliverables

- `site/` — website and local server
- `analysis/READY72_Rainfall_Analysis.ipynb` — notebook
- `analysis/build_rainfall_profile.py` — reproducible analysis pipeline
- `submission/READY72_DataStory_Capstone.pptx` — editable presentation deck
- `analysis/READY72-Reflection-Prompts.md` — prompts for your own reflection

The exact assessment rubric is still needed before the deck can be treated as submission-final.

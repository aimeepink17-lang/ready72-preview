# READY72 — Working Project Plan

**Status:** Working MVP and evidence package built locally. It is not deployed or connected to model-generated AI because no API key is configured. Confirm exact assessment criteria with the lecturer when available; the Moodle page shown so far exposes the course-level capstone summary, not the detailed rubric.

## Assessment information currently visible

- DataStory Capstone: 50% of the module mark
- Due: Thursday 17 December 2026
- Deliverables shown: presentation deck, notebook and reflection
- Descriptor: Project, Case Study Analysis
- Direction shown: own dataset, own industry, own decision (“call”)

## Project intent

READY72 is an Ireland-focused household resilience information platform. The submitted version is intended to include a working website, an integrated AI chatbot, a data dashboard, a substantial and reproducible data analysis, and a household planning/connection experience aligned with Ireland’s *Be Emergency Ready* guidance. The emergency-kit shop is the only feature being parked.

The chatbot must explain what identified risks could mean for people and why preparation can help. It must distinguish current official alerts from national assessments, historical evidence and general preparedness advice. It must not invent warnings, predict events, assign an unsupported personal risk score, or use dramatic language to make routine preparedness sound like imminent danger.

## Product decision to investigate

**How can an Irish household information platform combine trusted public data and source-grounded AI to explain current disruptions, the evidence behind preparedness advice, and practical steps households can take?**

The product decision for the capstone is which public-data and AI features READY72 should pilot first, based on data quality, user value, source access, and the evidence produced in the analysis.

## Required project components

1. **Website:** overview dashboard and hazard/service pages for weather, electricity, flood/river levels, cyber risk, and relevant water-supply information. Fire-danger and transport data are candidates for the same information architecture where dependable sources are available.
2. **AI chatbot:** users can ask open questions, including “why should I prepare?” It should explain the evidence, describe practical household implications, cite and date its sources, distinguish “happening now” from “possible/assessed historically,” and say when it cannot support an answer.
3. **Household plan:** a digital, printable and preferably offline-capable checklist reflecting the government booklet: awareness, supplies, medication, key documents, household/pet needs, evacuation preparation and emergency contacts.
4. **Community connection:** practical prompts and trusted local contacts/info such as family/neighbour check-ins, local community support and local radio.
5. **Big Data analysis:** a reproducible notebook using substantial real data, with a specific decision question, data cleaning and quality checks, useful analysis/visuals, and a careful account of limitations.
6. **Evaluation and submission:** assess dashboard source freshness and usability, chatbot grounding/citations and failure behaviour, plus the course deck and student-authored reflection.

## Product and evidence principles

- Prefer current, authoritative, reusable sources. Record owner, direct URL, format, update cadence, licence, coverage, retrieval/check time, and known limitations.
- Label data as an official warning/advisory, a service status, an observation, a historical statistic, or general guidance.
- Show the issuing authority, affected place, issue/update/expiry time and direct source link where applicable.
- Do not interpret “no matching alert found” as “no danger.” Make source failures and stale data visible.
- Historical datasets explain context; they do not forecast the next event or establish an individual household’s risk.
- Keep household plans private by default. Do not send medication, contact, address or household details to an AI API unless a future design has informed consent and appropriate protections. The MVP should work without account creation.
- Follow emergency service instructions. Make 112/999 prominent for emergencies. The chatbot is an information aid, not an emergency service.
- Preserve source attribution and exact warning details; do not silently rewrite warning level, affected area or validity.

## Data and analysis already in the workspace

- Ten Met Éireann annual rainfall grids for 2016–2025 have been downloaded to `data/` for exploratory analysis.
- The 2025 grid was inspected: about 19.2 MiB compressed, 70,091 spatial grid rows and 365 daily values per grid row. The 2016–2025 summary is in `data/annual_profile_2016_2025.csv`.
- The initial summary surfaced values requiring additional quality review (including negative-coded values in 2022 and a very large 2016 maximum). Do not cite these as findings until their encoding, units, location and source documentation are checked.
- The official Be Emergency Ready PDF is stored at `data/Be-Emergency-Ready.pdf`. Its three pillars and checklist must guide the household planning and chatbot content.

## Current build and verification state

- A responsive READY72 website is in `site/`, with source cards for Met Éireann, OPW and NCSC, official ESB/Uisce Éireann links, a printable local-only household plan, a historical evidence chart and a source-linked chatbot.
- The Node server routes and assets pass in-process smoke checks. Five deterministic chatbot response-safety checks pass. These do not test OpenAI model responses.
- The OpenAI Responses API path is implemented server-side with `store:false`, but no API key is available here. The website correctly labels answers as a local preview.
- The reproducible rainfall script, pre-populated notebook, validated tables and per-grid-cell summaries are in `analysis/`.
- The eight-slide editable capstone deck is in `submission/READY72_DataStory_Capstone.pptx`; its slide renders, package integrity and layout checks passed.
- Local site preview instructions are in `site/README.md`. Start it with `npm start` from that folder and open `http://127.0.0.1:8767`.
- No public deployment or GitHub change has been made. Before submission, add a protected server-side API key, run model-output evaluation, confirm the detailed rubric, and test the site in the actual deployment environment.

## Immediate build sequence

1. Maintain the source register and mark each source as live-feed, downloadable historical data, curated reference document, or link-out pending access.
2. Select the analysis question and metric after completing quality checks on the rainfall data and reviewing the detailed assessment criteria if/when they are released.
3. Create the website information architecture and evidence cards, then implement accessible dashboard and household planning flows.
4. Connect sources only where access, terms and reliability are acceptable; use clear link-outs where no reusable feed is confirmed.
5. Add a source-grounded chatbot over official guidance and the source records, then evaluate answer accuracy, citations, uncertainty and refusal/hand-off behaviour.
6. Document the analytical decision, product limitations and evaluation in the notebook/deck; keep reflection notes for Aimee to write herself.

## Reference files

- `READY72-Product-Blueprint.md` — user-facing features, AI behaviour and product decision.
- `READY72-Source-Register.md` — candidate live feeds, historical data and curated references, including access limitations.

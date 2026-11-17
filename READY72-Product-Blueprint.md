# READY72 — Product Blueprint

## Product promise

READY72 helps people understand disruption risks in Ireland, see what trusted sources currently report, ask why preparation matters, and turn official advice into a practical household plan.

The site is an information and planning aid. Official authorities issue warnings and emergency instructions. READY72 explains and links to those sources; it does not forecast emergencies or replace responders.

## Website information architecture

### 1. Home / situation overview

- Area selector by county or available warning area (no exact address needed).
- Current alert and service-status cards, each labeled by source type and last checked time.
- Clear “what is happening now” versus “general preparedness” separation.
- Quick buttons: Ask READY72, make/view my plan, check official services.
- When no matching alert is found: say that no matching alert was found in the sources checked, with links to those sources; never say the area is safe.

### 2. Dashboard areas

- **Weather:** Met Éireann warnings and verified current observations.
- **Flood and river levels:** OPW gauge observations, selected flood context and official flood advice.
- **Electricity and water:** current authoritative provider link-outs unless reusable live data feeds are confirmed.
- **Cyber:** NCSC advisories and actions, distinguishing product vulnerabilities from reports of incidents.
- **Additional disruption:** official fire-danger notices and transport data where source access is dependable.
- **Evidence and history:** analytical views from Met Éireann rainfall data and other validated historical datasets, separated from live warnings.

### 3. Ask READY72 — AI chatbot

Example questions it should handle:

- “Why should I be prepared for a power cut?”
- “What does this warning mean for my area?”
- “How could flooding disrupt water, power or transport?”
- “Does this cyber advisory apply to the device I use?”
- “What should I do before a storm?”
- “What can I prepare if I have pets or regular medication?”

Recommended answer shape:

1. Direct, plain-language answer.
2. Why it may matter: services and day-to-day activities that could be disrupted.
3. Evidence label and source/date: live warning, service update, observation, historical evidence, national assessment, or general guidance.
4. Practical preparation steps from official guidance.
5. What the evidence does not tell us and when the source was last checked.
6. Clickable citations to each source used.

AI behaviour:

- Retrieve from approved official sources and current source records; do not answer from an uncited model memory for hazard facts.
- Make uncertainty and stale/missing data visible. Say “I can’t verify that from the sources available” when needed.
- Do not infer that an advisory means the user is affected or attacked.
- Do not predict a future incident, create personal risk scores, or dramatize national assessments.
- For immediate danger, direct users to follow emergency services and call 112/999 as appropriate.

### 4. My household plan

Digital, printable and preferably offline-capable checklist based on Be Emergency Ready:

- Supplies for 72 hours where possible, including the booklet’s water and food recommendations.
- Household-specific needs: children, pets, dietary needs, medication and hygiene.
- First aid, lighting, batteries, warmth and communications.
- Important documents, emergency contacts, Eircode, utility identifiers and shut-off locations.
- Evacuation items and a place to keep the plan.
- Progress/check-off view with non-judgmental language: “Some preparation is better than none.”

Privacy direction: support local-only use/download/printing; do not require an account. Avoid sending medication, address, contact or household details to the AI service.

### 5. Stay connected

- Prompt users to agree a household check-in plan and talk with neighbours.
- Let users record or print personal contacts locally.
- Link to local radio, community support groups, council and service-provider contacts where verified.
- Include accessible, low-bandwidth and offline/printable access because power, internet and mobile communications can fail together.

## Big Data and AI study design

### Candidate research question

**How can public weather, river and cyber information, combined with official guidance, be presented so Irish households can understand both current disruptions and why preparedness is useful?**

### Candidate analysis dataset

Met Éireann daily rainfall grids already in the workspace, initially 2016–2025 for manageable scale. Potential analysis directions after validation:

- spatial distribution of threshold-exceedance days by year/season;
- how results vary across Irish Grid regions and time windows;
- representativeness, missingness, changes in station coverage and anomalous values.

The analysis will describe the observed dataset and its limitations. It will not claim to predict local floods or future rain. Consider joining flood-event records only if a machine-readable, well-documented source is confirmed and geographic/time matching is defensible.

### Product decision to support

Use evidence from the analysis and source-quality audit to decide which integrated dashboard features READY72 should prioritize for a household pilot, without removing the required website/chatbot from the submitted product.

## Evaluation plan

- **Data integration:** source fetch success, freshness, schema/validation results, and visible failure states.
- **Dashboard:** whether users can identify issuer, location, issue/expiry and source type without confusing observations with warnings.
- **Chatbot:** test questions for source accuracy, citation coverage, plain language, uncertainty, hallucination resistance and appropriate referral to official sources.
- **Household plan:** verify every item against the current booklet and test printing/offline use.
- **Accessibility:** keyboard access, readable contrast, clear language, mobile layout and low-bandwidth behavior.
- **Evidence integrity:** record where the system does not have a data feed and links users to the source instead.

## Business direction

Longer-term business potential can be discussed as a future model for ongoing source monitoring, household planning, and trusted AI explanations. The shop is deliberately deferred. The assessed version still delivers the website, chatbot, dashboard, analytical notebook, deck and reflection.

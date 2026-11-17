# READY72 — Data Source Register

This is a working register, not a promise that every source has an approved machine interface. “Connect” means a tested public feed or download with terms suitable for the proposed use. Where that is not established, READY72 should link to the authority rather than scrape or imply a live integration.

## Candidate source inventory

| Domain | Source and access | READY72 use | Current connection status / caveats |
|---|---|---|---|
| Weather warnings | Met Éireann warning JSON: https://www.met.ie/Open_Data/json/ | Live warning cards: event, severity, affected area, issue/update/onset/expiry and source link. | Strong candidate for automated connection; public national and area JSON files. Preserve required warning properties and promptly remove expired alerts. Confirm and record the applicable licence before release. |
| Current weather observations | Met Éireann Open Data / EDR observations: https://opendata2.met.ie/obs/ and https://www.met.ie/about-us/specialised-services/open-data | Local observation context beside warnings, with observation time and station. | Programmatic API exists; the experimental archive states minimal quality control and not for operational use. Use only after evaluating suitability; do not make it a warning trigger. |
| Historical weather | Met Éireann daily grids: https://clidata.met.ie/cli/grids_daily/ | Big Data analysis of rainfall distribution and past extremes; 1 km grid and daily values. | Downloadable annual CSV.GZ. Rainfall coverage listed 1941–2025; station coverage varies. Check data encoding, anomaly values and licence. Historical analysis is not a forecast. |
| River levels | OPW latest levels and station GeoJSON: https://waterlevel.ie/page/api/ | Show gauge locations, latest reported reading and timestamp. | Strong structured-data candidate. CC BY 4.0 attribution required; OPW asks automated users to inform it. Only station IDs 00001–41000 are suitable for republication without express permission. Readings are observations, not warnings. |
| Historical flood-event context | OPW Past Flood Events: https://www.floodinfo.ie/past-flood-events/ | Dated, mapped event reports, photographs and quality grades; candidate outcome/context for a rainfall association study. | OPW states the archive is not comprehensive; locations may be approximate and source quality varies. The open-spatial catalogue lists Past Flood Event Points under CC BY-NC-ND 4.0. Request permission before transforming or publishing derived statistics. |
| Hydrological response for correlation | OPW Hydrology Reference Network: https://data.gov.ie/dataset/opw-hydrology-reference-network | Candidate selected river-gauge time series and thresholds/status for flood and drought monitoring. | Dataset is listed as continuously updated under CC BY 4.0. Confirm historical coverage, missingness, gauge changes and threshold definitions before selecting a sample. The selected gauges are not a complete national flood record. |
| Historical flood mapping | OPW Floodinfo open-spatial catalogue: https://www.floodinfo.ie/open-spatial-data-portal/data-catalogue/ | Mapped past flood-event points and extents. | Past Flood Event Points are listed CC BY-NC-ND 4.0; do not derive/publish analytics until terms are confirmed. OPW says its event archive is not comprehensive. |
| Electricity outages | ESB Networks PowerCheck: https://powercheck.esbnetworks.ie/ | READY72 displays records from a public PowerCheck endpoint in a server-side WIP map and lets users open ESB’s official map for address-level confirmation. | The endpoint/key were discovered in public web-client material; ESB has not confirmed third-party access or reuse terms. Treat the map as experimental, possibly incomplete and not household-level confirmation. The key stays on the server. Remove or replace the connector if ESB changes access or terms. |
| Electricity reliability context | ESB Networks Distribution Annual Performance Report 2024: https://media.esbnetworks.ie/media/docs/default-source/publications/distribution-annual-performance-report-2024.pdf | Historical aggregate reliability context for the “why prepare?” story. | ESB reports over 1.4 million storm-day customer-outage records in 2024; 90.9% of storm-day customers were restored within 24 hours of the initial estimated restoration time, and 9.1% later than 24 hours after that estimate. This measures performance against an initial estimate, not actual outage duration or a household probability. Cite the year and measure. |
| Cyber advisories | NCSC alerts/news RSS/Atom: https://www.ncsc.gov.ie/news/ | Current advisory cards: publish date, affected product/CVE where provided, action and link. | Strong candidate for a feed. Advisories are not a complete incident database and do not establish household compromise or local attack rates. |
| National cyber risk context | NCSC National Cyber Risk Assessment: https://www.ncsc.gov.ie/ncra/ | Chatbot grounding for systemic cyber risk and cross-sector dependencies. | Curated, dated report rather than a live feed. Keep assessment date prominent and separate it from current threat advisories. |
| EU cyber threat evidence | ENISA Threat Landscape 2025: https://www.enisa.europa.eu/publications/enisa-threat-landscape-2025 ; EU 2026 State of Cybersecurity report: https://op.europa.eu/en/publication-detail/-/publication/85c97faa-de49-11f1-ba80-01aa75ed71a1/language-en | Explain observed threat patterns, AI's role, and why cross-sector resilience matters. | ENISA analysed 4,875 selected incidents from 1 July 2024 to 30 June 2025; its report describes phishing as 60% of reported intrusion entry points. These are curated EU incident data, not a census or household risk estimate. Do not compare totals with later reports unless periods and methods align. The EU's 2026 report says AI can amplify conventional cyber methods and accelerate vulnerability discovery/exploitation; this supports changing capability, not a claim that AI caused a measured rise in attacks. |
| Energy-sector cyber incident example | Polish government summary: https://www.gov.pl/web/primeminister/poland-stops-cyberattacks-on-energy-infrastructure ; CERT Polska incident report: https://www.gov.pl/attachment/e2cdb4be-0542-4435-948c-957b51453b6e | Show that energy systems have been targeted and containment/defences matter. | Coordinated attacks in Poland on 29 December 2025 targeted renewable-energy operators and CHP plants; the national power supply was not disrupted. This is a documented event in another country, not evidence of an Irish attack or typical probability. The cited report does not attribute the event to AI. |
| Cash preparedness context | European Commission 72-hour self-sufficiency guidelines: https://ec.europa.eu/echo/files/policies/preparedness/guidelines_preparedness_selfsufficiency.pdf ; Ireland's Be Emergency Ready booklet: https://assets.gov.ie/static/documents/bec7e0b9/JAV16262_OEP_Preparedness_Campaign_Accessible_EN_V3.pdf | Include a modest cash reserve among optional household preparations. | EU guidance recommends a cash reserve and an offline payment method where available; Ireland's booklet lists cash and cards as items to bring if evacuating. No authority cited here specifies a required amount. Do not imply payment cards will function if networks are unavailable. |
| National risk context | Government National Risk Assessment: https://www.gov.ie/en/department-of-the-taoiseach/policy-information/national-risk-assessment-2024-overview-of-strategic-risks/ | Explain why selected hazards merit preparedness attention at national level. | Curated publication. National-level assessment is context, not a household probability estimate or live trigger. Check for newer editions before release. |
| Water supply/quality | Uisce Éireann supply and service map: https://www.water.ie/water-service-updates and open-data page: https://www.water.ie/open-data | Show open provider listings for the selected county, including supply interruptions and selected water-quality notices, with check time, attribution and official links. The Water Supply Zones dataset can add geographic context later. | READY72 currently queries the public ArcGIS FeatureServer layer used by the provider's map for approved, open records. This works as a prototype connection, but the official Open Data page does not explicitly document the live layer's reuse terms or guarantee a stable public API. Keep it marked WIP. Uisce Éireann says not all supply issues are immediately visible. The returned records are not household-level confirmation. Do not collect Eircode or phone number in READY72 to replicate its text-alert service. |
| Fire danger | Teagasc Forest Fire Risk (current condition, information provided by DAFM): https://teagasc.ie/crops/forestry/forest-fire-risk/ ; DAFM Fire Management notices: https://www.gov.ie/en/department-of-agriculture-food-and-the-marine/publications/fire-management/ | Let users check the current forest fire-risk condition, official notices and fire-safety guidance. | READY72 links directly to the current Teagasc/DAFM rating and DAFM notice page. Rating is for forest fire-risk conditions, not a household or county-specific wildfire prediction. No separate machine-readable feed was verified. |
| Transport | TII Traffic live map: https://traffic.tii.ie/ ; TII Open Data Portal: https://data.tii.ie/ | Give users access to live national-road incidents, roadworks, weather events and travel information. | READY72 links to TII’s live map; no supported public incidents API was verified for direct import. TII Open Data describes real-time ITS/DATEX II datasets under CC BY 4.0, but map coverage is the national road network and does not cover every local road. |
| Preparedness guidance | Office of Emergency Planning Be Emergency Ready: https://www.gov.ie/en/office-of-emergency-planning/campaigns/be-emergency-ready/ | Main source for the checklist, household plan, community connection, emergency contacts and chatbot answers. | Curated official content; keep version and review date. The chatbot should cite exact source passages and link to the booklet. |
| Household readiness self-check | Ireland's Be Emergency Ready booklet and EU 72-hour self-sufficiency guidance | Eight self-reported prompts return a transparent 0–16 checklist snapshot and link recommendations to the kit builder or plan. | Prototype self-check only; not an official risk score, validated assessment, prediction or guarantee of safety. Point bands are simple product labels, not evidence-based categories. Answers are held in page memory only and are not transmitted or stored. Review question wording and accessibility with users before treating findings as evaluated UX. |
| Utility/hazard guidance | Met Éireann, OPW, ESB Networks, Uisce Éireann, NCSC, local authorities and emergency services | Action guidance for storms, flooding, outages, cyber advisories and evacuation. | Curated, versioned source library. Prefer primary guidance. Where advice conflicts or is incomplete, defer to the issuing authority and emergency services. |
| Geography/reference data | Met warning-area codes; OPW station GeoJSON coordinates; suitable official county/administrative boundaries to be selected. | Map warnings and observations to a user-selected county/area without requiring precise address data. | Boundary source and licence still to be selected. Avoid storing exact Eircode/location for the first version. |

## Current prototype integration status

### Live feeds included in the prototype

1. Met Éireann warning JSON for current official weather warnings.
2. OPW latest-level GeoJSON for river observations, with permitted station filtering and attribution.
3. NCSC RSS/Atom for current cyber advisories.
4. ESB PowerCheck public web-client endpoint, displayed as WIP pending confirmation of third-party access and reuse terms.
5. Uisce Éireann public ArcGIS layer used by its service map, displayed as WIP pending confirmation of live-layer reuse terms and stability.
6. Met Éireann 2016–2025 rainfall grids used for exploratory analysis; data-quality review is required before drawing strong conclusions.
7. Official risk assessments and Be Emergency Ready guidance in the chatbot’s curated knowledge base.

### Source links and extensions still requiring validation

- ESB PowerCheck for authoritative address-level electricity outage confirmation; READY72's experimental map is not a replacement for the official service.
- Uisce Éireann's official map and text-alert service for authoritative local water status; READY72's WIP map query can omit issues and does not confirm a household's supply.
- DAFM fire danger notices.

Use a clear status such as “Open official live map” and do not show a READY72-generated outage/notice status until a reliable, permitted source connection exists.

## Provider-specific integration check — ESB Networks and Uisce Éireann

### ESB Networks

- PowerCheck is the official source for current major faults, service interruptions and estimated restoration times.
- ESB's official PowerCheck guidance confirms that its map/list displays current service interruptions and estimated restore information.
- READY72 has a WIP server-side connection using the public web-client endpoint/key identified during exploration. This is not an ESB-issued READY72 credential or confirmed developer integration.
- The 2024 Distribution Annual Performance Report contains retrospective storm-day performance data suitable for a carefully labelled context panel, not a live feed or household prediction.
- **READY72 decision:** keep the connector labelled WIP, show its last check and limitations, and retain the “Open ESB PowerCheck” route for authoritative area-level confirmation. Confirm supported access, quotas, terms and attribution before external publication. Never put the key in browser JavaScript.

### Uisce Éireann

- Uisce Éireann has a public Supply & Service Updates map and a free customer text-alert service. The map's page configuration identifies a public ArcGIS FeatureServer layer (`WaterAdvisoryCR021_DeptView`) and queries approved, open records. READY72 now reads those records server-side and filters the provider's `COUNTY` field to the selected county; records include outages, boil-water notices, do-not-consume notices, reduced pressure, restrictions and discolouration flags.
- The official map query is accessible without a separate account and is the data source rendered by Uisce Éireann's own map. The Uisce Éireann Open Data page says most datasets use CC BY 4.0, but does not explicitly document the live map layer's reuse terms or guarantee this as a stable public API. Keep this connector marked WIP pending confirmation of reuse terms and supported access.
- Water Supply Zones provide geographic supply context, not live incident records. Historical drinking-water quality test results are available on a separate official search page and are not currently imported into READY72.
- The site says not all supply issues are immediately visible, so READY72 must label any provider-reported list as information known to Uisce Éireann, not as a guarantee that no local issue exists.
- An official September 2026 Uisce Éireann incident report describes a power interruption at Springmount Water Treatment Plant that disrupted treatment and affected approximately 2,000 customers in the Cashel area. This is a useful example of service dependency, not a representative statistic.
- **READY72 decision:** the prototype displays approved, open records from the public map layer used by Uisce Éireann, with provider attribution, selected-county filtering, check time, and an explicit caveat that provider listings are not household-level confirmation and may not show every issue. Keep the connector marked WIP until reuse terms/stability are confirmed; retain official map and water-quality links for verification and historical test results. The revised chatbot route retrieves these county-filtered notices for water questions when the updated server is running.
- Do not collect Eircode or phone number for the provider’s alert service; send users directly to Uisce Éireann if they choose to sign up.

### Integration acceptance checks

Before either source appears as a live READY72 status, confirm written terms/access, test timestamps and update frequency, define stale-feed behavior, preserve provider wording and links, and keep a visible route to the official status page. If a feed fails, show “Unable to check this provider just now” rather than “no outage.”

## Preparedness context and data-story boundary

- Ireland's Be Emergency Ready booklet recommends a 72-hour supply of non-perishable food and 2–3 litres of drinking water per person per day. EU 2026 population-preparedness guidance sets at least 72 hours as a minimum baseline and explains that response systems may be under pressure while logistics and assistance scale up. This is not an outage-duration prediction or a ceiling.
- Ireland's National Risk Assessment and the NCSC's 2025 National Cyber Risk Assessment discuss severe weather, energy security, cyber risk, supply chains and cross-sector dependencies. These are national strategic context, not personal risk scores or evidence that a specific emergency is imminent.
- Ireland's NCSC 2025 assessment says intensified digital reliance increases cyber incident risk and warns of potential cascading impacts across connected essential sectors, including energy. The EU's 2026 State of Cybersecurity report describes AI as a force multiplier that can speed vulnerability discovery/exploitation. ENISA's 2025 dataset offers measured EU-scale evidence (4,875 selected incidents, phishing 60% of identified intrusion entry points); its sample is not a complete attack count and is not comparable with differently scoped annual reports. Together, these sources support taking resilience seriously; they do not establish that an AI-enabled attack on Ireland's electricity grid is imminent or that AI alone caused an increase in attacks.
- A Polish government report describes coordinated cyberattacks on renewable-energy operators and combined heat and power facilities on 29 December 2025; it reports no disruption to national electricity supply. Use it as an example that energy assets can be targeted and defenses can contain incidents, not as a prediction for Ireland. The source does not attribute the incident to AI.
- Cash guidance is supported by the European Commission's 2026 72-hour self-sufficiency guidelines, which include cash and recommend a reserve plus an offline payment option where available, and Ireland's Be Emergency Ready booklet, which lists cash and debit/credit cards among evacuation items. READY72 asks users to consider a modest, affordable amount; it does not prescribe a sum or imply that a payment card will work during a network outage.
- The 2016–2025 rainfall grid alone does not show whether floods are increasing. READY72's proposed next analysis is a catchment-aware comparison of rainfall with OPW reference-gauge records, using the Past Flood Events archive as additional context only where record quality, coverage and reuse permission allow. See `READY72-Rainfall-Flood-Study.md` for the method and limits.

### Tier 3 — expansion after initial validation

- TII real-time ITS data for national roads.
- OPW flood hazard/risk datasets where access and licences are suitable.
- Local authority road closures, emergency notices and community resources, if there is a maintained source per area.
- Public health advisories, only where a clear preparedness use and authoritative current feed are identified.

## Data connection record to keep for every source

- Publisher and primary source URL
- Data format/interface and authentication requirements (never commit secrets)
- Licence, attribution wording and any reuse restrictions
- Geographic and time coverage
- Update cadence and expected freshness
- Last successful retrieval and record count
- Validation rules, missingness and outlier handling
- Failure/stale-data display behaviour
- Whether it supports a current alert, an observation, historical analysis, or general explanation

## Key distinction for the chatbot

Every factual answer should identify whether it is based on:

1. An active official alert/advisory;
2. A current provider service update;
3. An observed measurement;
4. A historical dataset or report;
5. General official preparedness advice.

Do not blend these into one “risk score.” Cite and timestamp the evidence, explain uncertainty, and state what the source cannot establish.

| Climate evidence / scenario context | EPA National Climate Change Risk Assessment 2025: https://www.climateireland.ie/media/epa-2020/monitoring-amp-assessment/climate-change/climate-ireland/EPA_NCCRA_Technical-Report_Published_July_2025-%28amended%29.pdf | Put the ten-year rainfall grid in historical context; explain plausible mid-century changes to maximum five-day rainfall and why flexible preparedness is useful. | EPA finds heavier-rain intensity increasing in parts of Ireland but no persistent trend in annual totals or consecutive wet days. Mid-century maximum five-day rainfall projection is roughly +7% under two scenarios, but ranges span decreases and increases; EPA rates confidence low. Scenario averages are not dated event or household forecasts. Do not calculate an individual risk probability. |

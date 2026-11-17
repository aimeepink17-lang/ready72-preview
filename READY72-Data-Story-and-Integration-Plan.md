# READY72 — Data Story and Live Source Integration Plan

## The story to tell

**How can Irish households understand the knock-on effects of disruption to essential services, and what can data show about preparing for the initial response period?**

The project should explain the reason for preparedness without suggesting a particular emergency is imminent. Ireland's *Be Emergency Ready* booklet recommends preparing to support household needs for 72 hours. Recent EU guidance describes the initial response period as a time when responders may be under pressure while they assess needs and scale logistics. The baseline is about practical self-sufficiency and response capacity; it is not a claim that outages usually end within three days.

Irish national risk assessments discuss extreme weather, energy security, cybersecurity and critical supply-chain disruption. Ireland's 2025 National Cyber Risk Assessment also describes potential cascading effects across connected sectors. These are reasons for an all-hazards resilience approach, not household-level probability estimates.

## Evidence already available

| Evidence | What it can show | Limit |
|---|---|---|
| Met Éireann daily rainfall grids, 2016–2025 | A ten-year spatial and temporal profile at 1 km grid resolution: 70,091 grid points per year and roughly 256 million potential grid-point days. The current analysis finds a median grid-cell count of 72 days at or above 20 mm over ten years; the 90th percentile is 164 days and the 99th percentile is 280. | Interpolated rainfall estimates are not household measurements, flood events, warnings or forecasts. Thresholds are descriptive, not official safety thresholds. The 3 October 2016 grid day and 51 negative 2022 values are excluded from the relevant summaries and documented in QA. |
| ESB Networks Distribution Annual Performance Report 2024 | More than 1.4 million storm-day customer-outage records were analysed for 2024. ESB reported 90.9% of storm-day customers restored within 24 hours of the initial estimated restoration time and 9.1% more than 24 hours after that initial estimate. | This is an annual, provider-reported measure of performance against the initial estimate, not a promise or a complete distribution of actual outage durations. Do not turn it into a claim that 9.1% of outages lasted more than a day or infer the chance a particular household loses power. |
| Uisce Éireann report on Springmount/Cashel, September 2026 | An interruption to power at a water-treatment plant disrupted treatment and affected approximately 2,000 customers. This is a concrete example of an electricity-to-water dependency. | One incident is an illustrative case, not a representative rate or a forecast. |
| Current Met Éireann, OPW and NCSC sources already used by READY72 | Current weather warnings, observed river levels and published cyber advisories. | These are different evidence types and must remain separately labelled. A river reading is not a flood warning; a cyber advisory is not evidence that a household was attacked. |

### Big-data development

Keep the rainfall analysis as the reproducible big-data core, but do not present expected winter seasonality as the main insight. Across 2016–2025, the annual share of valid grid-point days meeting the descriptive 20 mm/day comparison threshold fluctuates from 1.72% in 2016 (after the suspect grid day is excluded) to 3.27% in 2023; ten annual observations do not establish a trend. These are shares of interpolated grid-point days, not flood counts or household risks. The stronger research question is whether intense or sustained rainfall is associated with elevated river levels or recorded flood events in the same catchments. See `READY72-Rainfall-Flood-Study.md` for the proposed analysis and data constraints.

The evidence page should make the analysis easier to explore by showing:

1. **Scale:** grid-point days processed, with the quality exclusions disclosed.
2. **Time:** annual and seasonal comparisons at three descriptive thresholds (10, 20 and 30 mm/day), with the seasonal view explicitly treated as context rather than a novel finding.
3. **Place:** an Ireland-wide historical grid view and a distribution of grid-cell counts, with a clear note that 1 km interpolated cells are not property-level exposure.
4. **Service consequences:** pair the weather context with the ESB annual performance figures and the Uisce Éireann power-to-water case study as separate evidence panels.
5. **Flood outcomes:** the rainfall grids do not contain flood events. To test rainfall/flood association, use continuous OPW gauge records for comparison periods and the Past Flood Events archive for event context, subject to archive coverage and reuse permissions. To answer whether floods are increasing, obtain a consistent historical flood occurrence or impact dataset and compare geographic/time coverage and definitions. Do not equate heavy rainfall with flooding.
6. **A joined event study only if** ESB and Uisce Éireann provide sufficiently detailed, reusable, dated incident records. Rainfall grids and annual aggregate reliability statistics alone cannot establish that a rainfall event caused a specific outage.

The narrative can then be: **hazard information → connected services → household consequences → practical preparation**. Avoid a single composite risk score or dramatic international comparisons that use incompatible definitions.

## Live provider access status

| Provider | What is officially available | READY72 position |
|---|---|---|
| ESB Networks | PowerCheck provides a real-time public map/list of service interruptions and estimated restoration information. Official guidance directs customers there. ESB also publishes annual distribution performance reports. | The official public pages reviewed do not document a supported developer API or third-party data-reuse terms. Keep the official link in READY72. Ask ESB Networks for an approved feed/API, credentials, terms, rate limits and historical incident data before implementing a live connector. Do not scrape an undocumented endpoint or put a key in browser code. |
| Uisce Éireann | The Supply & Service Updates map publishes provider-known service issues; a separate free SMS service sends area-specific notices to subscribers. Its Open Data page provides a Water Supply Zones dataset under CC BY 4.0, but that is geographic supply context, not a live outage feed. | No documented public machine-readable live incident API was found in the official material reviewed. Keep the map link, and ask Uisce Éireann/OpenData@water.ie for a supported incident feed and reuse terms. Do not collect a user's Eircode or phone number or imitate the provider's private notification service. |

### Data request fields to ask each provider for

- Stable incident ID; planned/unplanned or incident category; current status.
- Affected area and the location precision allowed for public display.
- Start, last-updated, estimated-restoration and resolved timestamps, including the time zone.
- Impact measure (for example customers affected), its definition and whether it is a count or an estimate.
- Source URL/deep link, update frequency, expected latency and outage/stale-data behaviour.
- API/feed documentation, authentication method, usage quotas, caching rules, attribution, licence and permission for public display and historical analysis.
- Whether anonymised historical event records can be supplied for research, including storm-day classification and definitions.

## Implementation after access is confirmed

Use server-side provider adapters; never expose provider credentials in the browser. Normalize each source to a small common record while preserving provider language and source links:

```text
source, checkedAt, incidentId, category, status, affectedArea,
startedAt, updatedAt, estimatedRestoreAt, impactMeasure, sourceUrl
```

Refresh only at the interval and volume allowed by each provider. Show the source check time and stale/unavailable state. A failed feed must never appear as “no outage.” Store historical snapshots only if the provider's terms permit retention and analysis. Keep exact browser geolocation on-device; only the selected county or supported coarse area should be sent to READY72.

### Next integration steps

1. Request supported access and historical-data terms from ESB Networks and Uisce Éireann; no request has been sent yet.
2. While access is pending, retain official live-service links and use only already published reports and official incident notices for the evidence story.
3. Once access is approved, build one provider adapter at a time and document the response schema, update cadence, licence and failure cases.
4. Record permitted snapshots to build a time-series dataset; then evaluate whether incident-level rainfall/service comparisons are valid.

## Carefully chosen non-Irish context

The European Commission's Joint Research Centre Risk Data Hub provides harmonised European disaster-loss and risk information and an API. It could support a small, clearly labelled European-context view, but it measures disaster losses and risk rather than household utility-outage duration. Keep its measures separate from Irish utility data. EM-DAT can add worldwide event context if access and terms are suitable, but its own documentation describes country-level event data and reporting/coverage limitations; it should not be used to claim local Irish household risk.

## Source references

- Government of Ireland, [Be Emergency Ready booklet](https://assets.gov.ie/static/documents/bec7e0b9/JAV16262_OEP_Preparedness_Campaign_Accessible_EN_V3.pdf)
- Council of the European Union, [Guidelines on reaching a population self-sufficiency of a minimum of 72 hours](https://data.consilium.europa.eu/doc/document/ST-15243-2026-INIT/en/pdf)
- European Commission, [Preparedness Union Strategy](https://civil-protection-humanitarian-aid.ec.europa.eu/news-stories/news/eu-preparedness-union-strategy-prevent-and-react-emerging-threats-and-crises-2025-03-26_en)
- Ireland's [National Risk Assessment 2024 overview](https://www.gov.ie/en/department-of-the-taoiseach/policy-information/national-risk-assessment-2024-overview-of-strategic-risks/)
- NCSC, [National Cyber Risk Assessment 2025](https://www.ncsc.gov.ie/ncra/)
- ESB Networks, [Distribution Annual Performance Report 2024](https://media.esbnetworks.ie/media/docs/default-source/publications/distribution-annual-performance-report-2024.pdf)
- ESB Networks, [PowerCheck guidance](https://www.esbnetworks.ie/services/power-outages/check-my-power-status/powercheck-guidelines)
- Uisce Éireann, [Open Data and reuse terms](https://www.water.ie/open-data), [Supply & Service Updates](https://www.water.ie/water-service-updates), and [Springmount/Cashel incident report](https://www.watersupplyproject.ie/index.php/news/crews-working-restore-supply-cashel-and-surrounding-areas)
- European Commission JRC, [Risk Data Hub](https://drmkc.jrc.ec.europa.eu/risk-data-hub/) and [Disaster Losses dataset](https://doi.org/10.2905/JRC.DSZ3GW0)
- EM-DAT, [data accessibility and limitations](https://doc.emdat.be/docs/data-accessibility/)

## Past evidence and plausible futures — interpretation guardrails (16 November 2026)

READY72 now distinguishes three evidence layers in the dashboard:

- **Observed:** EPA's 2025 National Climate Change Risk Assessment reports increasing intensity of heavy rainfall in parts of Ireland, notably the east and southeast, while finding no persistent trend in annual totals or consecutive wet days. This is a mixed, location-sensitive signal, not a blanket claim that Ireland is becoming wetter in every sense.
- **Modelled:** the same EPA assessment projects approximately +6.7% (RCP4.5) and +6.9% (RCP8.5) change in maximum five-day rainfall around mid-century relative to 1976–2005. The reported ranges are −4.1% to +18.9% and −3.1% to +18.0%; EPA confidence is low. These are scenario-based climate averages, not forecasts for a named storm or year.
- **Preparedness implication:** EPA identifies extreme wind damage and disruption to energy and communications among urgent risks and describes cascading impacts across sectors. Together with documented Irish service incidents, this supports planning for a range of plausible interruptions. It cannot establish that a specific household will be affected or that an event is imminent.

The website must not turn these data into a deterministic forecast, a household probability, or a single risk score. Keep the 2016–2025 rainfall grid as the reproducible big-data analysis; label its ten-year scope and do not call it climate-trend evidence by itself. The longer historical observation and future scenario statements are attributed to EPA's assessment. Explain uncertainty in plain language wherever the projection appears.

Sources: EPA [National Climate Change Risk Assessment technical report](https://www.climateireland.ie/media/epa-2020/monitoring-amp-assessment/climate-change/climate-ireland/EPA_NCCRA_Technical-Report_Published_July_2025-%28amended%29.pdf); [Climate Ireland projections FAQ](https://www.climateireland.ie/data-explorer/faqs/); EPA [assessment summary](https://www.epa.ie/news-releases/news-releases-2025/major-new-epa-report-assesses-irelands-vulnerability-to-climate-change-impacts.php).

# READY72 — Rainfall and Flood Association Study

## Research question

Across Irish catchments with adequate records, are days with heavier or sustained rainfall associated with higher river levels or OPW-recorded flood events in the following 1–5 days?

This asks about association. Rainfall alone does not cause every flood: catchment shape, soil saturation, land cover, river levels, drainage, coastal tides and flood defences also matter.

## Why this is stronger than the current rainfall-only story

The existing Met Éireann analysis processes 2016–2025 daily 1 km rainfall grids, but it has no flood outcome variable. Its ten-year window cannot establish a long-term climate trend, and normal seasonal differences are not a useful headline finding. Joining rainfall to observed hydrology gives the project an outcome to examine and a clearer preparedness story: how weather can combine with local conditions to create pressure on a connected service.

## Candidate data

| Source | Possible role | Important limitation |
|---|---|---|
| Met Éireann daily rainfall grids | Calculate 1-, 3- and 5-day rainfall for cells or catchments. Available annually from 1941 and interpolated to a 1 km grid. | Estimates, not measurements in every cell. A catchment average needs a defensible catchment boundary and coordinate handling. |
| OPW Hydrology Reference Network | Candidate response dataset: time-series river levels at selected gauges plus OPW-defined thresholds/status for flood or drought monitoring. Its published CSV is under CC BY 4.0. | Confirm the available historical time span, completeness, thresholds and station changes before finalising the sample. Gauge levels are local response indicators, not a complete national flood catalogue. |
| OPW Past Flood Events archive | Independently check and describe notable dated flood reports and their locations/quality grades. | OPW says the archive is not comprehensive; locations can be approximate and records vary in quality. The open-spatial catalogue lists Past Flood Event Points with CC BY-NC-ND terms, so request permission before transforming them into a published statistical dataset. |
| OPW hydrometric rainfall gauges | Possible station-level rainfall comparison or sensitivity check. | The open dataset describes readings as unchecked and warns that many sites are non-conventional; do not use as the only rainfall measurement without quality assessment. |

## Proposed method

1. Select a small set of OPW reference gauges with documented history, clear thresholds and usable daily/hourly records.
2. Obtain the corresponding upstream catchment polygons or another OPW-approved spatial unit. Do not use an arbitrary radius around the gauge as a substitute for a catchment.
3. Aggregate Met Éireann daily grid estimates over each catchment. Derive daily total, rolling 3-day total and rolling 5-day total; include a threshold sensitivity analysis rather than treating 20 mm as an official warning threshold.
4. Define hydrological response before looking at results: for example, an OPW-defined high-flow/threshold exceedance, a marked gauge rise, or a dated flood record. Keep these outcomes distinct.
5. Compare rainfall on response days and the preceding 1–5 days with seasonally and catchment-matched non-response periods. If records support it, use lagged association or logistic models with catchment and season effects; report effect sizes and uncertainty, not just a p-value.
6. Run sensitivity checks for rainfall thresholds, event quality grades, missing gauge periods and known extreme events. Publish the data coverage and exclusions alongside the results.

## Interpretation limits

- A correlation would show that rainfall and a hydrological response co-occur more often in the sampled records. It would not prove that rainfall alone caused a flood.
- Missing flood reports are not evidence that no flood happened. Because the OPW archive is not comprehensive, do not use every unrecorded date as a confirmed “no flood” without an independent outcome source.
- A small gauge sample cannot represent every Irish catchment or household.
- A 2016–2025 association study cannot show that climate change caused an increase. For trend claims, analyse a longer, consistently defined record and compare with EPA/Met Éireann climate assessments.
- The OPW flood-event point licence must be clarified before deriving or publishing statistical outputs from it.

## What READY72 can responsibly say if supported

“In the catchments and years with usable records, heavier recent rainfall was associated with [measured river response]. The size and timing varied by catchment. This is historical association, not a forecast. It helps explain why households near local flood pathways should know their official warning sources and have a practical plan.”

Do not fill the bracketed finding until the analysis has been run and independently checked.

## Primary source references

- Met Éireann, [Daily Grids](https://clidata.met.ie/cli/grids_daily/)
- OPW, [Past Flood Events database and quality/completeness notes](https://www.floodinfo.ie/past-flood-events/)
- OPW, [Assessment of Flood Risk Management](https://www.gov.ie/en/office-of-public-works/frm-pages/assessment-of-flood-risk-management/)
- OPW, [Open Spatial Data Portal catalogue](https://www.floodinfo.ie/open-spatial-data-portal/data-catalogue/)
- data.gov.ie, [OPW Hydrology Reference Network](https://data.gov.ie/dataset/opw-hydrology-reference-network)
- data.gov.ie, [OPW rainfall gauges, full-record high-resolution data](https://data.gov.ie/dataset/hydrodata-rainfall-complete-high-res-total)
- OPW, [Flood-risk data requests](https://www.gov.ie/en/office-of-public-works/organisation-information/open-data-2/)

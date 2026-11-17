"""Create a self-contained, pre-populated Jupyter notebook for READY72."""
from __future__ import annotations

import csv
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
profile_path = HERE / "annual_profile_validated.csv"
with profile_path.open(newline="", encoding="utf-8") as handle:
    profile = list(csv.DictReader(handle))

def markdown(source):
    return {"cell_type": "markdown", "metadata": {}, "source": source.splitlines(True)}

def code(source, outputs=None, execution_count=None):
    return {"cell_type": "code", "execution_count": execution_count, "metadata": {},
            "outputs": outputs or [], "source": source.splitlines(True)}

cols = [
    ("year", "Year"),
    ("grid_days_ge_20mm", "Grid-point days ≥20 mm"),
    ("pct_grid_point_days_ge_20mm", "Share of valid grid-point days ≥20 mm"),
    ("invalid_negative_values", "Negative values excluded"),
    ("excluded_suspect_grid_day_values", "Grid values omitted for QA"),
]
table = "| Year | Grid-point days ≥20 mm | Share of valid grid-point days ≥20 mm | Negative values excluded | Grid values omitted for QA |\n|---:|---:|---:|---:|---:|\n"
for row in profile:
    table += f"| {row['year']} | {int(row['grid_days_ge_20mm']):,} | {float(row['pct_grid_point_days_ge_20mm']):.2f}% | {int(row['invalid_negative_values'])} | {int(row['excluded_suspect_grid_day_values']):,} |\n"

values = [float(row["pct_grid_point_days_ge_20mm"]) for row in profile]
years = [row["year"][-2:] for row in profile]
width, height, left, top, chart_w, chart_h = 720, 300, 54, 28, 632, 210
max_value = max(values) * 1.16
bar_w = 38
gap = (chart_w - len(values) * bar_w) / (len(values) - 1)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Annual share of valid 1 km grid-point days with at least 20 millimetres of rainfall">']
svg += ['<rect width="100%" height="100%" fill="#f5f8f4"/>']
for tick in range(0, 5):
    y = top + chart_h - chart_h * tick / 4
    val = max_value * tick / 4
    svg.append(f'<line x1="{left}" y1="{y:.1f}" x2="{left+chart_w}" y2="{y:.1f}" stroke="#d9e4df"/><text x="{left-9}" y="{y+5:.1f}" text-anchor="end" font-family="Arial" font-size="13" fill="#53665d">{val:.1f}%</text>')
for i, (value, year) in enumerate(zip(values, years)):
    x = left + i * (bar_w + gap)
    bar_h = chart_h * value / max_value
    y = top + chart_h - bar_h
    svg.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_w}" height="{bar_h:.1f}" rx="4" fill="#1e8272"/><text x="{x+bar_w/2:.1f}" y="{top+chart_h+24}" text-anchor="middle" font-family="Arial" font-size="13" fill="#53665d">{year}</text>')
svg.append('<text x="360" y="288" text-anchor="middle" font-family="Arial" font-size="12" fill="#53665d">Calendar year (2016–2025)</text></svg>')
svg_output = {"data": "\n".join(svg), "metadata": {}, "output_type": "display_data"}

table_output = {"data": {"text/markdown": [table]}, "metadata": {}, "output_type": "display_data"}
profile_code = code(
    "from pathlib import Path\nimport pandas as pd\nfrom IPython.display import display, Markdown\n\nanalysis_dir = Path.cwd()\nif not (analysis_dir / 'build_rainfall_profile.py').exists():\n    analysis_dir = Path('outputs/READY72/analysis')\n\n# Rebuild the annual profile directly from the ten source files.\nimport runpy\nrunpy.run_path(str(analysis_dir / 'build_rainfall_profile.py'))\nprofile = pd.read_csv(analysis_dir / 'annual_profile_validated.csv')\ncolumns = ['year','grid_days_ge_20mm','pct_grid_point_days_ge_20mm','invalid_negative_values','excluded_suspect_grid_day_values']\nview = profile[columns].round(2)\nheader = '| Year | Grid-point days ≥20 mm | Share of valid grid-point days ≥20 mm | Negative values excluded | Grid values omitted for QA |'\nseparator = '|---:|---:|---:|---:|---:|'\nrows = ['| ' + ' | '.join(str(value) for value in row) + ' |' for row in view.itertuples(index=False, name=None)]\ndisplay(Markdown('\\n'.join([header, separator, *rows])))\n",
    outputs=[table_output], execution_count=1)

notebook = {
    "cells": [
        markdown("# READY72 | Historical rainfall, used carefully\n\n**DataStory capstone analysis draft**  \n**Question:** What does Ireland’s 2016–2025 daily rainfall grid say about the distribution of heavier rainfall days, and what limits should READY72 show before using historical data to explain preparedness?\n\n**Decision supported:** Use historical rainfall as clearly labelled context, not as a live warning, flood forecast, household risk score or proof that a particular home is exposed. Prioritise live official alerts and observations separately.\n\nThis notebook is a reproducible working analysis. It is not a substitute for the assessment rubric, and its conclusions should be checked against the final course brief."),
        markdown("## Data and method\n\nThe analysis uses ten annual Met Éireann CSV.GZ files for 2016–2025. Each file contains daily rainfall on a 1 km Irish Grid (TM65) surface. Values are stored without a decimal point: **39 means 3.9 mm**. The grid is interpolated from station observations; the number and locations of reporting stations vary over time. Met Éireann retains intellectual property and asks users to acknowledge it.\n\nThe chosen descriptive cut-off is **≥20 mm at a grid point on a calendar day**. This is an analyst-selected comparison threshold, not an official warning, flood or safety threshold. Denominators include valid non-negative grid-point days only. Negative values are excluded as physically invalid rainfall; no missing values were found in the examined files.\n\nSource and units: [Met Éireann daily grids](https://clidata.met.ie/cli/grids_daily/)."),
        markdown("## Rebuild the profile\n\nRun this notebook from the `analysis` folder, or from the READY72 project root. The companion script streams through each compressed annual file, records data checks, creates annual summaries and counts threshold days per grid cell. The 2016 date flagged below is omitted from the primary comparison pending clarification; it remains in the original source file and is recorded for sensitivity review."),
        profile_code,
        markdown("## Annual comparison\n\nThe percentage is the share of valid **grid-point days** at or above the selected threshold, not the percentage of Irish days, households, people or land area affected. The profiles are descriptive and do not establish a trend or future risk."),
        code("columns = ['year','grid_days_ge_20mm','pct_grid_point_days_ge_20mm','invalid_negative_values','excluded_suspect_grid_day_values']\nview = profile[columns].round(2)\nheader = '| Year | Grid-point days ≥20 mm | Share of valid grid-point days ≥20 mm | Negative values excluded | Grid values omitted for QA |'\nseparator = '|---:|---:|---:|---:|---:|'\nrows = ['| ' + ' | '.join(str(value) for value in row) + ' |' for row in view.itertuples(index=False, name=None)]\ndisplay(Markdown('\\n'.join([header, separator, *rows])))", outputs=[table_output], execution_count=2),
        code("from IPython.display import display, SVG\nvalues = profile['pct_grid_point_days_ge_20mm'].tolist()\nyears = profile['year'].astype(str).str[-2:].tolist()\nwidth, height, left, top, chart_w, chart_h = 720, 300, 54, 28, 632, 210\nmax_value = max(values) * 1.16\nbar_w = 38\ngap = (chart_w - len(values) * bar_w) / (len(values) - 1)\nsvg = [f'<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" viewBox=\"0 0 {width} {height}\" role=\"img\" aria-label=\"Annual share of valid 1 km grid-point days with at least 20 mm of rainfall\">', '<rect width=\"100%\" height=\"100%\" fill=\"#f5f8f4\"/>']\nfor tick in range(5):\n    y = top + chart_h - chart_h * tick / 4\n    val = max_value * tick / 4\n    svg.append(f'<line x1=\"{left}\" y1=\"{y:.1f}\" x2=\"{left+chart_w}\" y2=\"{y:.1f}\" stroke=\"#d9e4df\"/><text x=\"{left-9}\" y=\"{y+5:.1f}\" text-anchor=\"end\" font-family=\"Arial\" font-size=\"13\" fill=\"#53665d\">{val:.1f}%</text>')\nfor i, (value, year) in enumerate(zip(values, years)):\n    x = left + i * (bar_w + gap)\n    bar_h = chart_h * value / max_value\n    y = top + chart_h - bar_h\n    svg.append(f'<rect x=\"{x:.1f}\" y=\"{y:.1f}\" width=\"{bar_w}\" height=\"{bar_h:.1f}\" rx=\"4\" fill=\"#1e8272\"/><text x=\"{x+bar_w/2:.1f}\" y=\"{top+chart_h+24}\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"13\" fill=\"#53665d\">{year}</text>')\nsvg.append('<text x=\"360\" y=\"288\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"12\" fill=\"#53665d\">Calendar year (2016–2025)</text></svg>')\ndisplay(SVG('\\n'.join(svg)))", outputs=[svg_output], execution_count=3),
        markdown("## Data-quality review and sensitivity\n\nTwo checks materially affect interpretation:\n\n1. **2016-10-03:** the raw rainfall grid contains a maximum of **286.7 mm** and **232 grid points above 167.1 mm** on this date. Met Éireann lists 167.1 mm at Killarney as the highest observed daily rainfall in 2016, on 3 October, and describes October 2016 as predominantly dry and settled. A grid estimate and a station observation are different products, so this does not prove the grid is wrong. The broad grid peak conflicts strongly enough with the reference evidence that all 70,091 values for that date are excluded from the main 2016 profile pending clarification. This is an explicit sensitivity choice, not a silent correction.\n2. **2022:** 51 negative rainfall values occur in the file. Rainfall cannot be negative; these entries are excluded from denominators and threshold counts. The values are retained in the quality summary rather than reinterpreted as zero.\n\nReferences: [Met Éireann rainfall records](https://www.met.ie/index.php/climate/weather-extreme-records) and [October 2021 statement describing recent October conditions](https://www.met.ie/climate-statement-for-october-2021)."),
        markdown("## What the spatial summary can and cannot say\n\nThe script counts, for every grid cell, how many of the 2016–2025 valid days met the 20 mm cut-off. The resulting median is **72 grid-cell days across ten years**; the 90th percentile is **164**, and the 99th percentile is **280**. Cells have a 1 km grid resolution, but these are interpolated estimates and the distribution is not weighted by population or household exposure.\n\nMet Éireann also states that the number of rainfall stations used for gridding varies by year (around 497 on average over the past decade and up to 456 in 2025). Station-network change and interpolation uncertainty are reasons to avoid reading year-to-year differences as a simple climate trend. [Daily grid documentation](https://clidata.met.ie/cli/grids_daily/)."),
        markdown("## Product decision for READY72\n\n**Decision:** keep the rainfall chart in an ‘Evidence & history’ section, label it with the selected threshold and period, and explain the date exclusion and 2022 invalid values. Do not blend it into a current warning count or use it to infer local flood probability.\n\nFor the current dashboard, favour source feeds that preserve issuing authority, time and affected area (Met Éireann warnings; OPW river observations; NCSC advisories). Keep ESB Networks PowerCheck and Uisce Éireann service updates as official link-outs until a documented, reusable incident feed or permission is confirmed. A river observation is not a flood warning, and historical rainfall is not a forecast."),
        markdown("## Limitations and next steps\n\n- The 20 mm cut-off is illustrative and should be justified in the final submission; it is not an official impact threshold.\n- Grid cells do not represent household exposure, building vulnerability, drainage, river levels or service outages.\n- The grid is an interpolated surface; comparisons with point observations are only a quality check, not a one-to-one validation.\n- The 2016-10-03 exclusion materially changes the annual profile and needs provider clarification before any public analytical claim.\n- The data covers the island grid, while READY72’s service scope is the Republic of Ireland; geography boundaries and dataset extent must be aligned before county-level display.\n- A fuller project should connect rainfall evidence to a documented flood-impact dataset only if definitions, dates, geography and licence are suitable. This notebook makes no predictive model or causal claim."),
        markdown("## Sources\n\n- Met Éireann, [Daily Grids](https://clidata.met.ie/cli/grids_daily/) — downloadable grids, units, coverage, station variation and attribution.\n- Met Éireann, [Weather Extreme Records](https://www.met.ie/index.php/climate/weather-extreme-records) — 2016 observed daily rainfall record.\n- Met Éireann, [October 2021 Climate Statement](https://www.met.ie/climate-statement-for-october-2021) — retrospective context describing October 2016.\n- Government of Ireland, [Be Emergency Ready](https://www.gov.ie/en/office-of-emergency-planning/campaigns/be-emergency-ready/) — household preparedness pillars and practical guidance.\n\n## Student reflection prompts\n\nWrite this section yourself after reviewing the final assessment brief. Explain what you learned about data quality, the decision your evidence supports, where AI helped and where human verification was needed, and what you would change after user testing. Do not claim tests or stakeholder research you did not conduct.")
    ],
    "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                 "language_info": {"name": "python", "version": "3.11"}},
    "nbformat": 4,
    "nbformat_minor": 5,
}

(HERE / "READY72_Rainfall_Analysis.ipynb").write_text(json.dumps(notebook, ensure_ascii=False, indent=2), encoding="utf-8")
print("Wrote READY72_Rainfall_Analysis.ipynb")

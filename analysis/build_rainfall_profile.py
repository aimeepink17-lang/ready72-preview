"""Rebuild READY72's descriptive rainfall summaries from Met Eireann grids."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = ROOT / "analysis"
YEARS = range(2016, 2026)

annual_rows = []
monthly_totals = {month: {"grid_point_days": 0, "grid_days_ge_10mm": 0,
                          "grid_days_ge_20mm": 0, "grid_days_ge_30mm": 0}
                  for month in range(1, 13)}
cell_counts = None
cell_coords = None
quality_rows = []

for year in YEARS:
    path = DATA / f"IRL_DLY_RR_{year}_grid.csv.gz"
    frame = pd.read_csv(path, compression="gzip")
    date_cols = [column for column in frame.columns if str(column).startswith("X")]
    raw = frame[date_cols].to_numpy(dtype=np.float64)
    negative_count = int((raw < 0).sum())
    blank_count = int(pd.isna(raw).sum())
    valid = np.isfinite(raw) & (raw >= 0)
    suspect_day_count = 0
    if year == 2016 and "X20161003" in date_cols:
        # Official station summaries identify 3 Oct 2016 as the 2016 daily
        # station record date (167.1 mm). The interpolated grid contains a
        # much larger, spatially broad peak that conflicts with the official
        # October description. Exclude this grid date from the main descriptive
        # profile pending clarification; retain it in the raw file and QA log.
        suspect_index = date_cols.index("X20161003")
        suspect_day_count = int(valid[:, suspect_index].sum())
        valid[:, suspect_index] = False
    rainfall_mm = np.where(valid, raw / 10.0, np.nan)

    # Keep month-level counts so the evidence page can show the seasonal
    # distribution without presenting it as an annual climate trend.
    for index, column in enumerate(date_cols):
        month = int(str(column)[5:7])
        month_values = rainfall_mm[:, index]
        month_valid = np.isfinite(month_values)
        totals = monthly_totals[month]
        totals["grid_point_days"] += int(month_valid.sum())
        totals["grid_days_ge_10mm"] += int((month_values[month_valid] >= 10).sum())
        totals["grid_days_ge_20mm"] += int((month_values[month_valid] >= 20).sum())
        totals["grid_days_ge_30mm"] += int((month_values[month_valid] >= 30).sum())

    # Thresholds are descriptive cut-offs, not official warning or flood thresholds.
    row = {
        "year": year,
        "grid_points": int(len(frame)),
        "days": len(date_cols),
        "grid_point_days": int(valid.sum()),
        "invalid_negative_values": negative_count,
        "blank_values": blank_count,
        "excluded_suspect_grid_day_values": suspect_day_count,
        "grid_days_ge_10mm": int((rainfall_mm >= 10).sum()),
        "grid_days_ge_20mm": int((rainfall_mm >= 20).sum()),
        "grid_days_ge_30mm": int((rainfall_mm >= 30).sum()),
        "pct_grid_point_days_ge_10mm": float((rainfall_mm >= 10).sum() / valid.sum() * 100),
        "pct_grid_point_days_ge_20mm": float((rainfall_mm >= 20).sum() / valid.sum() * 100),
        "pct_grid_point_days_ge_30mm": float((rainfall_mm >= 30).sum() / valid.sum() * 100),
        "mean_mm_all_valid": float(np.nansum(rainfall_mm) / valid.sum()),
        "max_mm": float(np.nanmax(rainfall_mm)),
    }

    # A separate QA sensitivity: for 2016, compare the gridded surface with
    # Met Eireann's published 2016 observed station maximum (167.1 mm). This
    # is not a correction; gridded interpolated cells and station observations
    # are different products.
    if year == 2016:
        suspect_values = raw[:, date_cols.index("X20161003")] / 10.0
        positions = np.flatnonzero(suspect_values > 167.1)
        row["flagged_examples"] = [
            {
                "easting": int(frame.iloc[int(r)]["east"]),
                "northing": int(frame.iloc[int(r)]["north"]),
                "date": "20161003",
                "value_mm": float(suspect_values[r]),
            }
            for r in positions[:10]
        ]
        row["suspect_date_grid_max_mm"] = float(np.nanmax(suspect_values))
        row["suspect_date_cells_over_2016_station_record"] = int((suspect_values > 167.1).sum())

    annual_rows.append(row)
    quality_rows.append({"year": year, "negative_values": negative_count, "blank_values": blank_count,
                         "max_grid_mm": row["max_mm"], "grid_points": len(frame), "days": len(date_cols)})
    per_cell = (rainfall_mm >= 20).sum(axis=1).astype(np.int32)
    cell_counts = per_cell if cell_counts is None else cell_counts + per_cell
    if cell_coords is None:
        cell_coords = frame[["east", "north"]].copy()

annual = pd.DataFrame(annual_rows)
annual.to_csv(OUT / "annual_profile_validated.csv", index=False, float_format="%.6f")
monthly = pd.DataFrame([
    {"month": month, **values,
     "pct_grid_point_days_ge_10mm": values["grid_days_ge_10mm"] / values["grid_point_days"] * 100,
     "pct_grid_point_days_ge_20mm": values["grid_days_ge_20mm"] / values["grid_point_days"] * 100,
     "pct_grid_point_days_ge_30mm": values["grid_days_ge_30mm"] / values["grid_point_days"] * 100}
    for month, values in monthly_totals.items()
])
monthly.to_csv(OUT / "monthly_profile_validated.csv", index=False, float_format="%.6f")
pd.DataFrame(quality_rows).to_csv(OUT / "quality_summary.csv", index=False)

cell_result = cell_coords.copy()
cell_result["days_ge_20mm_over_10y"] = cell_counts
cell_result["average_days_ge_20mm_per_year"] = cell_counts / len(list(YEARS))
cell_result.to_csv(OUT / "grid_cell_heavy_rain_frequency_2016_2025.csv", index=False)

distribution = np.quantile(cell_counts, [0, .25, .5, .75, .9, .95, .99, 1]).tolist()
summary = {
    "source": "Met Eireann daily rainfall 1 km grids, calendar years 2016-2025",
    "source_url": "https://clidata.met.ie/cli/grids_daily/",
    "grid_points_each_year": int(len(cell_counts)),
    "cell_frequency_quantiles_days_over_10_years": {
        key: float(value) for key, value in zip(["min", "p25", "median", "p75", "p90", "p95", "p99", "max"], distribution)
    },
    "interpretation": "Grid-cell day counts are spatially interpolated historical estimates, not household-level observations, warnings, or forecasts.",
}
(OUT / "analysis_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
print(json.dumps({"annual_rows": len(annual), "monthly_rows": len(monthly),
                  "profile": str(OUT / "annual_profile_validated.csv"),
                  "monthly_profile": str(OUT / "monthly_profile_validated.csv"),
                  "summary": summary, "2016_qa": annual_rows[0]}, indent=2))

# READY72 analysis files

## Rebuild the analysis

Use Python 3 with `pandas` and `numpy`. From this folder, run:

```powershell
python build_rainfall_profile.py
```

The script reads the ten compressed Met Éireann annual rainfall grids in `../data/` and rebuilds:

- `annual_profile_validated.csv` — yearly threshold summaries.
- `monthly_profile_validated.csv` — pooled month-of-year threshold summaries for the 2016–2025 period. This supports a descriptive seasonal comparison, not a climate trend.
- `quality_summary.csv` — blanks, negative values and maximum values by year.
- `grid_cell_heavy_rain_frequency_2016_2025.csv` — per-cell counts for the ten-year period.
- `analysis_summary.json` — selected distribution statistics and interpretation boundary.

Open `READY72_Rainfall_Analysis.ipynb` in Jupyter and run the cells in order. The notebook calls the same analysis script, displays the annual table and chart, explains the quality decisions, and records the limitations and source links.

The 3 October 2016 grid values are excluded from the primary profile while the discrepancy with Met Éireann’s station record and monthly account remains unresolved. The raw file is preserved. Negative values in 2022 are excluded from valid rainfall denominators and are never changed to zero.

The source data is interpolated at 1 km resolution and does not represent household exposure or a flood forecast. Review Met Éireann’s current attribution and reuse conditions before redistributing raw or processed data.

The evidence page compares both month-of-year and calendar-year shares of valid grid-point days meeting a selected daily rainfall threshold. The month view pools each month across the decade; February and leap years have their actual valid-day denominators. The 3 October 2016 suspect grid date and negative 2022 values are excluded in both profiles. A higher rainfall estimate is not itself a flood: the dataset contains no flood-event outcomes and does not establish an upward trend over this ten-year window.

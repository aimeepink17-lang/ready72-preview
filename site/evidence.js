(() => {
  const annualChart = document.getElementById('rainfallChart');
  const monthlyChart = document.getElementById('monthlyRainChart');
  if (!annualChart || !monthlyChart) return;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let annualRows = [];
  let monthlyRows = [];
  let threshold = 20;

  const readCsv = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    const lines = (await response.text()).trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
      const cells = line.split(',');
      return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
    });
  };

  function drawChart(element, rows, key, labelFor, labelElement, caption) {
    const values = rows.map(row => ({
      label: labelFor(row),
      value: Number(row[key]) / Number(row.grid_point_days) * 100
    })).filter(row => Number.isFinite(row.value));
    element.replaceChildren();
    const max = Math.max(1, ...values.map(row => row.value));
    values.forEach(row => {
      const group = document.createElement('div');
      group.className = 'chart-bar-group';
      const bar = document.createElement('i');
      bar.className = 'chart-bar';
      bar.style.setProperty('--bar-height', `${Math.max(3, row.value / max * 92)}%`);
      bar.setAttribute('aria-label', `${row.label}: ${row.value.toFixed(2)} percent of valid grid-point days at or above ${threshold} millimetres`);
      bar.title = `${row.label}: ${row.value.toFixed(2)}%`;
      const label = document.createElement('span');
      label.textContent = row.label;
      group.append(bar, label);
      element.append(group);
    });
    labelElement.textContent = caption;
  }

  function render() {
    const key = `grid_days_ge_${threshold}mm`;
    drawChart(monthlyChart, monthlyRows, key, row => monthNames[Number(row.month) - 1],
      document.getElementById('monthlyCaption'),
      `Share of valid grid-point days at ≥${threshold} mm/day · grouped by month`);
    drawChart(annualChart, annualRows, key, row => String(row.year).slice(2),
      document.getElementById('thresholdCaption'),
      `Share of valid grid-point days at ≥${threshold} mm/day`);
    document.querySelectorAll('.threshold-button').forEach(button => {
      const active = Number(button.dataset.threshold) === threshold;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  Promise.all([
    readCsv('data/analysis/annual_profile_validated.csv'),
    readCsv('data/analysis/monthly_profile_validated.csv')
  ]).then(([annual, monthly]) => {
    annualRows = annual;
    monthlyRows = monthly;
    render();
  }).catch(() => {
    document.querySelectorAll('.rain-chart-title').forEach((node, index) => {
      node.textContent = index === 0 ? 'Rainfall chart data could not be loaded. Use the download links below.' : node.textContent;
    });
  });

  document.querySelectorAll('.threshold-button').forEach(button => button.addEventListener('click', () => {
    threshold = Number(button.dataset.threshold);
    if (annualRows.length && monthlyRows.length) render();
  }));
})();

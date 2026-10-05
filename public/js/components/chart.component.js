/* ==========================================================================
   Warehouse App - MUTATION BAR CHART UI COMPONENT
   File: frontend/js/components/chart.component.js
   ========================================================================== */

const ChartComponent = {
  // Render Custom CSS Bar Chart with Interactive Tooltips
  render(containerId, chartData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = '';

    if (!Array.isArray(chartData) || chartData.length === 0) {
      const msg = document.createElement('div');
      msg.style.height = '100%'; msg.style.display = 'flex'; msg.style.alignItems = 'center'; msg.style.justifyContent = 'center';
      msg.style.color = 'var(--text-tertiary)'; msg.style.fontSize = '13px';
      msg.textContent = 'Belum ada data mutasi barang masuk/keluar';
      container.appendChild(msg);
      return;
    }

    const maxVal = Math.max(...chartData.map(d => Math.max(d.inbound || 0, d.outbound || 0)), 80);

    chartData.forEach(item => {
      const col = document.createElement('div');
      col.className = 'chart-column';

      const inHeight = Math.min(((item.inbound || 0) / maxVal) * 100, 100);
      const outHeight = Math.min(((item.outbound || 0) / maxVal) * 100, 100);

      col.innerHTML = `
        <div class="bars-wrapper">
          <div class="bar inbound" style="height: ${inHeight}%;"></div>
          <div class="bar outbound" style="height: ${outHeight}%;"></div>
        </div>
        <span class="chart-day-label">${item.day}</span>
      `;

      col.addEventListener('mouseenter', () => this.showTooltip(col, item));
      col.addEventListener('mouseleave', () => this.hideTooltip(col));

      container.appendChild(col);
    });
  },

  showTooltip(columnEl, item) {
    let tooltip = columnEl.querySelector('.chart-tooltip-popup');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip-popup';
      columnEl.appendChild(tooltip);
    }
    tooltip.innerHTML = `
      <span style="color: var(--accent-chart-in);">In: ${item.inbound || 0}</span>
      <span style="color: var(--accent-chart-out);">Out: ${item.outbound || 0}</span>
    `;
  },

  hideTooltip(columnEl) {
    const tooltip = columnEl.querySelector('.chart-tooltip-popup');
    if (tooltip) tooltip.remove();
  }
};

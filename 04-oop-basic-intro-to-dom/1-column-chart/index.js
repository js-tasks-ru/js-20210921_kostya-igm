export default class ColumnChart {
  chartHeight = 50;

  constructor({
                data = [],
                label = '',
                link = '',
                value = 0,
                formatHeading = data => data
              } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);
    this.render();
  }

  getTemplate() {
    return `
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
            Total ${this.label} ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
          ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `
  }

  render() {
    const element = document.createElement('div'); // (*)
    element.innerHTML = this.getTemplate();

    // add loading if there is no data
    if (this.data.length === 0) {
      element.querySelector(".column-chart").classList.add("column-chart_loading");
    }

    this.element = element.firstElementChild;
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    })
      .join('');
  }

  getLink() {
    return this.link !== "" ? `<a class="column-chart__link" href=${this.link}>View all</a>` : "";
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}

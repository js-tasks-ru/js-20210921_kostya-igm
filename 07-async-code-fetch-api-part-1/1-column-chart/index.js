import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  ordersUrl;

  constructor({
                url = '',
                range = {},
                label = '',
                link = '',
                formatHeading = data => data
              } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.data = [];
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
            ${this.getHeaderValue()}
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
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    // add loading if there is no data
    if (this.data.length === 0) {
      this.element.classList.add("column-chart_loading");
    }

    this.ordersUrl = new URL(this.url, BACKEND_URL);
    this.update(this.range.from, this.range.to);
  }

  getHeaderValue() {
    return this.formatHeading(Object.values(this.data).reduce(function (accum, item) {
      return accum + item;
    }, 0))
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));
    const scale = this.chartHeight / maxValue;

    return Object.values(data).map(value => {
      const percent = (value / maxValue * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${percent}%"></div>`;
    })
      .join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  getLink() {
    return this.link !== "" ? `<a class="column-chart__link" href=${this.link}>View all</a>` : "";
  }

  update(from, to) {
    this.range.from = new Date(from)
    this.range.to = new Date(to)
    this.ordersUrl.searchParams.set("from", this.range.from);
    this.ordersUrl.searchParams.set("to", this.range.to)

    fetchJson(this.ordersUrl)
      .then(response => {
        this.data = response;
        this.subElements.header.innerHTML = this.getHeaderValue();
        this.subElements.body.innerHTML = this.getColumnBody(this.data);
        if (Object.keys(this.data).length > 0) {
          this.element.classList.remove("column-chart_loading");
        }
        return this.data;
      })
      .catch(() => this.data = []);
    return this.data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

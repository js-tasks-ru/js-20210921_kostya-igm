import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  subElements;
  components;
  start = 0;
  end = 30;

  constructor() {
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.template();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Лидеры продаж</h3>
        <div data-element="sortableTable"></div>
      </div>
    `
  }

  initComponents() {
    const to = new Date();
    const from = new Date(new Date().setMonth(new Date().getMonth() - 1));

    const rangePicker = new RangePicker({from, to});

    const url = this.setSortableTableUrl(from, to);
    const sortableTable = new SortableTable(header, {
      url: url,
      isSortLocally: true
    });

    const ordersChart = new ColumnChart({
      url: "api/dashboard/orders",
      label: "orders",
      range: {from, to}
    });

    const salesChart = new ColumnChart({
      url: "api/dashboard/sales",
      label: "sales",
      range: {from, to}
    })

    const customersChart = new ColumnChart({
      url: "api/dashboard/customers",
      label: "cusotmers",
      range: {from, to}
    })

    this.components = {
      rangePicker,
      sortableTable,
      ordersChart,
      salesChart,
      customersChart
    }
  };

  setSortableTableUrl(from, to) {
    const url = new URL("api/dashboard/bestsellers", BACKEND_URL);
    url.searchParams.set("_start", this.start);
    url.searchParams.set("_end", this.end);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    return url;
  }

  renderComponents() {
    Object.keys(this.components).forEach(component => {
      const content = this.subElements[component];
      const {element} = this.components[component];
      content.append(element);
    })
  }

  async updateComponents(from, to) {
    const url = this.setSortableTableUrl(from, to);
    try {
      const data = await fetchJson(url);
      this.components.sortableTable.update(data);
      await this.components.ordersChart.update(from, to);
      await this.components.salesChart.update(from, to);
      await this.components.customersChart.update(from, to);

    } catch (e) {
      console.error(e);
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");
    const obj = {};
    [...elements].forEach(subElement => {
      obj[subElement.dataset.element] = subElement
    });
    return obj;
  }

  remove() {
    this.element.remove();
  }

  initEventListeners() {
    this.components.rangePicker.element.addEventListener("date-select", event => {
      const {from, to} = event.detail;

      this.updateComponents(from, to);
    })
  }

  destroy() {
    this.remove();
    Object.values(this.components).forEach(component => {
      component.destroy();
    })
  }
}

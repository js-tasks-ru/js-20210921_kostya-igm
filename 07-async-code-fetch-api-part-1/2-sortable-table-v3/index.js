import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  start = 0;
  end = 30;
  length = 0;
  dataCompleted = false;

  constructor(headerConfig, {
    url = "",
    isSortLocally = false,
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.url = url;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.data = [];

    this.render();
  }

  sortOnClient(id, order) {

  }

  sortOnServer(id, order) {

  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>

      </div>`;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.getData(this.start, this.end).then(() => {
      this.subElements.body.innerHTML = this.getTableBody();
      this.subElements.loading.style.display = "none";
      document.addEventListener('scroll', this.infinityScroll.bind(this));
    });
  }

  infinityScroll(event) {
    // if there is more data to be retrieved from backend
    if (!this.dataCompleted) {
      // lower border of the document
      let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
      // if user scrolled far enough (<100 px until the bottom), get and add more data
      if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
        this.start += 30;
        this.end += 30;
        this.getData(this.start, this.end).then(() => {
          this.subElements.body.innerHTML = this.getTableBody();
          this.subElements.loading.style.display = "none";
        });
      }
    }
  }

  async getData(start, end) {
    const loading = this.element.querySelector(".sortable-table__loading-line")
    const placeholder = this.element.querySelector(".sortable-table__empty-placeholder");
    loading.style.display = "block";

    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set("_embed", "subcategory.category");
    url.searchParams.set("_sort", this.sorted.id)
    url.searchParams.set("_order", this.sorted.order);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);

    try {
      // fill this.data array by new portions of data that is coming from API response
      const response = await fetchJson(url);
      this.data.push(...response);

      // if we cannot retrieve more data from backend, change flag dataCompleted to true and hide loader
      if (this.length !== this.data.length) {
        this.length = this.data.length;
      } else {
        this.dataCompleted = true;
        loading.style.display = "none";
      }

      if (this.data.length === 0) { // if there is no data came from API response
        placeholder.style.display = "block";
      }
    } catch (err) {
      console.log(err);
    }
  }

  update() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const {sortType} = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          return direction * (a[field] - b[field]);
      }
    });
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

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}



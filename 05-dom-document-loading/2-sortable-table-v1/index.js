export default class SortableTable {
  static sortedData;

  constructor(headerConfig = [], data = []) {
    SortableTable.sortedData = data;
    this.headerConfig = headerConfig;
    this.data = data;
    this.order = "asc"
    this.render();
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          <div class="sortable-table__cell" data-id="${this.headerConfig[0].id}" data-sortable="${this.headerConfig[0].sortable}" data-order="${this.order}">
            <span>${this.headerConfig[0].title}</span>
          </div>
          <div class="sortable-table__cell" data-id="${this.headerConfig[1].id}" data-sortable="${this.headerConfig[1].sortable}" data-order="${this.order}">
            <span>${this.headerConfig[1].title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>
          <div class="sortable-table__cell" data-id="${this.headerConfig[2].id}" data-sortable="${this.headerConfig[2].sortable}" data-order="${this.order}">
            <span>${this.headerConfig[2].title}</span>
          </div>
          <div class="sortable-table__cell" data-id="${this.headerConfig[3].id}" data-sortable="${this.headerConfig[3].sortable}" data-order="${this.order}">
            <span>${this.headerConfig[3].title}</span>
          </div>
          <div class="sortable-table__cell" data-id="${this.headerConfig[4].id}" data-sortable="${this.headerConfig[4].sortable}" data-order="${this.order}">
            <span>${this.headerConfig[4].title}</span>
          </div>
        </div>
        <div data-element="body" class="sortable-table__body">

        </div>
      </div>
    </div>
    `;
  }

  getHeader() {

  }

  getBody(i, image) {
    return `
          <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
          ${image}
            <div class="sortable-table__cell">${SortableTable.sortedData[i].title}</div>
            <div class="sortable-table__cell">${SortableTable.sortedData[i].quantity}</div>
            <div class="sortable-table__cell">${SortableTable.sortedData[i].price}</div>
            <div class="sortable-table__cell">${SortableTable.sortedData[i].sales}</div>
          </a>
    `
  }

  render() {
    const element = document.createElement('div'); // (*)
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    const root = document.getElementById("root");
    root.innerHTML = this.getTemplate();

    const body = document.body.querySelector(".sortable-table__body");
    for (let i = 0; i < SortableTable.sortedData.length; i++) {
      const image = this.headerConfig[0].template(this.data[i].images)
      body.insertAdjacentHTML('beforebegin', this.getBody(i, image));
    }
    this.subElements = this.getSubElements(this.element);
  }

  /**
   * sortStrings - sorts array of string by two criteria "asc" or "desc"
   * @param {string} fieldValue - value property in 'option' tag of the 'select' tag
   * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
   * @returns {string[]}
   */
  sort(fieldValue, param = 'asc') {
    (param === "desc") ?
      SortableTable.sortedData.sort((a, b) => this.sortHelper(a[fieldValue], b[fieldValue])) :
      SortableTable.sortedData.sort((a, b) => this.sortHelper(b[fieldValue], a[fieldValue])) // "asc"

    this.order = param;
    this.render();
    return SortableTable.sortedData;
  }

  sortHelper(a, b) {
    return String(b).localeCompare(String(a), "ru-u-kf-upper")
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
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
}


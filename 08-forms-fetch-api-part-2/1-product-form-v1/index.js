import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const PRODUCTS_PATHNAME = "/api/rest/products";
const CATEGORIES_PATHNAME = "/api/rest/categories"

export default class ProductForm {
  element;
  subElements = {};
  categories;
  product = {};
  images;
  productsUrl = new URL(PRODUCTS_PATHNAME, BACKEND_URL);
  categoriesUrl = new URL(CATEGORIES_PATHNAME, BACKEND_URL);


  constructor(productId) {
    this.productId = productId;
  }

  onSubmit = event => {
    event.preventDefault();
    this.save();
  }

  async render() {
    [this.categories, this.product] = await Promise.all([
      this.getCategoriesData(),
      this.loadProduct(this.productId)
    ]);
    this.images = this.getImagesTemplate(this.product);

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();

    return this.element;
  }

  getTemplate() {
    return `
       <div class="product-form">
        <form data-element="productForm" class="form-grid">

          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" value="${escapeHtml(this.product[0].title)}" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>

          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">
${escapeHtml(this.product[0].description)}</textarea>
          </div>

          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
                <ul class="sortable-list">
                    ${this.images}
                </ul>
              </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>

          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" id="subcategory" name="subcategory">
               ${this.getCategoriesTemplate()}
            </select>
          </div>

          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" class="form-control" value="${this.product[0].price}" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" class="form-control" value="${this.product[0].discount}" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" value="${this.product[0].quantity}" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>

          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>

        </form>
      </div>
    `
  }

  async loadProduct(id) {
    try {
      this.productsUrl.searchParams.set("id", id);
      return await fetchJson(this.productsUrl);
    } catch (error) {
      console.error(error)
    }
  }

  async getCategoriesData() {
    try {
      this.categoriesUrl.searchParams.set("_sort", "weight")
      this.categoriesUrl.searchParams.set("_refs", "subcategory");
      return await fetchJson(this.categoriesUrl);
    } catch (error) {
      console.error(error)
    }
  }

  getImagesTemplate(response) {
    return response[0].images.map(image => {
      return `
            <li class="products-edit__imagelist-item sortable-list__item" style="">
                <input type="hidden" name="url" value="${image.url}">
                <input type="hidden" name="source" value="${image.source}">
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                  <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
                  <span>${image.source}</span>
                </span>
                <button type="button">
                    <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
            </li> `
    }).join("")
  }

  getCategoriesTemplate() {
    return this.categories.map(category => {
      return category.subcategories.map(subcategory => {
        return `<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`
      }).join("");
    }).join("");
  }

  initEventListeners() {
    const {productForm} = this.subElements
    productForm.addEventListener("submit", this.onSubmit);
  }

  async save() {
    try {
      const result = await fetchJson(this.productsUrl, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.product)
      });

      this.dispatchEvent(result.id);
    } catch (error) {
      console.error(error);
    }
  }

  dispatchEvent(id) {
    const event = this.productId
      ? new CustomEvent('product-updated', {detail: id}) // new CustomEvent('click')
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }


  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}

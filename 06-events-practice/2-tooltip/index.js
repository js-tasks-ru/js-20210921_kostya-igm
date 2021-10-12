class Tooltip {
  static store;
  element;
  subElements;
  tooltip;
  currentElement;

  onMouseOver = event => {
    if (this.currentElement !== event.target) {
      this.currentElement = event.target;
      if (event.target.dataset.tooltip !== undefined) {
        this.render(event);
      }
    }
  }

  onMouseOut = () => {
    this.remove();
  }

  onMouseMove = event => {
    if (this.tooltip) {
      this.tooltip.style.top = (event.clientY + 10) + "px";
      this.tooltip.style.left = (event.clientX + 10) + "px";
    }
  }

  constructor() {
    this.initialize();
  }

  get store() {
    return Tooltip.store;
  }

  set store(obj) {
    Tooltip.store = obj;
  }

  initialize() {
    this.element = document.body;
    this.subElements = this.getSubElements(this.element);

    if (this.store) {
      this.store.remove();
    }

    this.store = this;
    this.setTooltipEventHandlers();
  }

  setTooltipEventHandlers() {
    document.addEventListener('mouseover', this.onMouseOver);
    document.addEventListener('mouseout', this.onMouseOut);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  render(event) {
    this.tooltip = document.createElement("div")
    this.tooltip.classList.add("tooltip");
    this.tooltip.innerText = event.target.dataset.tooltip;
    this.tooltip.style.top = (event.clientY + 10) + "px";
    this.tooltip.style.left = (event.clientX + 10) + "px";
    document.body.insertBefore(this.tooltip, document.body.firstChild);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-tooltip]');
    for (const subElement of elements) {
      const name = subElement.dataset.tooltip;
      result[name] = subElement;
    }
    return result;
  }

  remove() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.store = null;
      this.currentElement = null;
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default Tooltip;

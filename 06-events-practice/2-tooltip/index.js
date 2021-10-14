class Tooltip {
  static store;
  element;
  subElements;
  tooltip;
  currentElement;

  constructor() {
    if (this.store) {
      return this.store
    }

    this.store = this;
    this.initialize();
  }

  get store() {
    return Tooltip.store;
  }

  set store(obj) {
    Tooltip.store = obj;
  }

  onMouseOver = event => {
    if (this.currentElement !== event.target) {
      this.currentElement = event.target;
      if (event.target.dataset.tooltip !== undefined) {
        this.createTooltip(event);
        this.render();
        document.addEventListener('mousemove', this.onMouseMove)
      }
    }
  }

  onMouseOut = () => {
    this.remove();
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = event => {
    if (this.tooltip) {
      const shift = 10;
      this.tooltip.style.top = (event.clientY + shift) + "px";
      this.tooltip.style.left = (event.clientX + shift) + "px";
    }
  }

  initialize() {
    const container = document.createElement("div")
    container.innerHTML = `<div id='container'></div>`
    this.element = container.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.setTooltipEventHandlers();
  }

  setTooltipEventHandlers() {
    document.addEventListener('mouseover', this.onMouseOver);
    document.addEventListener('mouseout', this.onMouseOut);
  }

  createTooltip(event) {
    const shift = 10;
    this.tooltip = document.createElement("div")
    this.tooltip.classList.add("tooltip");
    this.tooltip.innerText = event.target.dataset.tooltip;
    this.tooltip.style.top = (event.clientY + shift) + "px";
    this.tooltip.style.left = (event.clientX + shift) + "px";
  }

  render() {
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
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseover', this.onMouseOver)
    document.removeEventListener('mouseout', this.onMouseOut)

    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default Tooltip;

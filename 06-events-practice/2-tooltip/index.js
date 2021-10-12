class Tooltip {
  static store;
  element;
  subElements;
  tooltip;
  currentElement;

  constructor() {
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

  initialize() {
    const container = document.createElement("div")
    container.innerHTML = `<div id='container'></div>`
    this.element = container.firstElementChild;
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
    // mousemove event only on our text element
    (document.body.firstElementChild !== null) ?
      document.body.firstElementChild.addEventListener('mousemove', this.onMouseMove) :
      document.addEventListener('mousemove', this.onMouseMove)
  }

  createTooltip(event) {
    this.tooltip = document.createElement("div")
    this.tooltip.classList.add("tooltip");
    this.tooltip.innerText = event.target.dataset.tooltip;
    this.tooltip.style.top = (event.clientY + 10) + "px";
    this.tooltip.style.left = (event.clientX + 10) + "px";
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
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default Tooltip;

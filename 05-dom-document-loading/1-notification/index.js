export default class NotificationMessage {
  static store; // for Singleton pattern, to have only one instance of the class
  timerId;
  element;

  constructor(message = "", {duration = 0, type = ""} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template() {
    return `
     <div class="notification ${this.type}" style="--value:${this.duration}ms">
     <div class="timer"></div>
       <div class="inner-wrapper">
         <div class="notification-header">
                Notification
          </div>
          <div class="notification-body">
               ${this.message}
          </div>
        </div>
      </div>
   `;
  }

  get store() {
    return NotificationMessage.store;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  show(target = document.body) {
    if (this.store) {
      this.store.remove();
    }
    NotificationMessage.store = this;
    target.append(this.element)

    this.timerId = setTimeout(() => {
      this.remove();
      NotificationMessage.store = null;
    }, this.duration);
  }

  remove() {
    clearTimeout(this.timerId)
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
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

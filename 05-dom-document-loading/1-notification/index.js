export default class NotificationMessage {
  static store; // for Singleton pattern, to have only one instance of the class
  static timerId;

  constructor(message = "", {duration = 0, type = ""} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template() {
    return `
     <div class="notification" style="--value:${this.duration}ms">
     <div class="timer"></div>
       <div class="inner-wrapper">
         <div class="notification-header">
                Notification
          </div>
          <div class="notification-body">
               ${this.message} ${Math.random()}
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

  show() {
    if (NotificationMessage.store) {
      document.body.querySelector(".timer").remove();
      document.body.querySelector(".notification").insertAdjacentHTML("afterbegin", `<div class="timer"></div>`);
      clearTimeout(NotificationMessage.timerId)
      document.body.querySelector(".notification-body").textContent = `${this.message} ${Math.random()}`;
    } else {
      NotificationMessage.store = this.template;
      document.body.insertAdjacentHTML("beforeend", this.template);
      this.element = document.body.querySelector(".notification");
      this.element.classList.add(this.type);

      NotificationMessage.timerId = setTimeout(() => {
        this.remove(this.element);
        NotificationMessage.store = null;
      }, this.duration);
    }

  }

  remove(element) {
    element.remove();
  }

  destroy() {
    this.remove(this.element);
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

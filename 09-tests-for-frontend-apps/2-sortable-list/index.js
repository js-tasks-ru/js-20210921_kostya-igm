export default class SortableList {
  draggableNodes;
  holder;
  li;
  currentDroppable;

  constructor({items}) {
    this.items = items;
    this.initialize();
    this.render();
    this.initEventListeners();
  }

  onMouseDown = (event) => {
    this.currentDroppable = null;
    this.drag(event);
    // перемещать по экрану
    document.addEventListener('mousemove', this.onMouseMove);

    // положить объект, удалить более ненужные обработчики событий
    document.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseMove = event => {
    // prevent default behavior - чтобы не происходило выделение мышью при dragging
    event.preventDefault();
    this.moveAt(event.pageX, event.pageY);

    this.li.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.li.hidden = false;

    // событие mousemove может произойти и когда указатель за пределами окна
    // если clientX/clientY за пределами окна, elementFromPoint вернёт null
    if (!elemBelow) return;

    // потенциальные цели переноса помечены классом droppable
    this.drop(elemBelow);
  }

  onMouseUp = event => {
    this.currentDroppable.classList.remove("sortable-list__placeholder");

    this.currentDroppable.innerHTML = this.li.innerHTML;

    if (document.body.contains(this.li)) {
      document.body.removeChild(this.li);
    }
    document.removeEventListener('mousemove', this.onMouseMove);
    this.li.onmouseup = null;
  }

  // передвинуть под координаты курсора
  // и сдвинуть на половину ширины/высоты для центрирования
  moveAt(pageX, pageY) {
    this.li.style.left = pageX - this.li.offsetWidth + 'px';
    this.li.style.top = pageY - this.li.offsetHeight + 'px';
  }

  enterDroppable(droppableBelow) {
    this.currentDroppable.classList.add("sortable-list__placeholder");
    this.currentDroppable.hidden = false;
    [...droppableBelow.children].forEach(child => child.style.display = "block");
    [...this.currentDroppable.children].forEach(child => child.style.display = "none");
  }

  leaveDroppable() {
    this.currentDroppable.classList.remove("sortable-list__placeholder");
    [...this.currentDroppable.children].forEach(child => child.style.display = "block")
  }

  initialize() {
    const container = document.createElement("div")
    container.innerHTML = `<div></div>`
    this.element = container.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  render() {
    this.holder = document.getElementById("holder")
    this.items.forEach(item => {
      item.classList.add("sortable-list__item");
      this.holder.append(item);
    });

    this.draggableNodes = document.querySelectorAll("#holder li")
  }

  initEventListeners() {
    this.draggableNodes.forEach(item => {
      item.addEventListener("mousedown", this.onMouseDown)
    });
  }

  drag(event) {
    const placeholder = event.target.cloneNode(true);
    placeholder.classList.add("sortable-list__placeholder");
    placeholder.classList.add("sortable-list__item");

    this.li = event.target.closest("li");
    this.li.after(placeholder);

    this.li.classList.add("sortable-list__item_dragging");

    // разместить поверх остального содержимого и в абсолютных координатах
    this.li.style.position = 'absolute';
    this.li.style.zIndex = 1000;
    // переместим в body, чтобы элемент был точно не внутри position:relative
    document.body.append(this.li);

    // установим абсолютно спозиционированный элемент под курсор
    this.moveAt(event.pageX, event.pageY);
  }

  drop(elemBelow) {
    let droppableBelow = elemBelow.closest('li');
    if (this.currentDroppable !== droppableBelow) {

      // мы либо залетаем на цель, либо улетаем из неё
      if (this.currentDroppable) {
        // логика обработки процесса "вылета" из droppable
        this.leaveDroppable();
      }
      this.currentDroppable = droppableBelow;
      if (this.currentDroppable) {
        // логика обработки процесса, когда мы "влетаем" в элемент droppable
        this.enterDroppable(droppableBelow);
      }
    }
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

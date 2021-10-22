export default class SortableList {
  draggableNodes;
  holder;

  constructor({items}) {
    this.items = items;
    this.initialize();
    this.render();
    this.initEventListeners();
  }

  onMouseDown = (event) => {
    let currentDroppable = null;
    const self = this;

    const placeholder = event.target.cloneNode(true);
    placeholder.classList.add("sortable-list__placeholder");
    placeholder.classList.add("sortable-list__item");

    const li = event.target.closest("li");
    li.after(placeholder);

    li.classList.add("sortable-list__item_dragging");

    // разместить поверх остального содержимого и в абсолютных координатах
    li.style.position = 'absolute';
    li.style.zIndex = 1000;
    // переместим в body, чтобы элемент был точно не внутри position:relative
    document.body.append(li);

    // и установим абсолютно спозиционированный элемент под курсор

    moveAt(event.pageX, event.pageY);
    // передвинуть под координаты курсора
    // и сдвинуть на половину ширины/высоты для центрирования
    function moveAt(pageX, pageY) {
      li.style.left = pageX - li.offsetWidth + 'px';
      li.style.top = pageY - li.offsetHeight + 'px';
    }

    function onMouseMove(event) {
      // prevent default behavior - чтобы не происходило выделение мышью при dragging
      event.preventDefault();
      moveAt(event.pageX, event.pageY);

      li.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      li.hidden = false;

      // событие mousemove может произойти и когда указатель за пределами окна

      // если clientX/clientY за пределами окна, elementFromPoint вернёт null
      if (!elemBelow) return;

      // потенциальные цели переноса помечены классом droppable
      let droppableBelow = elemBelow.closest('li');
      if (currentDroppable !== droppableBelow) {

        // мы либо залетаем на цель, либо улетаем из неё
        if (currentDroppable) {
          // логика обработки процесса "вылета" из droppable
          self.leaveDroppable(currentDroppable, droppableBelow);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          // логика обработки процесса, когда мы "влетаем" в элемент droppable
          self.enterDroppable(currentDroppable, droppableBelow);
        }
      }

    }

    // перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);

    // положить объект, удалить более ненужные обработчики событий
    document.addEventListener("mouseup", () => {
      currentDroppable.classList.remove("sortable-list__placeholder");

      currentDroppable.innerHTML = li.innerHTML;

      if (document.body.contains(li)) {
        document.body.removeChild(li);
      }
      document.removeEventListener('mousemove', onMouseMove);
      li.onmouseup = null;
    })
  }

  enterDroppable(currentDroppable, droppableBelow) {
    currentDroppable.classList.add("sortable-list__placeholder");
    currentDroppable.hidden = false;
    Array.from(droppableBelow.children).forEach(child => child.style.display = "block")
    Array.from(currentDroppable.children).forEach(child => child.style.display = "none")
  }

  leaveDroppable(currentDroppable) {
    currentDroppable.classList.remove("sortable-list__placeholder");
    Array.from(currentDroppable.children).forEach(child => child.style.display = "block")
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

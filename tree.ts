import { TreeStatus } from "./home.component";

export class TreeView {

  data: any;
  node: any;
  handlers = {};
  private events = [
    'expand',
    'expandAll',
    'collapse',
    'collapseAll',
    'select'
  ];

  constructor(data, node: any) {
    this.data = data;
    this.node = node;
    this.render();
    this.expandAll()
  }

  render() {

    const container = this.isDomElement(this.node) ? this.node : document.getElementById(this.node);
    let leaves = [], click;

    this.forEach(this.data, (item) => {
      leaves.push(this.renderLeaf.call(this, item));
    }, this);

    container.innerHTML = leaves.map(leaf => leaf.outerHTML).join('');

    this.forEach(container.querySelectorAll('.tree-leaf-text'), (node) => {
      node.onclick = this.click.bind(this);
    }, this);

    this.forEach(container.querySelectorAll('.tree-expando'), (node) => {
      node.onclick = this.click.bind(this);
    }, this);

  }

  emit(instance, name) {

    var args = [].slice.call(arguments, 2);
    if (this.events.indexOf(name) > -1) {
      if (instance.handlers[name] && instance.handlers[name] instanceof Array) {
        this.forEach(instance.handlers[name], (handle) => {
          window.setTimeout(() => {
            handle.callback.apply(handle.context, args);
          }, 0);
        }, this);
      }
    } else {
      throw new Error(name + ' event cannot be found on TreeView.');
    }
  }

  click(event: any): void {

    const parent = (event.target || event.currentTarget).parentNode;
    const data = JSON.parse(parent.getAttribute('data-item'));
    const leaves = parent.parentNode.querySelector('.tree-child-leaves');

    if (leaves) {
      if (leaves.classList.contains('hidden')) {
        this.expand(parent, leaves);
      } else {
        this.collapse(parent, leaves);
      }
    } else {
      this.emit(self, 'select');
      // {
      //   target: e,
      //   data: data
      // }
    }
  }

  expand(node, leaves, skipEmit = false) {
    const expando = node.querySelector('.tree-expando');
    expando.textContent = '-';
    leaves.classList.remove('hidden');
    if (skipEmit) { return; }
    this.emit(this, 'expand');
    // {
    //   target: node,
    //   leaves: leaves
    // }
  }

  expandAll() {

    var nodes = document.getElementById(this.node).querySelectorAll('.tree-expando');
    this.forEach(nodes, (node) => {
      var parent = node.parentNode;
      var leaves = parent.parentNode.querySelector('.tree-child-leaves');
      if (parent && leaves && parent.hasAttribute('data-item')) {
        this.expand(parent, leaves, true);
      }
    }, this);
    this.emit(this, 'expandAll');
  }

  collapse(node, leaves, skipEmit = false) {
    const expando = node.querySelector('.tree-expando');
    expando.textContent = '+';
    leaves.classList.add('hidden');
    if (skipEmit) { return; }
    this.emit(this, 'collapse');
  }

  collapseAll(): void {

    var nodes = document.getElementById(this.node).querySelectorAll('.tree-expando');
    this.forEach(nodes, (node) => {
      var parent = node.parentNode;
      var leaves = parent.parentNode.querySelector('.tree-child-leaves');
      if (parent && leaves && parent.hasAttribute('data-item')) {
        this.collapse(parent, leaves, true);
      }
    }, true);
    this.emit(this, 'collapseAll');
  }

  renderLeaf(item: any) {
    debugger;
    const leaf = document.createElement('div');
    const content = document.createElement('div');
    const text = document.createElement('div');
    const expando = document.createElement('div');

    leaf.setAttribute('class', 'tree-leaf');
    content.setAttribute('class', 'tree-leaf-content');
    content.setAttribute('data-item', JSON.stringify(item));
    text.setAttribute('class', 'tree-leaf-text');

    if (typeof item.data === 'object') {

      Object.entries(item.data)
        .map(([key, property], data) => {
          debugger;

          const spanKey = document.createElement('span');
          spanKey.textContent = key;

          const spanProperty = document.createElement('span');
          spanProperty.textContent = property;

          const divProperty = document.createElement('div');
          divProperty.appendChild(spanKey);
          divProperty.appendChild(document.createTextNode(":"));
          divProperty.appendChild(spanProperty);

          const color = this.getColor(item.status);
          divProperty.classList.add(...[color, 'leaf-node']);

          text.appendChild(divProperty);
          // text.appendChild = JSON.stringify(item.data);
        });

    } else {
      text.textContent = item.data;
    }

    expando.setAttribute('class', 'tree-expando ' + (item.expanded ? 'expanded' : ''));
    expando.textContent = item.expanded ? '-' : '+';
    content.appendChild(expando);
    content.appendChild(text);
    leaf.appendChild(content);

    if (item.children && item.children.length > 0) {

      const children = document.createElement('div');
      children.setAttribute('class', 'tree-child-leaves');
      this.forEach(item.children, (child) => {
        const childLeaf = this.renderLeaf(child);
        children.appendChild(childLeaf);
      }, this);

      if (!item.expanded) {
        children.classList.add('hidden');
      }
      leaf.appendChild(children);
    } else {
      expando.classList.add('hidden');
    }
    return leaf;

  }

  forEach(array, callback, scope) {

    const length = array.length;

    for (let i = 0; i < length; i++) {
      callback.call(scope, array[i], scope);
    }
  }

  isDomElement(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      // Some browsers don't support using the HTMLElement so some erxtra
      // checks are needed.
      return typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object';
    }
  }

  getColor(status: number) {

    switch (status) {
      case TreeStatus.ADDED:
        return 'added'
      case TreeStatus.CHANGED:
        return 'changed'
      case TreeStatus.DELETED:
        return 'deleted'
    }
  }
}

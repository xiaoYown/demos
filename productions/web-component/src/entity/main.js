class TextReverse extends HTMLElement {

  static get observedAttributes() {
    return ['props:text'];
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `* {
        background: red;
    }`

    shadowRoot.appendChild(style);

    console.log(style.isConnected);

    const text = this.getAttribute('props:text') || '';
    const span = document.createElement('span');

    span.textContent = text.split('').reverse().join('');
    shadowRoot.appendChild(span);

    this.elementSpan = span;
  }

  elementSpan = null;

  // 当 custom element 首次被插入文档 DOM 时，被调用
  connectedCallback(options) {
    console.log('connect', options)
  }
  
  // 当 custom element 从文档 DOM 中删除时，被调用
  disconnectedCallback(options) {
    console.log('disconnect', options)
  }
  
  // 当 custom element 被移动到新的文档时，被调用
  adoptedCallback(options) {
    console.log('adopted', options)
  }

  // 当 custom element 增加、删除、修改自身属性时，被调用
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case  'props:text':
        this.elementSpan.textContent = newValue || '';
        break;
    }
  }
}

let isRegistered = false;

function registerTextReverse() {
  !isRegistered && customElements.define('text-reverse-1.0', TextReverse);
  isRegistered = true;
}

registerTextReverse()
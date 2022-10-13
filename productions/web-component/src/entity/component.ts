class TextReverse extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const text = this.getAttribute('text') || '';
    const wrapper = document.createElement('span');
    wrapper.textContent = text.split('').reverse().join('');
    shadowRoot.appendChild(wrapper);
  }
}

let isRegistered = false;

function registerTextReverse(): void {
  !isRegistered && customElements.define('text-reverse', TextReverse);

  isRegistered = true;
}

registerTextReverse();

export default registerTextReverse;

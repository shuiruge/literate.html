// For the problem that custom element cannot get innerHTML:
// https://stackoverflow.com/a/62966393/1218716
// And for naming custom elements:
// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name

class BlockChunk extends HTMLElement {
  get name() {
    return this.getAttribute('name');
  }
  connectedCallback() {
    setTimeout(() => {
      var div = document.createElement("div");
      div.setAttribute("class", "block-chunk");

      var head = document.createElement("span");
      head.setAttribute("class", "block-chunk-head");
      var title = document.createElement("strong");
      title.innerHTML = this.name;
      head.appendChild(title);
      var button = document.createElement("button");
      button.innerHTML = "tangle";
      button.onclick = () => {
        // TODO: tangle
        return false;
      }
      head.appendChild(button);
      div.appendChild(head);

      var pre = document.createElement("pre");
      pre.innerHTML = this.innerHTML;
      div.appendChild(pre);

      this.parentNode.replaceChild(div, this);
    });
  }
}

class InlineChunk extends HTMLElement {
  get name() {
    return this.getAttribute('name');
  }
  connectedCallback() {
    setTimeout(() => {
      var span = document.createElement("span")
      span.setAttribute("class", "inline-chunk");

      var head = document.createElement("strong");
      head.innerHTML = this.name;
      span.appendChild(head);

      span.appendChild(document.createTextNode(" ≡⟨ "));
      var code = document.createElement("code");
      code.innerHTML = this.innerHTML;
      span.appendChild(code);
      span.appendChild(document.createTextNode(" ⟩"));

      this.parentNode.replaceChild(span, this);
    });
  }
}

class ChunkRef extends HTMLElement {
  get name() {
    return this.getAttribute('name');
  }
  connectedCallback() {
    setTimeout(() => {
      var span = document.createElement('span')
      span.setAttribute("class", "chunk-ref");
      span.innerHTML = `⟨${this.name}⟩`;
      this.parentNode.replaceChild(span, this);
    });
  }
}
customElements.define('block-chunk', BlockChunk);
customElements.define('inline-chunk', InlineChunk);
customElements.define('chunk-ref', ChunkRef);

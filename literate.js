/* Bootstrap literate.html */

function weaveChunkRef(chunkRef) {
  var span = document.createElement("span");
  span.setAttribute("class", "chunk-name");

  var chunkName = chunkRef.innerHTML;
  if (chunkRef.parentNode.getAttribute("class") == "chunk") {
    span.innerHTML = chunkName;
  } else {
    var code = document.createElement("code");
    code.innerHTML = chunkName;
    span.appendChild(code);
  }

  chunkRef.innerHTML = null;
  chunkRef.appendChild(document.createTextNode("⟨"));
  chunkRef.appendChild(span);
  chunkRef.appendChild(document.createTextNode("⟩"));
}

function weaveChunk(chunk) {
  if (!chunk.getAttribute("name")) {
    alert("ERROR 1");
    throw new Error("Block chunk has no name");
  }

  if ((chunk.tagName == 'DIV') && (chunk.getAttribute("class") == "chunk")) {
    weaveBlockChunk(chunk);
  } else {
    weaveInlineChunk(chunk);
  }
}

function weaveBlockChunk(chunk) {
  var head = document.createElement("span");
  head.setAttribute("class", "block-chunk-head");
  var title = chunk.getAttribute("name");
  head.appendChild(document.createTextNode(title));
  var button = document.createElement("button");
  button.innerHTML = "tangle";
  button.onclick = () => {
    tangle(chunk);
  }
  head.appendChild(button);

  var code = document.createElement('pre');
  code.innerHTML = chunk.innerHTML;

  chunk.innerHTML = null;
  chunk.appendChild(head);
  chunk.appendChild(code);
}

function weaveInlineChunk(chunk) {
    var head = document.createElement("span");
    head.setAttribute("class", "inline-chunk-head");
    head.innerHTML = chunk.getAttribute("name");

    var code = document.createElement("code");
    code.innerHTML = chunk.innerHTML;

    chunk.innerHTML = null;
    chunk.appendChild(head);
    chunk.appendChild(document.createTextNode(" ≡⟨ "));
    chunk.appendChild(code);
    chunk.appendChild(document.createTextNode(" ⟩"));
}

function weave() {
  var chunkRefs = document.getElementsByClassName('chunkref');
  for (var i = 0; i < chunkRefs.length; i++) {
    weaveChunkRef(chunkRefs[i]);
  }
  var chunks = document.getElementsByClassName('chunk');
  for (var i = 0; i < chunks.length; i++) {
    weaveChunk(chunks[i]);
  }
}

onload = weave;

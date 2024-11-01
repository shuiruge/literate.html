/* Bootstrap literate.html */

function weaveChunkRef(chunkRef) {
  /* Create unwoven span */
  var unwoven = document.createElement("span");
  unwoven.setAttribute("class", "unwoven");
  unwoven.setAttribute("hidden", true);
  unwoven.innerHTML = chunkRef.innerHTML;
  /* Replace HTML */
  var chunkName = chunkRef.innerHTML;
  chunkRef.innerHTML = null;
  chunkRef.appendChild(document.createTextNode(`⟨${chunkName}⟩`));
  chunkRef.appendChild(unwoven);
}

function unweave(elem) {
  for (var i = 0; i < elem.children.length; i++) {
    var child = elem.children[i];
    if (child.getAttribute("class") == "unwoven") {
      return child.innerHTML;
    }
  }
  throw new Error("[unweave] no unwoven span found in element: " + elem.innerHTML);
}

function weaveInlineChunk(chunk) {
  /* Create unwoven span */
  var unwoven = document.createElement("span");
  unwoven.setAttribute("class", "unwoven");
  unwoven.setAttribute("hidden", true);
  unwoven.innerHTML = chunk.innerHTML;
  /* Create chunk head span */
  var chunkHead = document.createElement("span");
  chunkHead.setAttribute("class", "inline-chunk-head");
  chunkHead.innerHTML = `⟨${chunk.getAttribute("name")}⟩≡`;
  /* Create code */
  var code = document.createElement("code");
  code.innerHTML = chunk.innerHTML;
  /* Replace HTML */
  chunk.innerHTML = null;
  chunk.appendChild(chunkHead);
  chunk.appendChild(code);
  chunk.appendChild(unwoven);
}

function weaveBlockChunk(chunk) {
  /* Create unwoven span */
  var unwoven = document.createElement("div");
  unwoven.setAttribute("class", "unwoven");
  unwoven.setAttribute("hidden", true);
  unwoven.innerHTML = chunk.innerHTML;

  /* Create chunk head span */
  var tangleLink = document.createElement("a");
  var chunkName = chunk.getAttribute("name");
  tangleLink.setAttribute("href", "javascript:void(0)");
  tangleLink.setAttribute("onclick", `tangle('${chunkName}')`);
  tangleLink.innerHTML = chunkName;
  var chunkHead = document.createElement("span");
  chunkHead.setAttribute("class", "block-chunk-head");
  chunkHead.appendChild(document.createTextNode("⟨"));
  chunkHead.appendChild(tangleLink);
  chunkHead.appendChild(document.createTextNode("⟩≡"));

  /* Create pre */
  var pre = document.createElement("pre");
  var code = document.createElement("code");
  code.innerHTML = chunk.innerHTML;
  pre.appendChild(code);

  /* Replace HTML */
  chunk.innerHTML = null;
  chunk.appendChild(chunkHead);
  chunk.appendChild(pre);
  chunk.appendChild(unwoven);
}

function weaveChunk(chunk) {
  if (!chunk.getAttribute("name")) {
    alert("ERROR 1");
    throw new Error("[weaveChunk]: block chunk has no name");
  }

  if ((chunk.tagName == 'DIV') && (chunk.getAttribute("class") == "chunk")) {
    weaveBlockChunk(chunk);
  } else {
    weaveInlineChunk(chunk);
  }
}

function weave() {
  /* Weave chunk references */
  var chunkRefs = document.getElementsByClassName("chunkref");
  for (var i = 0; i < chunkRefs.length; i++) {
    weaveChunkRef(chunkRefs[i]);
  }
  /* Weave chunks */
  var chunks = document.getElementsByClassName("chunk");
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    if (chunk.tagName == "SPAN") {
      weaveInlineChunk(chunk);
    } else if (chunk.tagName == "DIV") {
      weaveBlockChunk(chunk);
    } else {
      throw new Error("[weave] unknown chunk type: " + chunk.tagName);
    }
  }
}

function _tangle(chunkName) {
  console.log("Tangling " + chunkName);
  var chunks = document.getElementsByName(chunkName);
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    console.log(chunk.getAttribute("export") == undefined);
    unweave(chunk);
  }
}

function __tangle(chunkName) {
  var html = "";

  console.log("Tangling " + chunkName);
  var chunks = document.getElementsByName(chunkName);
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    unweave(chunk);
    /* Get the unwoven, which is always the last child */
    var unwoven = chunk.children[chunk.children.length - 1];
    console.log(unwoven);
    for (var j = 0; j < unwoven.children.length; j++) {
      var child = unwoven.children[j];
      console.log(child);
      if (child.getAttribute("class") == 'chunkref') {
        var unwovenChunkRef = child.children[child.children.length - 1];
        console.log(unwovenChunkRef.textContent);
        html += _tangle(unwovenChunkRef.textContent);
        console.log("111 " + html);
      } else {
        html += child.textContent;
        console.log("222 " + html);
      }
    }
  }
  return html;
}

function tangle(chunkName) {
  html = _tangle(chunkName);
  // var tab = window.open('about:blank', '_blank');
  // tab.document.write(html);
  // tab.document.close();
}

onload = () => {
  weave();
}

/* Bootstrap literate.html */

function weaveChunkRef(chunkRef) {
  /* Create unwoven span */
  var unwoven = document.createElement("span");
  unwoven.setAttribute("class", "unwoven");
  unwoven.setAttribute("hidden", true);
  unwoven.innerHTML = chunkRef.innerHTML;
  /* replace HTML */
  var chunkName = chunkRef.innerHTML;
  chunkRef.innerHTML = null;
  chunkRef.appendChild(document.createTextNode(`⟨${chunkName}⟩`));
  chunkRef.appendChild(unwoven);
}

function unweave(elem) {
  var unwoven = elem.getElementsByClassName("unwoven")[0]
  if (unwoven == undefined) {
    throw new Error("No unwoven element found.");
  }
  return unwoven.innerHTML;
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
  /* replace HTML */
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
  var chunkHead = document.createElement("span");
  chunkHead.setAttribute("class", "block-chunk-head");
  chunkHead.append(document.createTextNode("⟨"));
  tangleLink = document.createElement("a");
  var chunkName = chunk.getAttribute("name");
  tangleLink.setAttribute("href", "#");
  tangleLink.setAttribute("onclick", `tangle('${chunkName}')`);
  tangleLink.innerHTML = chunkName;
  chunkHead.append(tangleLink);
  chunkHead.append(document.createTextNode("⟩≡"));
  /* Create pre */
  var pre = document.createElement("pre");
  pre.innerHTML = chunk.innerHTML;
  /* replace HTML */
  chunk.innerHTML = null;
  chunk.appendChild(chunkHead);
  chunk.appendChild(pre);
  chunk.appendChild(unwoven);
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
      throw new Error("Unknown chunk type: " + chunk.tagName);
    }
  }
}

function tangle(chunkName) {
  alert("Not implemented yet!");
}


onload = weave;

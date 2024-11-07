/* Literate Programming in HTML */

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
      return child;
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

function regularizeCodeBlock(text) {
  var result = "";
  var indentation = 0;
  var whitespaceCount = 0;
  var counting = false;
  for (var i = 0; i < text.length; i++) {
    if ((result == "") && (text[i] == ' ')) {
      indentation++;
    }
    else if ((result == "") && (text[i] == '\n')) {
      indentation = 0;
    }
    else if (result == "") {
      result += text[i];
    }
    else if (text[i] == '\n') {
      whitespaceCount = 0;
      counting = true;
      result += text[i];
    }
    else if ((counting == true) && (text[i] == ' ')) {
      whitespaceCount++;
    }
    else if (counting == true) {
      counting = false;
      if (whitespaceCount < indentation) throw new Error("[regularizeCodeBlock] indentation error");
      for (var j = 0; j < (whitespaceCount - indentation); j++) result += " ";
      result += text[i];
    }
    else {
      result += text[i];
    }
  }
  for (var i = (result.length - 1); i >= 0; i--) {
    if (result[i] == '\n') {
      result = result.substring(0, i);
    }
    else {
      break;
    }
  }
  return result;
}

function regularize() {
  var divs = document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].getAttribute("class") == "chunk") {
      divs[i].innerHTML = regularizeCodeBlock(divs[i].innerHTML);
    }
  }
  var pres = document.getElementsByTagName("pre");
  for (var i = 0; i < pres.length; i++) {
    var codes = pres[i].getElementsByTagName("code");
    for (var j = 0; j < codes.length; j++) {
      codes[j].innerHTML = regularizeCodeBlock(codes[j].innerHTML);
    }
  }
}

function weave() {
  regularize();
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
    }
    else if (chunk.tagName == "DIV") {
      weaveBlockChunk(chunk);
    }
    else {
      throw new Error("[weave] unknown chunk type: " + chunk.tagName);
    }
  }
}

function _tangle(chunkName) {
  var code = "";
  var chunks = document.getElementsByName(chunkName);
  for (var i = 0; i < chunks.length; i++) {
    if (chunks[i].getAttribute("class") != "chunk") continue;
    var unwoven = unweave(chunks[i]).cloneNode(true);
    /* Deal with chunk references */
    var chunkRef = getFirstChildByClass(unwoven, "chunkref");
    while (chunkRef != undefined) {
      var subChunkName = unweave(chunkRef).innerHTML;
      var subCode = _tangle(subChunkName);
      /* Block chunk needs indentation */
      if (chunks[i].tagName == "DIV") {
        var indentation = getIndentation(chunkRef);
        subCode = indent(subCode, indentation);
      }
      var subCodeNode = document.createElement("span");
      subCodeNode.innerHTML = subCode;
      chunkRef.replaceWith(subCodeNode);
      chunkRef = getFirstChildByClass(unwoven, "chunkref");
    }
    code += unwoven.innerHTML;
    if (i < chunks.length - 1) code += "\n";
  }
  return code;
}

function tangle(chunkName) {
  var code = _tangle(chunkName);
  html = `<!doctype html><html>` +
         `<head><meta charset="utf-8"><title>${chunkName}</title>` +
         `<style>body { background-color: #c7edcc; }</style></head>` +
         `<body><pre><code>${code}</code></pre></body>` +
         `</html>`;
  var win = window.open('about:blank', '_blank');
  win.document.write(html);
  win.document.close();
}

function getFirstChildByClass(node, className) {
  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i];
    if (child.getAttribute("class") == className) {
      return child;
    }
  }
  return undefined;
}

function getTextBefore(node) {
  const rangeBefore = document.createRange();
  rangeBefore.setStart(node.parentNode.firstChild, 0);
  rangeBefore.setEndBefore(node);
  const textBefore = rangeBefore.toString();
  return textBefore;
}

function getIndentation(chunkRef) {
  var textBefore = getTextBefore(chunkRef);
  var indentation = 0;
  for (var i = textBefore.length - 1; i >= 0; i--) {
    if (textBefore[i] == ' ') {
      indentation++;
    } else {
      break;
    }
  }
  return indentation;
}

function indent(text, indentation) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    result += text[i];
    if (text[i] == '\n') {
      for (var j = 0; j < indentation; j++) result += ' ';
    }
  }
  return result;
}
onload = () => {
  weave();
}

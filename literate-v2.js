function unweave(elem) {
    var unwoven = elem.getElementsByTagName("unwoven");
    if (unwoven != null) {
        return unwoven;
    }
    throw new Error(`[unweave] no unwoven span found in element: "${elem.innerHTML}"`);
}

function weaveChunkref(chunkref) {
    /* Create unwoven span */
    var unwoven = document.createElement("span");
    unwoven.setAttribute("class", "unwoven");
    unwoven.setAttribute("hidden", true);
    unwoven.innerHTML = chunkref.innerHTML;

    /* Create id and link to the first chunk */
    var id = null;
    var chunkName = chunkref.innerHTML;
    var chunks = document.getElementsByName(chunkName);
    for (var i = 0; i < chunks.length; i++) {
        if ((chunks[i].nodeName != "CHUNK") && (chunks[i].nodeName != "BLOCKCHUNK")) continue;
        console.log(chunkName);
        id = chunkName.replaceAll(" ", "-");
        console.log(id);
        chunks[i].setAttribute("id", id);
        console.log(chunks[i].innerHTML);
        break;
    }
    if (id == null) throw new Error(`[weaveChunkref] no chunk found for "${chunkName}"`);
    var link = document.createElement("a");
    link.setAttribute("href", `#${id}`);
    link.setAttribute("class", "chunkref-link");
    link.innerHTML = chunkName;

    /* Replace node */
    var woven = document.createElement("span");
    woven.appendChild(document.createTextNode("⟨"));
    woven.appendChild(link);
    woven.appendChild(document.createTextNode("⟩"));
    woven.appendChild(unwoven);
    chunkref.replaceWith(woven);
}

function weaveChunk(chunk) {
    /* Create unwoven span */
    var unwoven = document.createElement("span");
    unwoven.setAttribute("class", "unwoven");
    unwoven.setAttribute("hidden", true);
    unwoven.innerHTML = chunk.innerHTML;

    /* Create chunk head span */
    var chunkHead = document.createElement("span");
    chunkHead.setAttribute("class", "chunk-head");
    chunkHead.innerHTML = `⟨${chunk.getAttribute("name")}⟩≡`;

    /* Create code */
    var code = document.createElement("code");
    code.innerHTML = chunk.innerHTML;

    /* Replace node */
    var woven = document.createElement("span");
    woven.setAttribute("class", "chunk")
    woven.setAttribute("id", chunk.getAttribute("id"));
    woven.appendChild(chunkHead);
    woven.appendChild(code);
    woven.appendChild(unwoven);
    chunk.replaceWith(woven);
}

function weaveBlockchunk(blockchunk) {
    /* Create unwoven span */
    var unwoven = document.createElement("div");
    unwoven.setAttribute("class", "unwoven");
    unwoven.setAttribute("hidden", true);
    unwoven.innerHTML = blockchunk.innerHTML;

    /* Create chunk head span */
    var tangleLink = document.createElement("a");
    var chunkName = blockchunk.getAttribute("name");
    tangleLink.setAttribute("href", "javascript:void(0)");
    tangleLink.setAttribute("onclick", `tangle('${chunkName}')`);
    tangleLink.innerHTML = chunkName;
    var chunkHead = document.createElement("span");
    chunkHead.setAttribute("class", "blockchunk-head");
    chunkHead.appendChild(document.createTextNode("⟨"));
    chunkHead.appendChild(tangleLink);
    chunkHead.appendChild(document.createTextNode("⟩≡"));

    /* Create blockcode */
    var blockcode = document.createElement("blockcode");
    blockcode.innerHTML = blockchunk.innerHTML;

    /* Replace node */
    var woven = document.createElement("div");
    woven.setAttribute("class", "blockchunk");
    woven.setAttribute("id", blockchunk.getAttribute("id"));
    woven.appendChild(chunkHead);
    woven.appendChild(blockcode);
    woven.appendChild(unwoven);
    blockchunk.replaceWith(woven)
}

function regularizeBlockcodeText(text) {
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

function processBlockcodeElements() {
    while (true) {
        var blockcodes = document.getElementsByTagName("blockcode");
        if (blockcodes.length == 0) break;
        var code = document.createElement("code");
        code.innerHTML = regularizeBlockcodeText(blockcodes[0].innerHTML);
        var pre = document.createElement("pre");
        pre.appendChild(code);
        blockcodes[0].replaceWith(pre);
    }
}

function weaveAll() {
    while (true) {
        var chunkrefs = document.getElementsByTagName("chunkref");
        if (chunkrefs.length == 0) break;
        weaveChunkref(chunkrefs[0]);
    }
    while (true) {
        var chunks = document.getElementsByTagName("chunk");
        if (chunks.length == 0) break;
        weaveChunk(chunks[0]);
    }
    while (true) {
        var blockchunks = document.getElementsByTagName("blockchunk");
        if (blockchunks.length == 0) break;
        weaveBlockchunk(blockchunks[0]);
    }
    processBlockcodeElements();
}

function _tangle(chunkName) {
  var code = "";
  var chunks = document.getElementsByName(chunkName);
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    if (chunk.getAttribute("class") != "chunk") continue;
    var unwoven = unweave(chunk).cloneNode(true);
    /* Deal with chunk references */
    var chunkRef = getFirstChildByClass(unwoven, "chunkref");
    while (chunkRef != undefined) {
      var subChunkName = unweave(chunkRef).innerHTML;
      var subCode = _tangle(subChunkName);
      /* Block chunk needs indentation */
      if (chunk.tagName == "DIV") {
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
    /* Append newline */
    var appendNewline = chunk.getAttribute("append-newline");
    if (appendNewline == null) {
      appendNewline = 0;
    }
    else if (appendNewline == "") {
      appendNewline = 1;
    }
    else if (!isNaN(appendNewline)) {
      appendNewline = parseInt(appendNewline);
    }
    else {
      throw new Error(`[_tangle] the value of append-newline must be an integer, but got "${appendNewline}"`);
    }
    for (var j = 0; j < appendNewline; j++) code += "\n";
  }
  return code;
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

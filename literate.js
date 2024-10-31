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

//function weaveBlockChunk(chunk) {
//  var head = document.createElement("span");
//  head.setAttribute("class", "block-chunk-head");
//  var title = chunk.getAttribute("name");
//  head.appendChild(document.createTextNode(title));
//  var button = document.createElement("button");
//  button.innerHTML = "tangle";
//  button.onclick = () => {
//    tangle(chunk);
//  }
//  head.appendChild(button);
//
//  var code = document.createElement('pre');
//  code.innerHTML = chunk.innerHTML;
//
//  var origin = document.createElement("div");
//  origin.setAttribute("class", "origin");
//  origin.setAttribute("hidden", true);
//  origin.innerHTML = chunk.innerHTML;
//
//  chunk.innerHTML = null;
//  chunk.appendChild(head);
//  chunk.appendChild(code);
//  chunk.appendChild(origin);
//  chunk.setAttribute("woven", true);
//  console.log(chunk);
//}

//function weaveInlineChunk(chunk) {
//  var head = document.createElement("span");
//  head.setAttribute("class", "inline-chunk-head");
//  head.innerHTML = chunk.getAttribute("name");
//
//  var code = document.createElement("code");
//  code.innerHTML = chunk.innerHTML;
//
//  var origin = document.createElement("span");
//  origin.setAttribute("class", "origin");
//  origin.setAttribute("hidden", true);
//  origin.innerHTML = chunk.innerHTML;
//
//  chunk.innerHTML = null;
//  chunk.appendChild(head);
//  chunk.appendChild(document.createTextNode(" ≡⟨ "));
//  chunk.appendChild(code);
//  chunk.appendChild(document.createTextNode(" ⟩"));
//  chunk.appendChild(origin);
//  chunk.setAttribute("woven", true);
//}

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
  console.log(chunk);
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

// function tangle(woven) {
//   console.log(woven);
//   return;
//   recursiveTangle(woven);
  
//   /* Replace all chunkrefs in the chunk with their contents. */
//   // var chunkRefs = chunk.getElementsByClassName('chunkref');
//   // for (var i = 0; i < chunkRefs.length; i++) {
//   //   replaceChunkRef(chunk, chunkRefs[i]);
//   // }

//   // var tab = window.open('about:blank', '_blank');
//   // tab.document.write(chunk.outerHTML);
//   // tab.document.close();
// }


// function unweave(woven) {
//   console.log('unweaving: ', woven);
//   // Unfortunately, since weaving is inplace, we have to tangle from the woven instead of the origin. So, beforing tangling, we ave to unweave the woven.
//   if (woven.getAttribute("class") == 'chunkref') {
//     return unweaveChunkRef(woven);
//   }
//   if (woven.tagName == 'DIV') {
//     return unweaveBlockChunk(woven);
//   }
//   return unweaveInlineChunk(woven);
// }

// function unweaveChunkRef(woven) {
//   var chunk = woven.cloneNode(true);
//   var chunkName = chunk.childNodes[1];
//   // Since the chunkName may include a <code> tag, we use textContent instead of innerHTML to exclude all HTML tags.
//   chunk.innerHTML = chunkName.textContent;
//   return chunk;
// }

// function unweaveBlockChunk(woven) {
//   var chunk = woven.cloneNode(true);
//   var pre = chunk.childNodes[1];
//   chunk.innerHTML = pre.innerHTML;
//   return chunk;
// }

// function unweaveInlineChunk(woven) {
//   var chunk = woven.cloneNode(true);
//   var code = chunk.childNodes[2];
//   chunk.innerHTML = code.innerHTML;
//   return chunk;
// }

// function recursiveTangle(woven) {
//   var chunk = unweave(woven);

//   var chunkRefs = chunk.getElementsByClassName('chunkref');
//   for (var i = 0; i < chunkRefs.length; i++) {
//     var chunkName = unweave(chunkRefs[i]).innerHTML;
//     var subchunks = document.getElementsByName(chunkName);
//     var code = document.createTextNode("");
//     for (var j = 0; j < subchunks.length; j++) {
//       alert(j);
//       console.log(j, subchunks[j]);
//       var subchunk = unweave(subchunks[j]);
//       if (subchunk.getAttribute("class") != "chunk") continue;
//       code.appendChild(recursiveTangle(subchunk).innerHTML);
//     // replaceChunkRef(chunk, chunkRefs[i]);
//     }
//     chunk.replaceChild(code, chunkRefs[i]);
//   }
//   return chunk;
// }

onload = weave;

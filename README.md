# literate.html

Literate programming in HTML.

## Design

```html
<p>Say hello in C.</p>

<chunk name="hello.c>
  #include <stdio.h>
  
  void main() {
    <chunkref name="say hello"/>
  }
</chunk>

<p>wherein</p>

<chunk name="say hello">
  printf("Hello, world!\n");
</chunk>
```

The `<chunk>` tag shall be named. It may have other attributes, like `lang` for indicating the programming language used in the chunk.

We use JavaScript to transcript the `<chunkref name="say hello"/>` element to `&#10216;say hello&#10217;`, which is &#10216;say hello&#10217;, and the `<chunk name=chunkname>...</chunk>` element to `<div class="chunk"><pre>...</pre></div>`. In addition, there will be a tangle button at the beginning of each `<chunk>` element. Clicking the button will tangle the chunk in the `<chunk>` element, popup a new window for showing the tangled code.

## References

- http://www.axiom-developer.org/axiom-website/litprog.html

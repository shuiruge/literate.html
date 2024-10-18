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

Displayed in browser, the `<chunkref name="say hello"/>` element will be converted to `&#10216;<a href="#say-hello">say hello</a>&#10217;`, which is &#10216;<a href="#say-hello">say hello</a>&#10217;. Also, there will be a tangle button at the beginning of each `<chunk>` element. Clicking the button will tangle the chunk in the `<chunk>` element, popup a new window for showing the tangled code.

## References

- http://www.axiom-developer.org/axiom-website/litprog.html


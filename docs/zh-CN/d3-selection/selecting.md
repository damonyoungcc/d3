# 选择元素 Selecting elements

*selection* 来自 DOM 的一组元素。通常这些元素是通过[选择器](http://www.w3.org/TR/selectors-api/)进行标识的，比如 `.fancy` 表示带有 *fancy* 类名的元素，或者 `div` 表示选择 DIV 元素。

选择方法有两种形式：**select** and **selectAll**。前者仅选择第一个匹配的元素，而后者选择所有按文档顺序匹配的元素。顶层选择方法 [d3.select](#select) 和 [d3.selectAll](#selectAll) 查询整个文档；子选择方法 [*selection*.select](#selection_select) 和 [*selection*.selectAll](#selection_selectAll) 限制选择为所选元素的后代。还有 [*selection*.selectChild](#selection_selectChild) 和 [*selection*.selectChildren](#selection_selectChildren)用于直接选择子元素。

按照惯例，返回当前选择集的选择方法如 [*selection*.attr](./modifying.md#selection_attr) 使用四个空格的缩进，而返回新选择集的方法只使用两个空格。这有助于通过使其在链式操作中突出显示来显示上下文的变化。

```js
d3.select("body")
  .append("svg") // 这里选择集为 svg
    .attr("width", 960) // 设置 svg 的宽
    .attr("height", 500)
  .append("g") // 这里选择集变为 g
    .attr("transform", "translate(20,20)")
  .append("rect") // 这里选择集变为 rect
    .attr("width", 920)
    .attr("height", 460);
```

## selection() {#selection}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/index.js) · [Selects](#select) 选择根元素, `document.documentElement`.

```js
const root = d3.selection();
```

这个函数也可以用来测试选择集（`instanceof d3.selection`），或者用来扩展选择集的原型。例如，可以添加一个用于检查复选框的方法：


```js
d3.selection.prototype.checked = function(value) {
  return arguments.length < 1
      ? this.property("checked")  // 不传参数表示获取 checkbox 的 checked状态并返回
      : this.property("checked", !!value); // 传递参数，则代表设置 checkbox 的 checked状态，并返回选择集
};
```

然后可以这样调用:

```js
d3.selectAll("input[type=checkbox]").checked(true);
```

## select(*选择器 selector*) {#select}

[源码](https://github.com/d3/d3-selection/blob/main/src/select.js) · 选择第一个与指定的 *选择器 selector* 字符串匹配的元素。

```js
const svg = d3.select("#chart");
```

如果没有元素与 *selector* 匹配，将返回一个空的选择集。如果有多个元素与 *selector* 匹配，只会选择第一个匹配的元素（按文档顺序）。例如，要选择第一个锚点元素：

```js
const anchor = d3.select("a");
```

如果 *selector* 不是字符串，则选择指定的节点；如果您已经有一个对节点的引用，比如 `document.body`，这会很有用。

```js
d3.select(document.body).style("background", "red");
```

或者，要使被点击的段落变为红色：

```js
d3.selectAll("p").on("click", (event) => d3.select(event.currentTarget).style("color", "red"));
```

## selectAll(*selector*) {#selectAll}

[源码](https://github.com/d3/d3-selection/blob/main/src/selectAll.js) · 选择所有与指定的 *选择器 selector* 字符串匹配的元素。

```js
const p = d3.selectAll("p");
```

元素将按文档顺序（从上到下）被选择。如果文档中没有元素与 *选择器 selector* 匹配，或者 *选择器 selector* 为 null 或未定义，则返回一个空的选择集。

如果 *选择器 selector* 不是字符串，而是一个数组，那么将选择指定的节点数组；如果已经对节点有了引用，比如在事件监听器中的 `this.childNodes`，或者像 `document.links` 这样的全局变量。这些节点也可以是可迭代对象，或者是伪数组，比如 NodeList。例如，要将所有链接设置为红色：

```js
d3.selectAll(document.links).style("color", "red");
```

## *selection*.select(*selector*) {#selection_select}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/select.js) · 对于每个已选择的元素，选择第一个与指定的 *选择器 selector* 字符串匹配的后代元素。

```js
const b = d3.selectAll("p").select("b"); // 所有 <p> 标签的第一个 <b> 标签
```

如果没有元素与当前元素的指定选择器匹配，返回的选择集中的当前索引位置的元素将为 null。（如果 *选择器 selector* 为 null，则返回的选择集中的每个元素都将为 null，从而得到一个空的选择集。）如果当前元素有关联的数据，这些数据将传播到相应的所选元素。如果多个元素与选择器匹配，只会选择文档顺序中的第一个匹配元素。

如果 *选择器 selector* 是一个函数，它会对每个已选择的元素进行评估，按顺序传递当前的数据 (*d*)，当前的索引 (*i*)，和当前的组 (*nodes*)，其中 *this* 作为当前的DOM元素 (*nodes*[*i*])。它必须返回一个元素，或者如果没有匹配元素则返回 null。例如，要选择每个段落的前一个兄弟元素：

```js
const previous = d3.selectAll("p").select(function() {
  return this.previousElementSibling;
});
```

与 [*selection*.selectAll](#selection_selectAll) 不同，*selection*.select 不会影响分组：它会保留现有的分组结构和索引，并将数据（如果有）传播到所选的子元素。分组在 [data join 数据连接](./joining.md) 中起着重要作用。有关此主题的更多信息，请参阅 [嵌套选择 Nested Selections](http://bost.ocks.org/mike/nest/) 和 [选择工作原理 How Selections Work](http://bost.ocks.org/mike/selection/)。


:::warning 提醒
*selection*.select 将父元素的数据传播到所选的子元素。
:::

## *selection*.selectAll(selector) {#selection_selectAll}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/selectAll.js) · 对于每个已选择的元素，选择与指定的选择器字符串匹配的后代元素。

```js
const b = d3.selectAll("p").selectAll("b"); // 所有 <p> 标签下面所有 <b> 标签
```

返回的选择集中的元素是按照其对应的父节点在此选择集中分组的。如果当前元素没有元素与指定的选择器匹配，或者 *选择器 selector* 为 null，则当前索引位置的分组将为空。所选元素不会继承来自此选择集的数据；请使用 [*selection*.data](./joining.md#selection_data) 将数据传播到子元素。

如果 *选择器 selector* 是一个函数，它会对每个已选择的元素进行评估，按顺序传递当前的数据 (*d*)、当前的索引 (*i*)和当前的组 (*nodes*)，其中 *this* 作为当前的 DOM 元素 (*nodes*[*i*])。它必须返回一个元素数组（或一个可迭代对象，或类似于 NodeList 的伪数组），如果没有匹配的元素则返回空数组。例如，要选择每个段落的前一个和后一个兄弟元素：

```js
const sibling = d3.selectAll("p").selectAll(function() {
  return [
    this.previousElementSibling,
    this.nextElementSibling
  ];
});
```

与 [*selection*.select](#selection_select) 不同，*selection*.selectAll 会影响分组：每个所选的后代元素都会按照其在原始选择集中的父元素进行分组。分组在 [数据连接 data join](./joining.md) 中起着重要作用。有关此主题的更多信息，请参阅 [嵌套选择 Nested Selections](http://bost.ocks.org/mike/nest/) 和 [选择工作原理 How Selections Work](http://bost.ocks.org/mike/selection/) 。

## *selection*.filter(*filter*) {#selection_filter}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/filter.js) · 对选择集进行过滤，返回一个仅包含满足指定过滤条件的元素的新选择集。例如，要将表格行的选择集过滤为仅包含偶数行：

```js
const even = d3.selectAll("tr").filter(":nth-child(even)");
```

这大致等同于直接使用 [d3.selectAll](#selectAll) ，尽管索引可能不同：

```js
const even = d3.selectAll("tr:nth-child(even)");
```

*过滤器 filter* 可以指定为选择器字符串或函数。如果 *过滤器 filter* 是一个函数，它会对每个已选择的元素按顺序进行评估，传递当前的数据 (*d*)、当前的索引 (*i*) 和当前的组 (*nodes*)，其中 *this* 作为当前的DOM元素 (*nodes*[*i*])。使用函数：

```js
const even = d3.selectAll("tr").filter((d, i) => i & 1);
```

或者使用 [*selection*.select](#selection_select) （避免使用箭头函数，因为需要使用 *this* 来引用当前元素）：

```js
const even = d3.selectAll("tr").select(function(d, i) { return i & 1 ? this : null; });
```

请注意 `:nth-child` 伪类使用的是基于 1 的索引，而不是基于 0 的索引。另外，上述的过滤函数与`:nth-child` 并不完全相同；它们依赖于选择集的索引，而不是 DOM 中前面的兄弟元素的数量。

返回的过滤选择集会保留此选择集的父元素，但与数组的 [*array*.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 方法类似，它不会保留索引，因为可能会移除一些元素；如果需要保留索引，请使用 [*selection*.select](#selection_select)。

## *selection*.selectChild(*selector*) {#selection_selectChild}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/selectChild.js) · 返回一个新的选择集，其中包含当前选择集中每个元素的（第一个）与选择器匹配的子元素。

```js
d3.selectAll("p").selectChild("b") // 所有 <p> 标签下面第一个 <b> 标签
```

如果没有指定 *选择器 selector* ，则选择第一个子元素（如果有）。如果 *选择器 selector* 被指定为一个字符串，则选择第一个与之匹配的子元素（如果有）。如果选择器是一个函数，它会对每个子节点按顺序进行评估，传递当前子节点 (*child*)、子节点的索引 (*i*) 和子节点列表 (*children*)；如果选择器返回真值，该方法会选择第一个子节点，如果有的话。

:::warning 提醒
*selection*.selectChild 将父元素的数据传播到所选的子元素。
:::

## *selection*.selectChildren(*selector*) {#selection_selectChildren}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/selectChildren.js) · 返回一个新的选择集，其中包含当前选择集中每个元素的子元素与 *选择器 selector* 匹配的部分。如果没有指定 *选择器 selector*，则选择所有子元素。如果 *选择器 selector* 被指定为一个字符串，则选择与之匹配的子元素（如果有）。如果 *选择器 selector* 是一个函数，它会对每个子节点按顺序进行评估，传递当前子节点 (*child*)、子节点的索引 (*i*) 和子节点列表 (*children*)；该方法会选择所有选择器返回真值的子节点。

## *selection*.selection() {#selection_selection}

[源码](https://github.com/d3/d3-selection/blob/main/src/selection/index.js) · 返回选择集（为了与 [*transition*.selection](../d3-transition/selecting.md#transition_selection) 保持对称性）。

## matcher(*selector*) {#matcher}

[Source](https://github.com/d3/d3-selection/blob/main/src/matcher.js) · Given the specified *selector*, returns a function which returns true if `this` element [matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches) the specified selector. This method is used internally by [*selection*.filter](#selection_filter). For example, this:

```js
const div = selection.filter("div");
```

Is equivalent to:

```js
const div = selection.filter(d3.matcher("div"));
```

(Although D3 is not a compatibility layer, this implementation does support vendor-prefixed implementations due to the recent standardization of *element*.matches.)

## selector(*selector*) {#selector}

[Source](https://github.com/d3/d3-selection/blob/main/src/selector.js) · Given the specified *selector*, returns a function which returns the first descendant of `this` element that matches the specified selector. This method is used internally by [*selection*.select](#selection_select). For example, this:

```js
const div = selection.select("div");
```

Is equivalent to:

```js
const div = selection.select(d3.selector("div"));
```

## selectorAll(*selector*) {#selectorAll}

[Source](https://github.com/d3/d3-selection/blob/main/src/selectAll.js) · Given the specified *selector*, returns a function which returns all descendants of `this` element that match the specified selector. This method is used internally by [*selection*.selectAll](#selection_selectAll). For example, this:

```js
const div = selection.selectAll("div");
```

Is equivalent to:

```js
const div = selection.selectAll(d3.selectorAll("div"));
```

## window(*node*) {#window}

[Source](https://github.com/d3/d3-selection/blob/main/src/window.js) · Returns the owner window for the specified *node*. If *node* is a node, returns the owner document’s default view; if *node* is a document, returns its default view; otherwise returns the *node*.

## style(*node*, *name*) {#style}

[Source](https://github.com/d3/d3-selection/blob/main/src/selection/style.js) · Returns the value of the style property with the specified *name* for the specified *node*. If the *node* has an inline style with the specified *name*, its value is returned; otherwise, the [computed property value](https://developer.mozilla.org/en-US/docs/Web/CSS/computed_value) is returned. See also [*selection*.style](./modifying.md#selection_style).

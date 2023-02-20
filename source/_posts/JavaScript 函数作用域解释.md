---
title: JavaScript 函数作用域的解释
date: 2020-12-20 15:51:29
tags: ["javascript","函数作用域"]
---

# JavaScript 函数作用域的解释

本文将解释作用域的相关概念，我们将学习并理解作用域链的重要性。

## 测验时间

下面的代码执行后将会打印出什么？为什么？
``` javascript
function jerry() {
  console.log(name);
}

function tom() {
  var name = 'tom';
  jerry();
}

var name = 'cartoon';

tom();

```
是打印出 `cartoon`, `tom` 还是 `undefined` 吗? 更重要的是，你是怎么判断然后得到答案的？你用到了作用域了，执行上下文了吗？

## 作用域 Scope

上面题目的答案是，`cartoon`。 让我们进一步探索和理解它吧

> *In JavaScript, Scope is the mechanism to determine the accessibility of variables throughout their existence. It could be inside or outside of a function call.*

首先让我们将上面的代码拆分成几部分，然后看看变量的可访问性是如何随着变量声明的位置和函数的位置的变化而变化的。

## 回顾一下

以下是我们对 JavaScript 执行上下文理解的一些要点：

* 有一个叫做全局执行上下文（`Global Execution Context`）和函数执行上下文(`Function Execution Context`)的东西
* 每一个执行上下文都有一个特殊的　`this`  和 外部环境引用 `reference to the Outer Environment`
* 当我们调用函数时，JavaScript 引擎会创建当前函数的执行上下文和一个外部引用
* 函数可以访问外部引用中定义的变量。当 JavaScript 引擎无法在当前执行上下文中找到变量的时候，它就会去外部引用中去查找。

## 作用域和作用域链

在上面的代码中，有2个函数调用，tom() 和 jerry() ，因此会创建2个不同的函数执行上下文。

请记住，JS代码执行的时候始终会创建一个全局执行上下文，其中关键字 `this` 等于 `window` 对象。 因此在上面的代码中我们总共有3个执行上下文，一个全局执行上下文，两个函数执行上下文，分别是 `tom()`和`jerry()` 。
![functions.png](https://static.aalmix.com/20210309172743.jpg)

* 代码执行的时候先会在全局执行上下文中创建一个 `name` 变量，然后给这个变量复制为 `cargoon`

  ``` javascript
  var name = 'cartoon';
  ```
  
* 当调用`tom()`函数，Javascript 引擎会给`tom()`创建一个函数执行上下文和一个外部环境的引用（全局执行上下文）

  ``` javascript
  tom();
  ```

* 当 tom() 函数调用 `jerry()` 函数时，JavaScript 引擎会找到 jerry 函数申明的位置，然后创建 `jerry()`函数的执行上下文和外部环境引用

  ``` javascript
  function tom() {
   var name = 'tom';
   jerry();
  }
  ```

  等等，`jerry()` 函数的外部环境引用是谁？是 `tom()`函数的执行上下文还是全局执行上下文？这取决于另一个问题的答案

  > 谁调用了 jerry() 函数，它在哪里声明创建的？

  `jerry()` 函数是在全局执行上下文中创建的，尽管它是在 tom() 函数中调用。按照要点2的理解，jerry() 函数有一个指向全局执行执行上下文的指针。

  到目前为止，Are you OK ?  我们还发现，jerry() 函数中并没有申明 `name` 变量，但是在执行阶段它却尝试在控制台打印这个 `name` 变量的值

  ```javascript
  function jerry() {
    console.log(name);
  }
  ```

  这个时候，JavaScript 引擎会去 jerry() 函数的外部引用（全局执行上下文）中去查找 `name` 变量，然后它在全局执行上下文中找到了 cartoon 这个值。

  现在我们知道答案为什么是 `cartoon` 了吧。
  
  ![flow1](https://static.aalmix.com/20210309172749.gif)

​    

在当前执行上下文和外部引用中查找变量的整个过程就形成了的链条叫做`作用域链`。我们还可以得出结论，变量`name`在函数 jerry() 的作用域中，因为它是在 jerry() 函数作用域中被找到的。

![scope_chain](https://static.aalmix.com/20210309172753.jpg)



## 作用域的变化

测试时间又到了！下面的代码将会打印出什么？

``` javascript
function tom() {
  var name = 'tom';
  function jerry() {
    console.log(name);
  }
  jerry();
}

var name = 'cartoon';

tom();
```

这次我们稍微做了一些小改动，现在 jerry() 函数是在 tom() 函数里面创建的。jerry() 函数的外部引用将会指向 tom() 函数的执行上下文。因此变量 `name` 将在tom() 函数的作用域链中被找到。所以，上面的答案就是 `tom` !

![flow2](https://static.aalmix.com/20210309172759.gif)

## 块级作用域 Block Scope

既然我们理解了作用域的基本原理，那么就让我们来理解一下什么是块级作用域。代码块通过大括号定义`{...}`。

如果在代码块中使用 `let` 关键字申明变量，那么变量只在这个代码块中可以被访问。

``` javascript
{
  let name = "tom"; // only visible in this block

  console.log(name); // tom
}

console.log(name); // Error: name is not defined
```

如果我们使用 `var` 而不是 `let`  创建变量，就不存这个块级作用域了。

另一个例子：

``` javascript
{
  // declare name
  let name= "tom";
  console.log(name);
}

{
  // declare name in another block
  let name = "jerry";
  console.log(name);
}
```

上面的代码会在控制台中分别打印 tom 和 jerry 。

即使对于 `if`, for , while 等等，使用了 `let` 在块级作用域中声明的代码也只能在块中访问，下面是 for 循环的例子

``` javascript
for (let counter = 0; counter < 10; counter++) {
  // the variable counter is with let 
  // hence visible only inside the block {...}
  console.log(counter); 
}

console.log(counter); // Error, counter is not defined
```

## 总结

理解作用域的基本概念，比如执行上下文、外部引用等等，将有助于我们调试代码，作为 JavaScript 的开发者，我们对于了解JavaScript 内部代码的工作方式更有信息。



引用

- [Scope and Closure](https://leanpub.com/ydkjsy-scope-closures/read_sample) from You don't know JS yet series.
- [Variable Scope](https://javascript.info/closure) from [javascript.info](http://javascript.info/)
- https://developer.mozilla.org/en-US/docs/Glossary/Scope

文章来源： https://blog.greenroots.info/javascript-scope-fundamentals-with-tom-and-jerry-ckcq723h4007vkxs18dxa97ae
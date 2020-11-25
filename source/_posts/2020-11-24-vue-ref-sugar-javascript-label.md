title: 因为 Vue Ref 提案，我又刷了遍 label 语法
subtitle: 近日，Vue 作者在社区提交了一份 Ref 语法糖的提案，在看社区的争议时想起多年来未曾用过的 label 语法，本篇主要介绍及回顾下汇编、C、JavaScript 语言的 label 语法和使用。
cover: https://img13.360buyimg.com/ling/jfs/t1/134578/6/16945/152425/5fba44f5E8f778313/bb9a36a109e7e9d3.png
category: JavaScript
tags:

-   JavaScript
-   label
-   Vue
    author:
    nick: nobo
    github_name: bplok20010
    date: 2020-11-24 10:43:33

---

## label 0x0：Vue Ref 提案

近日，Vue 作者在社区提交了一份[Ref 语法糖的提案](https://github.com/vuejs/rfcs/blob/script-setup/active-rfcs/0000-script-setup.md)，引发了社区的争议。

关于 Ref 提案，它是将原本应该使用 **ref()** 调用的方式，通过 label 语法 **ref:** 进行简化编写，并在编译期间进行转换，所以这个本质上是个语法糖，示例如下，

原写法：

```xml
<script setup>
...
const count = ref(0) // ref调用
const inc = () => { count.value++ }
</script>
<template>
  <Foo :count="count" @click="inc" />
</template>
```

新提案写法：

```xml
<script setup>
...
ref: count = 1 // 使用label语法
function inc() {
  count++
}
</script>
<template>
  <button @click="inc">{{ count }}</button>
</template>
```

这个提议最大的争议在于，新提案的写法是符合 JS 语法，但却不符合 JS 的语义，按照 label 的语义，ref: count = 0 里的 ref: 是无任何意义的，既在运行时不做解析，但在 Vue 的 script setup 下却赋予了 **ref()** 的功能！

> label 语法通常很少被使用，以至于部分人在看到新提案的写法后认为是 Vue 的新魔法，纷纷表示学不动或认为应该将 Vue 的写法叫 VueScript。

在看到 ref 提案后又回想起多年来未曾用过的 label 语法，本篇主要介绍及回顾下汇编、C、JavaScript 语言的 label 语法和使用。

## label 0x1：汇编语言

汇编语言主要是汇编指令(语句)组成，一条指令有四个组成部分，如下：

```assembly
[label: ] mnemonic [operands] [;comment]
标号:（可选）+ 指令助记符（必需）+ 操作数（通常是必需的）+ 注释（可选）
```

示例：

```assembly
L0: mov ax,0; 这是一条汇编指令
```

标号（label）是一种标识符，是指令的位置标记。标号位于指令的前端，表示指令的地址。

默认情况下，CPU 是顺序加载并执行程序。但是，在实现类似条件跳转、循环等功能时，就需要使用跳转指令+lablel 来实现，汇编语言中有多种跳转指令，这里以 jmp 为例，语法如下：

```c++
jmp label(目标地址)
```

示例一：

```assembly
L1:
   mov ax,0
   ...
   jmp L1; 不断地循环
```

示例二：

```assembly
   mov ax,0
   mov ecx,5;循环5次
L1:
   inc ax
   loop L1
```

label 是伪指令，嵌入源代码中的命令，**由汇编器识别和执行，不在运行时执行**。

## label 0x2：C 语言

label 语法如下：

```c
label: statement
```

在汇编语言中将 label 当作指令的位置标记，C 语言中也是如此，C 语言使用 goto 语句配合跳转到指定的 label 处，类似汇编的 jmp 效果，goto 语法如下：

```c
goto label
```

示例

```c++
void func() {
    int a;
    a=0;
    loop:
    a++;
    if(a<10) goto loop; // 使用goto实现循环
    printf("%d",a);
}
```

由于 goto 的自由和灵活，在程序上可随意跳转，在使用不当的情况下会破坏“结构化”，不但带来编程的混乱,而且容易出错，所以在很多语言教学上都不建议使用。

## label 0x3：JavaScript 语言

label 语法如下：

```javascript
label: statement;
```

语法同 C 语言，但是 JS 没有 goto 语句，不能像 C、汇编那样随意跳转，JS 的 label 语法只能配合 break、continue 进行使用，单独使用时无意义。在 JS 里 continue/break label 应该算是一个阉割版 goto 语句。
**配合 continue 使用时，语法如下：**

```javascript
continue label;
```

示例：

```javascript
var i, j;
loop1: for (i = 0; i < 3; i++) {
	//The first for statement is labeled "loop1"
	loop2: for (j = 0; j < 3; j++) {
		//The second for statement is labeled "loop2"
		if (i === 1 && j === 1) {
			continue loop1;
		}
		console.log("i = " + i + ", j = " + j);
	}
}
```

特别注意：continue label 后的 label 必须紧跟着 for、while 一起时才可以，否则会报错，如下：

```javascript
// × 错误
loop1: {
	for (;;) continue loop1;
}
// √ 正确
loop1: for (;;) continue loop1;
```

**配合 break 使用时，语法如下：**

```javascript
break label;
```

相比 continue ，break label 的使用灵活会更大，可以和 For、While、Switch、Block 语句配合，如下：

```plain
label: ForStatement | WhileStatement | SwitchStatement | BlockStatement
```

示例一：

```javascript
var i, j;
// 使用for while switch等
loop1: for (i = 0; i < 3; i++) {
	//The first for statement is labeled "loop1"
	loop2: for (j = 0; j < 3; j++) {
		//The second for statement is labeled "loop2"
		if (i == 1 && j == 1) {
			break loop1;
		}
		console.log("i = " + i + ", j = " + j);
	}
}
```

示例二：

```javascript
// label: 语句块
outer_block: {
	inner_block: {
		console.log("1");
		break outer_block; // breaks out of both inner_block and outer_block
		console.log(":-("); // skipped
	}
	console.log("2"); // skipped
}
```

**单独使用 label**

label 在不配合 continue、break 使用时无意义，解释器会直接忽略 label，示例：

```javascript
test: 1 + 1;
// 2
```

## label 0x4：最后

label 语法在高级语言中的存在感都非常低，主要还是因为高级语法已经提供了非常多的控制语句，绝大部分场景下已经不需要使用 label、goto 这种相对直接的跳转。label 的作用本质上还是代码位置标记，以便类似 goto 的语句进行跳转，虽然大部分情况都是不建议使用，但有时 goto 可以大幅度简化代码量（如：跳出多层嵌套，跳出多层循环场景），在保证代码足够清晰明确下，偶尔使用也是可以的。

回到文章开头，关于 Vue Ref 提案之所以引起许多开发者的注意跟讨论，主要还是因为修改了 label 的语义，尽管符合 JS 语法，但为 label 增添的**非标准语义**，会让部分开发者陷入混乱，增加心智负担。

讨论传送门：[New script setup and ref sugar](https://github.com/vuejs/rfcs/pull/222)

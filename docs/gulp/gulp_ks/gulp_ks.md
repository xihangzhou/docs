# Gulp

## Gulp入门指南

### Gulpfile

1. 什么是gulp file

* 放在项目根目录下的`gulpfile.js`，在运行 `gulp` 命令时会被自动加载，用来定义gulp的打包行为。用来定义任何导出（export）的函数都将注册到 gulp 的任务（task）系统中。

2. gulpfile转译

* gulpfile文件可以用任何你想的语言来书写，安装转译模块即可

3. Gulpfile 分割

* gulpfile可以分割，Node 的模块解析功能允许你将 `gulpfile.js`' 文件替换为同样命名为 `gulpfile.js` 的目录，该目录中包含了一个名为 `index.js` 的文件，该文件被当作 `gulpfile.js` 使用。并且，该目录中还可以包含各个独立的任务（task）模块。

### TASK

#### 任务的概念

任务（tasks）可以是 **public（公开）** 或 **private（私有）** 类型的。

- **公开任务（Public tasks）** 从 gulpfile 中被导出（export），可以通过 `gulp` 命令直接调用。
- **私有任务（Private tasks）** 被设计为在内部使用，通常作为 `series()` 或 `parallel()` 组合的组成部分。

一个私有（private）类型的任务（task）在外观和行为上和其他任务（task）是一样的，但是不能够被用户直接调用。如需将一个任务（task）注册为公开（public）类型的，只需从 gulpfile 中导出（export）即可。

```js
const { series } = require('gulp');

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb();
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```

#### 组合任务

Gulp 提供了两个强大的组合方法： `series()` 和 `parallel()`，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。`series()` 和 `parallel()` 可以互**相嵌套至**任意深度。

如果需要让任务（task）按顺序执行，请使用 `series()` 方法。

```js
const { series } = require('gulp');

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
```

对于希望以最大并发来运行的任务（tasks），可以使用 `parallel()` 方法将它们组合起来。

```js
const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```

因为commonJs是运行时加载，所以可以在node执行的过程中动态导出变量。

```js
const { series } = require('gulp');

function minify(cb) {
  // body omitted
  cb();
}


function transpile(cb) {
  // body omitted
  cb();
}

function livereload(cb) {
  // body omitted
  cb();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```

`series()` 和 `parallel()` 可以被嵌套到任意深度。

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publish
);
```

当一个组合操作执行时，这个组合中的每一个任务每次被调用时都会被执行。例如，在两个不同的任务（task）之间调用的 `clean` 任务（task）将被执行两次，并且将导致不可预期的结果。因此，最好重构组合中的 `clean` 任务（task）。

如果你有如下代码：

```js
// This is INCORRECT
const { series, parallel } = require('gulp');

const clean = function(cb) {
  // body omitted
  cb();
};

const css = series(clean, function(cb) {
  // body omitted
  cb();
});

const javascript = series(clean, function(cb) {
  // body omitted
  cb();
});

exports.build = parallel(css, javascript);
```

重构为：

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

### 异步执行

Node 库以多种方式处理异步功能。最常见的模式是 [error-first callbacks](https://nodejs.org/api/errors.html#errors_error_first_callbacks)，但是你还可能会遇到 [streams](https://nodejs.org/api/stream.html#stream_stream)、[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)、[event emitters](https://nodejs.org/api/events.html#events_events)、[child processes](https://nodejs.org/api/child_process.html#child_process_child_process), 或 [observables](https://github.com/tc39/proposal-observable/blob/master/README.md)。gulp 任务（task）规范化了所有这些类型的异步功能。每一个任务交给node执行过后怎么才能知道是否执行结束了呢？就要让task进行任务完成的通知。

#### 如何任务（task）完成通知

当从任务（task）中返回 stream、promise、event emitter、child process 或 observable 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

当使用 `series()` 组合多个任务（task）时，任何一个任务（task）的错误将导致整个任务组合结束，并且不会进一步执行其他任务。当使用 `parallel()` 组合多个任务（task）时，一个任务的错误将结束整个任务组合的结束，但是其他并行的任务（task）可能会执行完，也可能没有执行完。

* 返回 stream

```js
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```

* 返回 promise

```js
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```

* 返回 event emitter

```js
const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```

* 返回 child process

```js
const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;
```

* 返回 observable

```js
const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```

* 使用 callback

如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。在如下示例中，callback 将作为唯一一个名为 `cb()` 的参数传递给你的任务（task）。每一个task执行的时候在gulp中都会传入cb函数，这个cb函数的执行用于让gulp知晓任务是否终止。

```js
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;
```

如需通过 callback 把任务（task）中的错误告知 gulp，请将 `Error` 作为 callback 的唯一参数。

```js
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```

然而，你通常会将此 callback 函数传递给另一个 API ，而不是自己调用它。

```js
const fs = require('fs');

function passingCallback(cb) {
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;
```

#### gulp 不再支持同步任务（Synchronous tasks）

gulp 不再支持同步任务（Synchronous tasks）了。因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。

当你看到 *"Did you forget to signal async completion?"* 警告时，说明你并未使用前面提到的返回方式。你需要使用 callback 或返回 stream、promise、event emitter、child process、observable 来解决此问题。

#### 使用 async/await

如果不使用前面提供到几种方式，你还可以将任务（task）定义为一个 [`async` 函数](https://developers.google.com/web/fundamentals/primers/async-functions)，它将利用 promise 对你的任务（task）进行包装。这将允许你使用 `await` 处理 promise，并使用其他同步代码。

```js
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
  return Promise.resolve('some result');
}

exports.default = asyncAwaitTask;
```

### 处理文件

gulp 暴露了 `src()` 和 `dest()` 方法用于处理计算机上存放的文件。

`src()` 接受 [glob](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs) 参数，并从文件系统中读取文件然后生成一个 [Node 流（stream）](https://nodejs.org/api/stream.html)（流是一个管理输入输出的对象）。它将所有匹配的文件读取到内存中并通过流（stream）进行管理。

由 `src()` 产生的流（stream）应当从任务（task）中返回并发出异步完成的信号，就如 [创建任务（task）](https://www.gulpjs.com.cn/docs/getting-started/creating-tasks) 文档中所述。

```js
const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

流（stream）所提供的主要的 API 是 `.pipe()` 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```

`dest()` 接受一个输出目录作为参数，并且它还会产生一个 [Node 流（stream）](https://nodejs.org/api/stream.html)，通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。gulp 还提供了 `symlink()` 方法，其操作方式类似 `dest()`，但是创建的是链接而不是文件（ 详情请参阅 [`symlink()`](https://www.gulpjs.com.cn/docs/api/symlink) ）。

大多数情况下，利用 `.pipe()` 方法将插件放置在 `src()` 和 `dest()` 之间，并转换流（stream）中的文件。

#### 向流（stream）中添加文件

`src()` 也可以放在管道（pipeline）的中间，以根据给定的 glob 向流（stream）中添加文件。新加入的文件只对后续的转换可用。如果 [glob 匹配的文件与之前的有重复](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs#overlapping-globs)，仍然会再次添加文件。

这对于在添加普通的 JavaScript 文件之前先转换部分文件的场景很有用，添加新的文件后可以对所有文件统一进行压缩并混淆（uglifying）。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}
```

#### 分阶段输出

`dest()` 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统。当接收到一个文件时，当前状态的文件将被写入文件系统，文件路径也将被修改以反映输出文件的新位置，然后该文件继续沿着管道（pipeline）传输。

此功能可用于在同一个管道（pipeline）中创建未压缩（unminified）和已压缩（minified）的文件。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```

#### 模式：流动（streaming）、缓冲（buffered）和空（empty）模式

`src()` 可以工作在三种模式下：缓冲（buffering）、流动（streaming）和空（empty）模式。这些模式可以通过对 `src()` 的 `buffer` 和 `read` [参数](https://www.gulpjs.com.cn/docs/api/src#options) 进行设置。

- 缓冲（Buffering）模式是默认模式，将文件内容加载内存中。插件通常运行在缓冲（buffering）模式下，并且许多插件不支持流动（streaming）模式。
- 流动（Streaming）模式的存在主要用于操作无法放入内存中的大文件，例如巨幅图像或电影。文件内容从文件系统中以小块的方式流式传输，而不是一次性全部加载。如果需要流动（streaming）模式，请查找支持此模式的插件或自己编写。
- 空（Empty）模式不包含任何内容，仅在处理文件元数据时有用。

### Glob 详解

glob 是由普通字符和/或通配字符组成的字符串，用于匹配文件路径。可以利用一个或多个 glob 在文件系统中定位文件。

`src()` 方法接受一个 glob 字符串或由多个 glob 字符串组成的数组作为参数,最后能够匹配所有glob的文件才会被src作为文件来源。

#### 字符串片段与分隔符

字符串片段（segment）是指两个分隔符之间的所有字符组成的字符串。分隔符指的就是文件名之间的分割线。在 glob 中，分隔符永远是 `/` 字符 - 不区分操作系统 - 即便是在采用 `\\` 作为分隔符的 Windows 操作系统中。在 glob 中，`\\` 字符被保留作为转义符使用。

```js
'src/*.js   
```

如下， * 被转义了，因此，* 将被作为一个普通字符使用，而不再是通配符了。

```js
'glob_with_uncommon_\\*_character.js'
```

#### 特殊字符： * (一个星号)

在一个字符串片段中匹配任意数量的字符，包括零个匹配。对于匹配单级目录下的文件很有用。

下面这个 glob 能够匹配类似 `index.js` 的文件，但是不能匹配类似 `scripts/index.js` 或 `scripts/nested/index.js` 这样的带前缀路径的文件。

```js
'*.js'
```

#### 特殊字符： ** (两个星号)

在多个字符串片段中匹配任意数量的字符，包括零个匹配。 对于匹配嵌套目录下的文件很有用。请确保适当地限制带有两个星号的 glob 的使用，以避免匹配大量不必要的目录。

下面这个 glob 被适当地限制在 `scripts/` 目录下。它将匹配类似 `scripts/index.js`、`scripts/nested/index.js` 和 `scripts/nested/twice/index.js` 的文件。

```js
'scripts/**/*.js'
```

在上面的示例中，如果没有 `scripts/` 这个前缀做限制，`node_modules` 目录下的所有目录或其他目录也都将被匹配。

#### 特殊字符： ! (取反)

由于 glob 匹配时是按照每个 glob 在数组中的位置依次进行匹配操作的，所以 glob 数组中的取反（negative）glob 必须跟在一个非取反（non-negative）的 glob 后面。第一个 glob 匹配到一组匹配项，然后后面的取反 glob 删除这些匹配项中的一部分。**如果取反 glob 只是由普通字符组成的字符串，则执行效率是最高的**。**When excluding all files within a directory, you must add `/**` after the directory name, which the globbing library optimizes internally.** 因为这样的的话glob在内部会优化匹配的过程，任何以scripts/vendor/开头的文件都不会再继续匹配了。

```js
['script/**/*.js', '!scripts/vendor/']
或者
['script/**/*.js', '!scripts/vendor/**']
```

如果任何非取反（non-negative）的 glob 在一个取反（negative） glob后面，这个非取反（non-negative）的 glob不会删除任何匹配项。如下面这个例子中

```js
['script/**/*.js', '!scripts/vendor/', 'scripts/vendor/react.js']
```

取反（negative） glob 可以作为对带有两个星号的 glob 的限制手段。

```js
['**/*.js', '!node_modules/']
```

在上面的示例中，如果取反（negative）glob 是 `!node_modules/**/*.js`，那么各匹配项都必须完整地与取反 glob 进行比较，这将导致执行速度极慢。如果只有!node_modules/或者!node_modules/**，那么对node_modules/开头的文件直接全部去掉即可，不用迭代匹配。（猜测内部使用了以文件路径名为节点的文件tree，当要去掉以对node_modules/开头的文件，直接去掉整个子树即可）

#### 匹配重叠（Overlapping globs）

两个或多个 glob 匹配了相同的文件就被认为是匹配重叠（overlapping）了。如果在同一个 `src()` 中发生了重叠，gulp 将尽力去除重叠部分，但是在多个 `src()` 调用时产生的匹配重叠是不会被去重的。

### 插件

Gulp 插件实质上是 [Node 转换流（Transform Streams）](https://github.com/rvagg/through2)，转换流是node流的一种类型，用于对流的内容进行转换。原生转换流不太好用，所以在gulp中大量使用了through2来进行转换流的书写。插件封装了通过管道（pipeline）转换文件的常见功能，通常是使用 `.pipe()` 方法并放在 `src()` 和 `dest()` 之间。他们可以更改经过流（stream）的每个文件的文件名、元数据或文件内容。

托管在 npm 上的插件 - 标记有 "gulpplugin" 和 "gulpfriendly" 关键词 - 可以在 [插件搜索页面](https://gulpjs.com/plugins/) 上浏览和搜索。

每个插件应当只完成必要的工作，因此你可以把它们像构建块一样连接在一起。获得想要的结果可能需要把一组插件组合在一起使用。

```js
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    // gulp-uglify 插件并不改变文件名
    .pipe(uglify())
    // 因此使用 gulp-rename 插件修改文件的扩展名
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```

#### 是否需要插件？

并非 gulp 中的一切都需要用插件来完成。虽然它们是一种快速上手的方法，但许多操作都应当通过使用独立的功能模块或库来实现。

```js
const { rollup } = require('rollup');

// Rollup 提供了基于 promise 的 API，在 `async` 任务（task）中工作的很好
exports.default = async function() {
  const bundle = await rollup.rollup({
    input: 'src/index.js'
  });

  return bundle.write({
    file: 'output/bundle.js',
    format: 'iife'
  });
}
```

插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。

```js
const del = require('delete');

exports.default = function(cb) {
  // 直接使用 `delete` 模块，避免使用 gulp-rimraf 插件
  del(['output/*.js'], cb);
}
```

#### 条件插件

因为插件的操作不应该针对特定文件类型，因此你可能需要使用像 [gulp-if](https://www.npmjs.com/package/gulp-if) 之类的插件来完成转换某些文件的操作。

```js
const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

function isJavaScript(file) {
  // 判断文件的扩展名是否是 '.js'
  return file.extname === '.js';
}

exports.default = function() {
  // 在同一个管道（pipeline）上处理 JavaScript 和 CSS 文件
  return src(['src/*.js', 'src/*.css'])
    // 只对 JavaScript 文件应用 gulp-uglify 插件
    .pipe(gulpif(isJavaScript, uglify()))
    .pipe(dest('output/'));
}
```

#### 内联插件（Inline plugins）

内联插件是一次性的转换流（Transform Streams），你可以通过在 gulpfile 文件直接书写需要的功能。

在两种情况下，创建内联插件很有用：

- 避免自己创建并维护插件。
- 避免 fork 一个已经存在的插件并添加自己所需的功能。

```js
const { src, dest } = require('gulp');
const uglify = require('uglify-js');
const through2 = require('through2');

exports.default = function() {
  return src('src/*.js')
    // 创建一个内联插件，从而避免使用 gulp-uglify 插件
    .pipe(through2.obj(function(file, _, cb) {
      if (file.isBuffer()) {
        const code = uglify.minify(file.contents.toString())
        file.contents = Buffer.from(code)
      }
      cb(null, file);
    }))
    .pipe(dest('output/'));
}
```

### 文件监控

gulp api 中的 `watch()` 方法利用文件系统的监控程序（file system watcher）将 [globs](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs) 与 [任务（task）](https://www.gulpjs.com.cn/docs/getting-started/creating-tasks) 进行关联。它对匹配 glob 的文件进行监控，如果有文件被修改了就执行关联的任务（task）。如果被执行的任务（task）没有触发 [异步完成](https://www.gulpjs.com.cn/docs/getting-started/async-completion) 信号，它将永远不会再次运行了。

此 API 的默认设置是基于通常的使用场景的，而且提供了内置的延迟和排队机制。

```js
const { watch, series } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

// 可以只关联一个任务
watch('src/*.css', css);
// 或者关联一个任务组合
watch('src/*.js', series(clean, javascript));
```

#### Warning: avoid synchronous[#](https://gulpjs.com/docs/en/getting-started/watching-files#warning-avoid-synchronous)

A watcher's task cannot be synchronous, like tasks registered into the task system. If you pass a sync task, the completion can't be determined and the task won't run again - it is assumed to still be running.

There is no error or warning message provided because the file watcher keeps your Node process running. Since the process doesn't exit, it cannot be determined whether the task is done or just taking a really, really long time to run.

不能够监控一个同步task的变化

#### 监控事件

默认情况下，只要创建、更改或删除文件，文件监控程序就会执行关联的任务（task）。 如果你需要使用不同的事件，你可以在调用 `watch()` 方法时通过 `events` 参数进行指定。可用的事件有 `'add'`、`'addDir'`、`'change'`、`'unlink'`、`'unlinkDir'`、`'ready'`、`'error'`。此外，还有一个 `'all'` 事件，它表示除 `'ready'` 和 `'error'` 之外的所有事件。

```js
const { watch } = require('gulp');

// 所有事件都将被监控
watch('src/*.js', { events: 'all' }, function(cb) {
  // body omitted
  cb();
});
```

#### 初次执行

调用 `watch()` 之后，关联的任务（task）是不会被立即执行的，而是要等到第一次文件修之后才执行。

如需在第一次文件修改之前执行，也就是调用 `watch()` 之后立即执行，请将 `ignoreInitial` 参数设置为 `false`。

```js
const { watch } = require('gulp');

// 关联的任务（task）将在启动时执行
watch('src/*.js', { ignoreInitial: false }, function(cb) {
  // body omitted
  cb();
});
```

#### 队列

`watch()` 方法能够保证当前执行的任务（task）不会再次并发执行。当文件监控程序关联的任务（task）正在运行时又有文件被修改了，那么所关联任务的这次新的执行将被放到执行队列中等待，直到上一次关联任务执行完之后才能运行。每一次文件修改只产生一次关联任务的执行并放入队列中。

如需禁止队列，请将 `queue` 参数设置为 `false`。

```js
const { watch } = require('gulp');

// 每次文件修改之后关联任务都将执行（有可能并发执行）
watch('src/*.js', { queue: false }, function(cb) {
  // body omitted
  cb();
});
```

#### 延迟

文件更改之后，只有经过 200 毫秒的延迟之后，文件监控程序所关联的任务（task）才会被执行。这是为了避免在同使更改许多文件时（例如查找和替换操作）过早启动任务（taks）的执行。

如需调整延迟时间，请为 `delay` 参数设置一个正整数。

```js
const { watch } = require('gulp');

// 文件第一次修改之后要等待 500 毫秒才执行关联的任务
watch('src/*.js', { delay: 500 }, function(cb) {
  // body omitted
  cb();
});
```

## Gulp项目实例

```javascript
const gulp = require('gulp');
const path = require('path');
// 删除匹配路径的文件
const del = require('del');
const changed = require('gulp-changed');
const gulpTs = require('gulp-typescript'); // 帮助解析ts,获取tsconfig配置文件
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less'); // 将less转为css文件
const rename = require('gulp-rename'); // 修改文件名
const gulpImage = require('gulp-image'); // 优化压缩图片名
const cache = require('gulp-cache'); // 缓存文件
const mpNpm = require('gulp-mp-npm'); // 提取node流中用到的依赖
const tsAlias = require('gulp-ts-alias'); // 解决tsconfig引入的别名的问题
const weappAlias = require('gulp-wechat-weapp-src-alisa');
const tap = require('gulp-tap'); // 方便的处理流的内容，直接修改流的文件内容或者是对特定的内容使用别的插件
const cssFilterFiles = require('./config/cssFilterFiles.js');
const pump = require('pump'); // 当pipe管道的下游node流报错后是不能将上游node流destroy的，而且拿不到回调函数，这个pump就解决了这个问题
const uglifyjs = require('uglify-js');
const composer = require('gulp-uglify/composer');
const minify = composer(uglifyjs, console); // 丑化压缩js代码
const configTask = require('./config/task/index');
const prettyData = require('gulp-pretty-data'); // 压缩代码
// const filter = require('gulp-filter');

const resolve = (...args) => path.resolve(__dirname, ...args);

/* config */
// 定义了在开发的项目中的src路径，在这里是和gulpfile.js同级的src下
const src = './src';
// 定义了打包目的的根目录，即打包到和gulpfile.js同级的miniprogram目录下
const dist = './miniprogram';

// 默认dev配置
let config = {
  sourcemap: {
    ts: true, // 是否开启 ts sourcemap
    less: true, // 是否开启 less sourcemap
  },
  compress: false, // 是否压缩wxml、json、less等各种文件
  independent: false, // 是否启用独立分包构建，dev模式关闭
};

// 设置成build配置
const setBuildConfig = cb => {
  config = {
    sourcemap: {
      ts: false, // 是否开启 ts sourcemap
      less: false, // 是否开启 less sourcemap
    },
    compress: true,
    independent: true,
  };
  cb();
};

// options
const srcOptions = { base: src }; // gulp src函数的配置项
const watchOptions = { events: ['add', 'change'] };
const mpNpmOptions = { npmDirname: 'miniprogram_npm' };
const weappAliasConfig = {
  '@': path.join(__dirname, './src/supermarket'),
};
const minifyOptions = {
  compress: {
    drop_console: false, // 在压缩js代码的过程中去掉console.*的方法
    drop_debugger: true, // 去掉debugger;
  },
};

// 每种文件的glob匹配路径
const globs = {
  ts: [`${src}/**/*.ts`, './typings/index.d.ts'], // 匹配 ts 文件
  js: `${src}/**/*.js`, // 匹配 js 文件
  json: `${src}/**/*.json`, // 匹配 json 文件
  less: `${src}/**/*.less`, // 匹配 less 文件
  wxss: `${src}/**/*.wxss`, // 匹配 wxss 文件
  image: `${src}/**/*.{png,jpg,jpeg,gif,svg}`, // 匹配 image 文件
  wxml: `${src}/**/*.wxml`, // 匹配 wxml 文件
  md: `${src}/**/*.md`, // 匹配 md 文件
};
// 匹配需要拷贝的文件
globs.copy = [
  `${src}/**`, // 外层项目./src下的所有文件
  // 排除外层src下的ts,js,json,less,wxss,image,wxml,md文件，这些文件需要重新编译处理，不能直接复制
  `!${globs.ts[0]}`,
  `!${globs.ts[1]}`,
  `!${globs.js}`,
  `!${globs.json}`,
  `!${globs.less}`,
  `!${globs.wxss}`,
  `!${globs.image}`,
  `!${globs.wxml}`,
  `!${globs.md}`,
];

// 包装 gulp.lastRun, 引入文件 ctime 作为文件变动判断另一标准
// since参数比较的是文件的mtime：内容修改的时间。为了当文件路径发生变化但是文件内容没变时仍然触发打包，需要引入since函数比较ctime,ctime是文件的元数据发生变化的时间。比如权限，所有者等。
// https://github.com/gulpjs/vinyl-fs/issues/226
// 连续的箭头函数就是返回一个函数而已，在这里返回一个file为参数的函数，这个以file为参数的函数的返回gulp.lastRun...的执行结果
// gulp中src函数的since参数会传入file参数进行比较
const since = task => file =>
  gulp.lastRun(task) > file.stat.ctime ? gulp.lastRun(task) : 0;

/** `gulp clear`
 * 清理文件
 * */
const clear = () => del(dist);

/** `gulp clearCache`
 * 清理缓存
 * */
const clearCache = () => cache.clearAll();

/** `gulp copy`
 * 清理
 * */
const copy = () =>
  gulp
    .src(globs.copy, { ...srcOptions, since: since(copy) }) //选取需要复制的文件，在这里传入since参数，只复制那些since参数时间后有修改的文件，在这里获取那些在上一次执行copy任务后有修改的或者路径发生了变化的文件
    .pipe(changed(dist)) // 有一些文件只
    .pipe(gulp.dest(dist));

/** `gulp ts`
 * 编译ts
 * */
// const filterTsFilePath = ['**/*.js'];
const tsEmptyFilePath = [];
// const filterEmptyTsFile = filter(filterTsFilePath, { restore: true });
const tsProject = gulpTs.createProject(resolve('tsconfig.json'));
const ts = cb => {
  const tsResult = gulp
    .src(globs.ts, { ...srcOptions, since: since(ts) }) // since同理
    .pipe(tsAlias({ configuration: tsProject.config })) // 解析tsconfig中的路径别名
    .pipe(gulpIf(config.sourcemap.ts, sourcemaps.init())) // 如果打开了sourcemap配置项，就使用sourcemaps.init()方法在相同路径下生成外部的.map sourcemap文件
    .pipe(tsProject()) // 编译ts
    .on('error', () => { }); // 监听error事件

  pump(
    [
      tsResult.js, // tsResult是一个tsProject插件生成的流，.js是其中的一个子流意味着拿到js文件流
      mpNpm(mpNpmOptions), // 收集tsResult.js中使用到的依赖，具体原理❓
      tap(file => {
        const content = file.contents.toString();
        if (content.length < 78) {
          // ts文件编译成js文件后，无依赖的空文件,内容清空
          // filterTsFilePath.push(`!${file.path}`);
          // file.contents = Buffer.from('', 'utf8'); // 清空内容
          // 空文件路径存储
          tsEmptyFilePath.push(file.path); // 如果这个ts文件的长度小于78则判断为一个空的ts文件，因为纯的ts类型定义文件在编译后就空了
        }
      }),
      // filterEmptyTsFile, // 无依赖的空文件不参与sourcemaps和压缩
      gulpIf(config.sourcemap.ts, sourcemaps.write('.')), // 生成的js文件生成对应的sourceMap
      gulpIf(config.compress, minify(minifyOptions)), // 压缩丑化js代码
      // filterEmptyTsFile.restore,
      gulp.dest(dist),
    ],
    cb,
  );
};

/** `gulp js`
 * 解析js
 * */
const js = () =>
  gulp
    .src(globs.js, { ...srcOptions, since: since(js) })
    .pipe(mpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulp.dest(dist));

/** `gulp json`
 * 解析json
 * */
const json = () =>
  gulp
    .src(globs.json, { ...srcOptions, since: since(json) })
    .pipe(mpNpm(mpNpmOptions)) // 分析依赖
    .pipe(
      gulpIf(
        config.compress,
        prettyData({
          type: 'minify',
          preserveComments: true,
        }),
      ),
    )
    .pipe(
      gulpIf(
        // 如果是app.json文件要去除subpackages中的independent，即去除独立分包❓
        file => !config.independent && file.path.endsWith('app.json'),
        tap(file => {
          const content = file.contents.toString();
          const appJson = JSON.parse(content);
          const subpackages = appJson.subpackages || appJson.subPackages;
          if (!Array.isArray(subpackages)) return;
          subpackages.forEach(item => {
            delete item.independent;
          });
          file.contents = Buffer.from(JSON.stringify(appJson), 'utf8');
        }),
      ),
    )
    .pipe(gulp.dest(dist));

/** `gulp less`
 * 编译less为wxsss
 * */
// const filterLessFilePath = ['**/*.css'];
// const filterEmptyLessFile = filter(filterLessFilePath, { restore: false });
const less = cb => {
  pump(
    [
      gulp.src(globs.less, { ...srcOptions, since: since(less) }),
      gulpIf(config.sourcemap.less, sourcemaps.init()),
      weappAlias(weappAliasConfig),
      // gulpLess方法处理css模块引用会先把引用部分进行替换或者插入，然后再进行编译。这样导致的问题就是如果一份样式文件被100个文件引用，那么这个样式文件就会重复100次。这就可以进行优化
      tap(file => {
        const content = file.contents.toString();
        const commentReg = /\/\*(\s|.)*?\*\//g; // 消除 段落注释 正则
        const matchImportReg = /@import\s+['|"](.+)['|"];/g; // 匹配 @import 正则
        const noCommentStr = content.replace(commentReg, ''); // 清除注释代码
        const str = noCommentStr.replace(matchImportReg, ($1, $2) => { // 注释掉@import语句
          // 注意注释@import语句不能注释掉CSS变量文件，否则变量名找不到就会报错，这里采用cssFilterFiles这个常量来记录项目中使用到的css变量文件，不注释掉这些变量文件
          // 所以CSS变量不要东一榔头西一棒，不方便打包维护
          const hasFilter = cssFilterFiles.filter(
            item => $2.indexOf(item) > -1,
          );
          let path = hasFilter <= 0 ? `/** less: ${$1} **/` : $1;
          return path;
        });
        file.contents = Buffer.from(str, 'utf8');
      }),
      gulpLess(),
      tap(file => {
        const content = file.contents.toString();
        const matchImportCommentReg = /\/\*\* less: @import\s+['|"](.+)['|"]; \*\*\//g;
        const matchImportReg = /@import\s+['|"](.+)['|"];/g;
        const commentReg = /\/\*(\s|.)*?\*\//g; // 消除 段落注释 正则
        // 取消引入的注释并且把文件的后缀改为.less
        const str = content.replace(matchImportCommentReg, ($1, $2) => {
          let less = '';
          $1.replace(matchImportReg, $3 => (less = $3));
          return less.replace(/\.less/g, '.wxss');
        });
        const noCommentStr = str.replace(commentReg, ''); // 消除注释
        file.contents = Buffer.from(noCommentStr, 'utf8');
      }),
      // filterEmptyLessFile, // 过滤掉空的css文件
      rename({ extname: '.wxss' }), //修改文件后缀为.css
      mpNpm(mpNpmOptions),
      gulpIf(config.sourcemap.less, sourcemaps.write('.')),
      gulpIf(
        config.compress,
        prettyData({
          type: 'minify',
          extensions: {
            wxss: 'css',
          },
        }),
      ),
      gulp.dest(dist),
    ],
    cb,
  );
};

/** `gulp wxss`
 * 解析wxss
 * */
const wxss = () =>
  gulp
    .src(globs.wxss, { ...srcOptions, since: since(wxss) })
    .pipe(mpNpm(mpNpmOptions)) // 分析依赖
    .pipe(
      gulpIf(
        config.compress,
        prettyData({
          type: 'minify',
          extensions: {
            wxss: 'css',
          },
        }),
      ),
    )
    .pipe(gulp.dest(dist));

/** `gulp image`
 * 压缩图片
 * */
const image = () =>
  gulp
    .src(globs.image, { ...srcOptions, since: since(image) })
    .pipe(cache(gulpImage())) // 压缩优化图片大小并加入缓存
    .pipe(gulp.dest(dist));

/** `gulp wxml`
 * 解析wxml
 * */
const wxml = () =>
  gulp
    .src(globs.wxml, { ...srcOptions, since: since(wxml) })
    .pipe(
      gulpIf(
        config.compress,
        prettyData({
          type: 'minify',
          extensions: {
            wxml: 'xml',
          },
        }),
      ),
    )
    .pipe(gulp.dest(dist));

/**
 * 输出空ts文件路径
 * */
const logEmptyTsFilePath = async () => {
  if (tsEmptyFilePath.length) {
    const translatedTsEmptyFilePath = tsEmptyFilePath.map(item => {
      return item.match(/miniprogram(\S*)/)[1].replace('.js', '.ts');
    });
    await console.log(
      '\n================ 温馨提示 ================\n以下',
      translatedTsEmptyFilePath.length,
      '个ts文件编译后为空文件，\n1. 如果是纯类型定义文件，请修改文件后缀为.d.ts;\n2. 如果是空文件，请及时删除;\n\n',
      translatedTsEmptyFilePath,
      '\n=========================================\n',
    );
  }
};
/** `gulp build`
 * 构建
 * */
// 组合了copy,ts打包等任务去构建整个项目
// copy: 复制除了ts,js,wxss等需要重新处理编译的文件
const _build = gulp.parallel(copy, ts, js, json, less, wxss, image, wxml);
const build = gulp.series(
  setBuildConfig,
  gulp.parallel(clear, clearCache),//清理文件和缓存
  _build, // 重新打包项目文件
  logEmptyTsFilePath,
  configTask.configTask, // 配置相关的gulp任务
  configTask.configSubPackage, // 配置相关的分包任务
);

/** `gulp watch`
 * 监听
 * */
const watch = () => {
  gulp.watch(globs.copy, watchOptions, copy);
  gulp.watch(globs.ts, watchOptions, ts);
  gulp.watch(globs.js, watchOptions, js);
  gulp.watch(globs.json, watchOptions, json);
  gulp.watch(globs.less, watchOptions, less);
  gulp.watch(globs.wxss, watchOptions, wxss);
  gulp.watch(globs.image, watchOptions, image);
  gulp.watch(globs.wxml, watchOptions, wxml);
};

/** `gulp` or `gulp dev`
 * 构建并监听
 * */
// 执行npm run watch:qa后执行dev task，构建并且监听整个项目，首先是第一层级，在这个层级中是通过series串行打包任务
const dev = gulp.series(
  // 首先清空上一次打包生成的文件
  clear,
  // 构建整个项目
  _build,
  // 输出空ts文件路径
  logEmptyTsFilePath,
  // 一些其他配置相关的任务，比如生成小程序的项目配置文件project.config.json,生成环境配置相关的config.js等等，之后再细看
  configTask.configTask,
  // 监听任务，在文件有修改时重新打包
  watch,
);

// `gulp --tasks` list tasks
module.exports = {
  copy,
  ts,
  js,
  json,
  less,
  wxss,
  image,
  wxml,
  clear,
  clearCache,
  copy,
  build,
  watch,
  dev,
  default: dev,
};

```


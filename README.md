[![Build Size](https://img.shields.io/bundlephobia/minzip/observable-state?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=observable-state)
[![Version](https://img.shields.io/npm/v/observable-state?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/observable-state)

A small, fast state-management solution using observer pattern.
This library allows you to create observables, subscribe to them, and publish changes to them. It also supports computed observables,

You can try a live demo [here][demo link].

## Installation

```shell
npm install observable-state # or yarn add observable-state or pnpm add observable-state
```

## Usage

- [Create observable state](#create-observable-state)
- [Subscribe to the observable state](#subscribe-to-the-observable-state)
- [Unsubscribe exist listener](#unsubscribe-exist-listener)
- [Modifying arrays and objects](#modifying-arrays-and-objects)
- [Computed value](#computed-value)

#### Create observable state

```js
import { observable } from 'observalble-state';

const ov = observable('init');
const listener = function (state, prevState) {};
ov.subscribe(listener);

ov(); // 'init'
ov('init'); // 'init', no change
ov('changed'); // fn('changed', 'init')
ov.value = 'silent'; // silent update
ov.publish(); // fn('silent', 'init');
```

#### Subscribe to the observable state

```js
const ov = observable(1);
const listener = function (state, prevState) {};
ov.subscribe(listener);

ov(13); // listener(13, 1)
ov(0); // listener(0, 13)
```

#### Unsubscribe exist listener

```js
const ov = observable('init');
```

#### Modifying arrays and objects

Modifying arrays and objects will not publish, but replacing them will.

```js
const ov = observable([]);
const listener = function (state, prevState) {};
ov.subscribe(listener);

ov([1]); // listener([1], [])
ov.value.push(2);
ov().push(3);
ov.pusblish(); // listener([1, 2, 3], [])
```

#### Computed value

Passing a function caches the result as the value. Any extra arguments will be passed to the function. Any observables called within the function will be subscribed to, and updates to those observables will recompute the value. Child observables must be called, mere references are ignored. If the function returns a Promise, the value is assigned async after resolution.

```js
const a = observable(1); // a() == 1
const b = observable(() => a() + 1); // b() == 2
const c = observable((arg) => a() + b() + arg, 3); // c() == 6

a(3);
console.log(a(), b(), c()); // 3, 4, 10
```

```js
function sleep(timeout) {
  new Promise((resolve) => setTimeout(resolve, timeout));
}

const ov = observable(async () => {
  await sleep(1000);
  return 1;
});

console.log(ov()); // null;
await sleep(1000);
console.log(ov()); // 1
```

## License

[MIT](./LICENSE)

[demo link]: https://codesandbox.io/p/sandbox/observable-2nc3km?file=%2Findex.html%3A10%2C9&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clr5jx9480006356hwcm3s7hn%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clr5jx9480002356ho39rbi2l%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clr5jx9480003356hrx2k5vfx%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clr5jx9480005356hip026d3j%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clr5jx9480002356ho39rbi2l%2522%253A%257B%2522id%2522%253A%2522clr5jx9480002356ho39rbi2l%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clr5lf1a10002356hyaxjv67k%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A10%252C%2522startColumn%2522%253A9%252C%2522endLineNumber%2522%253A10%252C%2522endColumn%2522%253A9%257D%255D%252C%2522filepath%2522%253A%2522%252Findex.html%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clr5lf1a10002356hyaxjv67k%2522%257D%252C%2522clr5jx9480005356hip026d3j%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clr5jx9480004356hlvdni8o3%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clr5jx9480005356hip026d3j%2522%252C%2522activeTabId%2522%253A%2522clr5jx9480004356hlvdni8o3%2522%257D%252C%2522clr5jx9480003356hrx2k5vfx%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clr5jx9480003356hrx2k5vfx%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D

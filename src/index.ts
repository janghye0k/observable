export type Lisetner<T> = (state: T, prevState: T) => any;

export type UnSubscriber = () => void;

export type Subscribe<T> = (
  listener: Lisetner<T>,
  immediate?: boolean
) => UnSubscriber;

export type Observable<T> = {
  (): T;
  (value: T): void;
  value: T;
  subscribe: Subscribe<T>;
  publish: () => void;
};

/**
 * Create observable instance
 *
 * @example
 *
 * const a = observable(1) // a() == 1
 * const b = observable(() => a() + 1) // b() == 2
 * const c = observable((arg) => a() + b() + arg, 3) // c() == 6
 *
 * @description this code reference to the below
 * @see https://github.com/FrontendMasters/observablish-values/tree/main
 */
function observable<T = any>(
  arg: T | (() => T) | (() => Promise<T>)
): Observable<T>;
function observable<T = any, P = any>(
  callback: (...args: P[]) => T | Promise<T>,
  ...arg: P[]
): Observable<T>;
function observable(...args: any[]) {
  // JS functions can't inherit custom prototypes, so we use prop() as a
  // proxy to the real ObservableValue instead.
  const observable = new (ObservableValue as any)();

  function prop(...args: any[]) {
    return observable.accessor.apply(prop, args);
  }

  for (const key in observable) {
    if (typeof observable[key] === 'function') {
      (prop as any)[key] = observable[key];
    } else {
      Object.defineProperty(prop, key, {
        get: () => observable[key],
        set: (value) => {
          observable[key] = value;
        },
      });
    }
  }

  prop(...args);
  return prop;
}

function ObservableValue(this: any) {
  this.previousValue = null;
  this.value = null;
  this.listeners = [];
}

ObservableValue._computeActive = false;
ObservableValue._computeChildren = [] as any[];

ObservableValue.prototype.accessor = function accessor(newValue: any) {
  // If no arguments, return the value. If called inside a computed observable
  // value function, track child observables.
  if (!arguments.length) {
    if (
      ObservableValue._computeActive &&
      ObservableValue._computeChildren.indexOf(this) === -1
    ) {
      ObservableValue._computeChildren.push(this);
    }
    return this.value;
  }

  // If new value is same as previous, skip.
  else if (newValue !== this.value) {
    // If new value is not a function, save and publish.
    if (typeof newValue !== 'function') {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish();
    }

    // If new value is a function, call the function and save its result.
    // Function can return a promise for async assignment. All additional
    // arguments are passed to the value function.
    else {
      const args = [];
      for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        args.push(arg);
      }
      this.valueFunction = newValue;
      this.valueFunctionArgs = args;

      // Subscribe to child observables
      ObservableValue._computeActive = true;
      this.compute();
      ObservableValue._computeActive = false;
      ObservableValue._computeChildren.forEach((child) => {
        child.subscribe(() => this.compute());
      });
      ObservableValue._computeChildren.length = 0;
    }
  }
};

ObservableValue.prototype.publish = function publish() {
  this.listeners.slice().forEach((listener: Lisetner<any>) => {
    if (!listener) return;
    listener.call(this, this.value, this.previousValue);
  });
};

ObservableValue.prototype.subscribe = function subscribe(
  listener: Lisetner<any>,
  immediate?: boolean
) {
  this.listeners.push(listener);
  if (immediate) {
    listener.call(this, this.value, this.previousValue);
  }
  return () => ObservableValue.prototype.unsubscribe.call(this, listener);
};

ObservableValue.prototype.unsubscribe = function unsubscribe(
  listener: Lisetner<any>
) {
  const index = this.listeners.indexOf(listener);
  this.listeners.splice(index, 1);
};

// Note, currently there's no shortcut to cleanup a computed value.
ObservableValue.prototype.compute = function compute() {
  const result = this.valueFunction.call(this, ...this.valueFunctionArgs);
  if (typeof result !== 'undefined') {
    if (typeof result.then === 'function') {
      result.then((asyncResult: any) => this(asyncResult));
    } else {
      this(result);
    }
  }
};

export { observable };

import { observable } from '../src/index';

/** @type {any} */
let prevState = null;
/** @type {any} */
let state = null;

/**
 * @template T
 * @param {import('../src/index').Observable<T>} ov
 * @param {{ listener?: import('../src/index').Lisetner<T>, immediate?: boolean }} [subscriberArgs]
 */
function subscribe(ov, subscriberArgs = {}) {
  const { listener, immediate } = subscriberArgs;
  return ov.subscribe((s, ps) => {
    prevState = ps;
    state = s;
    if (typeof listener === 'function') listener(s, ps);
  }, immediate);
}

/**
 * @param {number} timeout
 */
function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

beforeEach(() => {
  prevState = null;
  state = null;
});

describe('COMMON TEST', () => {
  it('create instance', () => {
    const a = observable(1);
    const b = observable(() => a() + 1);
    const c = observable((arg) => a() + b() + arg, 3);

    expect(a()).toBe(1);
    expect(b()).toBe(2);
    expect(c()).toBe(6);
  });

  it('subscribe', () => {
    const ov = observable('init');
    subscribe(ov, { immediate: true });

    expect(state).toBe('init');
    expect(prevState).toBe(null);

    ov('changed');
    expect(state).toBe('changed');
    expect(prevState).toBe('init');
  });

  it('unsubscribe', () => {
    const ov = observable('init');
    const unsubscriber = subscribe(ov);

    ov('changed');
    expect(state).toBe('changed');

    unsubscriber();
    ov('after unsub');
    expect(state).toBe('changed');
  });

  it('async usage', async () => {
    const ov = observable(async () => {
      await sleep(50);
      return 'string';
    });
    subscribe(ov);
    expect(state).toBe(null);

    await sleep(100);
    expect(state).toBe('string');
  });

  it('update when data is different', () => {
    const ov = observable(1);
    let listenerCount = 0;
    subscribe(ov, { immediate: true, listener: () => listenerCount++ });

    expect(listenerCount).toBe(1);

    ov(1);
    expect(listenerCount).toBe(1);
  });
});

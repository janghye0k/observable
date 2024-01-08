import { observable } from '../src/index';

/** @type {any} */
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
    if (Array.isArray(s)) {
      state = [...s];
    } else if (typeof s === 'object') {
      state = { ...s };
    } else {
      state = s;
    }
    if (typeof listener === 'function') listener(s, ps);
  }, immediate);
}

beforeEach(() => {
  state = null;
});

describe('SILENT TEST', () => {
  it('with not object based value', () => {
    const ov = observable(false);
    subscribe(ov);

    ov(false);
    ov.value = true;
    expect(state).toBe(null);

    ov.publish();
    expect(state).toBe(true);
  });

  it('with array', () => {
    const ov = observable([]);
    subscribe(ov);

    ov([1]);
    expect(state.includes(1)).toBe(true);

    ov().push(2);
    ov.value.push(3);
    expect(state.includes(2)).toBe(false);
    expect(state.includes(3)).toBe(false);

    ov.publish();
    expect(state.length).toBe(3);
  });

  it('with object', () => {
    const ov = observable({});
    subscribe(ov);

    ov({ x: 1 });
    expect(state.x).toBe(1);

    ov().y = 2;
    ov.value.z = 3;
    expect('y' in state).toBe(false);
    expect('z' in state).toBe(false);

    ov.publish();
    expect('y' in state).toBe(true);
    expect('z' in state).toBe(true);
  });
});

import { observable, effect } from '../src/index';
import isEqual from '../src/utils/isEqual';

describe('EFFECT TEST', () => {
  it('common', () => {
    let state = null;
    const ov = observable([]);
    ov.subscribe((s) => (state = s));
    ov([1, 2, 3]);
    effect(
      (s) => {
        expect(isEqual(state, s)).toBe(true);
      },
      [ov, true]
    );
  });

  it('with default', () => {
    const ov = observable({ key: 0 });
    let count = 0;
    effect(() => count++, [ov, true], { key: 0 });
    expect(count).toBe(0);
  });

  it('with compare', () => {
    const ov = observable({ a: 0, b: 0 });
    let count = 0;
    effect(
      () => count++,
      [ov],
      (obj) => obj.a
    );

    ov({ a: 0, b: 3 });
    expect(count).toBe(0);

    ov({ a: 3, b: 3 });
    expect(count).toBe(1);
  });

  it('all options', () => {
    const ov = observable({ a: 0, b: 5 });
    let count = 0;
    effect(
      () => count++,
      [ov, true],
      ({ a, b }) => (a * 10 + b) % 10,
      5
    );

    expect(count).toBe(0);

    ov({ a: 3, b: 5 });
    expect(count).toBe(0);

    ov({ a: 7, b: 7 });
    expect(count).toBe(1);
  });
});

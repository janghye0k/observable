import { Observable, UnSubscriber } from '..';
import isEqual from '../utils/isEqual';

type EffectDependencies<T> = [Observable<T>] | [Observable<T>, boolean];

const defaultCompare = <T>(state: T) => state;
function effect<T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>
): UnSubscriber;
function effect<T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  defaults: T
): UnSubscriber;
function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  compare: (state: T) => V,
  defaults?: V
): UnSubscriber;
function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  ...options: any[]
) {
  const [option1, option2] = options;

  let compare = defaultCompare;
  let defaults: T | V = compare(observable());

  if (typeof option1 === 'function') {
    compare = option1;
    defaults = options.length > 1 ? option2 : compare(observable());
  } else if (options.length === 1) defaults = option1;

  let previousValue = immediate ? !defaults : defaults;
  return observable.subscribe((state, prevState) => {
    const currentValue = compare(state);
    if (isEqual(currentValue, previousValue)) return;
    previousValue = currentValue;
    callback(state, prevState);
  }, immediate);
}

export default effect;

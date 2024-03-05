/**
 * This should be run first (or at least before any scripts that need `debounce` or `throttle`),
 * so that `window.debounce` and `window.throttle` are available when needed!
 */
const setUpDebounceAndThrottle = () => {
  const { makeThrottle, makeDebounce } = preval`
    const fs = require('fs');
    const throttleString = fs.readFileSync('./node_modules/lodash.throttle/index.js', 'utf-8');
    const debounceString = fs.readFileSync('./node_modules/lodash.debounce/index.js', 'utf-8');
    const makeThrottleBody = throttleString.replace(/module\.exports.*/, 'return throttle');
    const makeDebounceBody = debounceString.replace(/module\.exports.*/, 'return debounce');
    const makeThrottle = new Function(makeThrottleBody);
    const makeDebounce = new Function(makeDebounceBody);
    module.exports = { makeThrottle, makeDebounce };
  ` as {
    makeThrottle: () => typeof window.throttle;
    makeDebounce: () => typeof window.debounce;
  };

  if (typeof makeThrottle !== 'function') {
    console.error(
      'Something went wrong with `makeThrottle` (it should be a function but is not).'
    );
    return;
  }

  if (typeof makeDebounce !== 'function') {
    console.error(
      'Something went wrong with `makeDebounce` (it should be a function but is not).'
    );
    return;
  }

  let throttle: typeof window.throttle = undefined;
  let debounce: typeof window.debounce = undefined;

  try {
    throttle = makeThrottle();
    if (typeof throttle !== 'function') {
      console.error(
        'Something went wrong when generating `throttle` (it should be a function but is not).'
      );
      return;
    }

    debounce = makeDebounce();
    if (typeof debounce !== 'function') {
      console.error(
        'Something went wrong when generating `debounce` (it should be a function but is not).'
      );
      return;
    }
  } catch (err) {
    console.error(err);
    console.log(
      '(Something went wrong when generating `throttle` or `debounce`)'
    );
  }

  window.throttle = throttle;
  window.debounce = debounce;
};

if (!window.IS_STORYBOOK) setUpDebounceAndThrottle();

export default setUpDebounceAndThrottle;

const setUpRealVw = () => {
  const { throttle } = window;
  if (!throttle) {
    console.error(
      'Make sure that the `debounceAndThrottle` script runs before the `realVw` script.'
    );
    return;
  }

  const setRealVw = () => {
    document.documentElement.style.setProperty(
      '--real-vw',
      `${document.documentElement.clientWidth / 100}px`
    );
    // if (document.body.clientHeight > window.innerHeight) {
    //   document.documentElement.classList.add('has-scrollbars');
    // } else {
    //   document.documentElement.classList.remove('has-scrollbars');
    // }
  };

  // set it once on page-load
  setRealVw();

  const throttledSetRealVw = throttle(setRealVw, 25, { trailing: true });

  // set it on window-resize (debounced)
  window.addEventListener('resize', throttledSetRealVw);

  const { MutationObserver } = window;
  if (!MutationObserver) return;

  /*
    Set it when the `<body>` element's `class` or `style` attribute changes.
    Really just interested in the CSS `overflow` property here (3rd-party
    libraries tend to set it when opening/closing modals), but not going to
    worry about getting too specific with this.
  */
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(throttledSetRealVw);
  });
  mutationObserver.observe(document.body, {
    attributeFilter: ['class', 'style'],
  });

  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(mutationObserver);
  }
};

if (!window.IS_STORYBOOK) setUpRealVw();

export default setUpRealVw;

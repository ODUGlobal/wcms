const setUpKeyboardAccessibleTableAndPre = () => {
  const wysiwygEmbedSelector = '.wysiwyg-embed';

  const { ResizeObserver } = window;
  if (!ResizeObserver) return;

  const { debounce, throttle } = window;
  if (!debounce || !throttle) {
    console.error(
      'Make sure that the `debounceAndThrottle` script runs before the `Editorial` script.'
    );
    return;
  }

  type GenericCallback = (...args: unknown[]) => void;

  /**
   * When `pre` or table-containing `div` is resized, we'll make it keyboard-focusable
   * if it has x-overflow and do the opposite if it doesn't (including maintaining the
   * `role`/`aria-label` attributes for the benefit of screen-readers).
   * Additionally, for tables with x-overflow, we'll set/unset the inner-shadows
   * as needed (elsewhere we'll do the same thing in on scroll within the table-wrapper).
   */
  const callback: ResizeObserverCallback = (entries) => {
    entries.forEach(({ target }) => {
      if (
        !(target instanceof HTMLPreElement || target instanceof HTMLDivElement)
      )
        return;

      /*
        I *think* we're using the right `width` properties appropriately, but may need
        to revisit if bugs appear.
      */
      const { scrollWidth, clientWidth, scrollLeft, offsetWidth } = target;

      if (scrollWidth > clientWidth) {
        // make keyboard-focusable
        target.tabIndex = 0;
        target.setAttribute('role', 'group');
        target.setAttribute(
          'aria-label',
          `${
            target instanceof HTMLPreElement ? 'Preformatted text' : 'Table'
          } that overflows visually`
        );

        // for table-wrappers, control inner-shadow
        if (target instanceof HTMLDivElement) {
          const { firstElementChild: table, parentElement: outerDiv } = target;
          if (
            table instanceof HTMLTableElement &&
            outerDiv instanceof HTMLDivElement &&
            outerDiv.childElementCount === 1
          ) {
            outerDiv.classList.add('has-x-overflow');

            if (scrollLeft === 0) {
              outerDiv.classList.add('is-scrolled-left');
            } else {
              outerDiv.classList.remove('is-scrolled-left');
            }

            if (scrollLeft + offsetWidth >= table.offsetWidth - 1) {
              outerDiv.classList.add('is-scrolled-right');
            } else {
              outerDiv.classList.remove('is-scrolled-right');
            }
          }
        }
      } else {
        // make NOT keyboard-focusable
        ['tabindex', 'role', 'aria-label'].forEach((attr) => {
          target.removeAttribute(attr);
          // for table-wrappers, control inner-shadow
          if (target instanceof HTMLDivElement) {
            const { parentElement: outerDiv } = target;
            if (
              outerDiv instanceof HTMLDivElement &&
              outerDiv.childElementCount === 1
            ) {
              outerDiv.classList.remove('has-x-overflow');
            }
          }
        });
      }
    });
  };

  const resizeObserver = new ResizeObserver(
    debounce(callback as GenericCallback, 250, { trailing: true })
  );

  const isProseEl = (el: HTMLElement) =>
    [
      `.prose :not(${wysiwygEmbedSelector} *)`,
      `${wysiwygEmbedSelector} .prose :not(${wysiwygEmbedSelector} ${wysiwygEmbedSelector} *)`,
      `${wysiwygEmbedSelector} ${wysiwygEmbedSelector} .prose *`,
    ].some((selector) => el.matches(selector));

  const innerDivClasses = (isFirst: boolean, isLast: boolean) => {
    const classes = [/* tw */ 'overflow-x-auto'];
    if (!isFirst) classes.push(/* tw */ 'mt-[2em]');
    if (!isLast) classes.push(/* tw */ 'mb-[2em]');
    return classes;
  };

  const outerDivClasses = /* tw */ `
    relative is-scrolled-left is-scrolled-right
    before:absolute before:inset-y-0 before:w-4 before:transition-opacity before:left-0
    before:bg-gradient-to-r before:from-black/5
    before:opacity-0 before:[&.has-x-overflow:not(.is-scrolled-left)]:opacity-100
    after:absolute after:inset-y-0 after:w-4 after:transition-opacity after:right-0
    after:bg-gradient-to-l after:from-black/5
    after:opacity-0 after:[&.has-x-overflow:not(.is-scrolled-right)]:opacity-100
    before:pointer-events-none after:pointer-events-none
  `
    .trim()
    .split(/\s+/g);

  const setUpTableWrappers = (table: HTMLTableElement) => {
    if (!isProseEl(table)) return;

    const { parentElement } = table;

    if (
      parentElement instanceof HTMLDivElement &&
      !parentElement.classList.contains('prose') &&
      parentElement.childElementCount === 1
    ) {
      // const isFirst = parentElement.firstElementChild === table;
      // const isLast = parentElement.lastElementChild === table;

      const innerDiv = parentElement;
      // innerDiv.classList.add(...innerDivClasses(isFirst, isLast));

      const { parentElement: grandParentElement } = innerDiv;

      if (
        grandParentElement instanceof HTMLDivElement &&
        grandParentElement.childElementCount === 1
      ) {
        const outerDiv = grandParentElement;
        outerDiv.classList.add(...outerDivClasses);

        const isFirst = outerDiv.parentElement!.firstElementChild === outerDiv;
        const isLast = outerDiv.parentElement!.lastElementChild === outerDiv;
        innerDiv.classList.add(...innerDivClasses(isFirst, isLast));
      } else {
        const outerDiv = document.createElement('div');
        outerDiv.classList.add(...outerDivClasses);
        innerDiv.replaceWith(outerDiv);
        outerDiv.appendChild(innerDiv);

        const isFirst = outerDiv.parentElement!.firstElementChild === outerDiv;
        const isLast = outerDiv.parentElement!.lastElementChild === outerDiv;
        innerDiv.classList.add(...innerDivClasses(isFirst, isLast));
      }
    } else {
      const innerDiv = document.createElement('div');
      const outerDiv = document.createElement('div');
      outerDiv.classList.add(...outerDivClasses);
      outerDiv.appendChild(innerDiv);
      table.replaceWith(outerDiv);
      innerDiv.appendChild(table);

      const isFirst = outerDiv.parentElement!.firstElementChild === outerDiv;
      const isLast = outerDiv.parentElement!.lastElementChild === outerDiv;
      innerDiv.classList.add(...innerDivClasses(isFirst, isLast));
    }

    // (y-margin has been moved to the `innerDiv` wrapper)
    table.classList.add(/* tw */ '!my-0');
  };

  document.querySelectorAll('table').forEach(setUpTableWrappers);

  const setUpTableObservingAndScrolling = () => {
    const tableContainersToBeObserved = [
      ...document.querySelectorAll('div'),
    ].filter(
      (div) =>
        div.childElementCount === 1 &&
        div.children[0] instanceof HTMLTableElement &&
        isProseEl(div) &&
        !div.dataset.observed
    );

    // observe table-container divs, and set up their scroll-handlers for controlling inner-shadows
    tableContainersToBeObserved.forEach((innerDiv) => {
      innerDiv.dataset.observed = 'true';

      resizeObserver.observe(innerDiv);

      const { firstElementChild: table, parentElement: outerDiv } = innerDiv;
      if (
        !(table instanceof HTMLTableElement) ||
        !(outerDiv instanceof HTMLDivElement) ||
        outerDiv.childElementCount !== 1
      )
        return;

      innerDiv.addEventListener(
        'scroll',
        throttle(
          ({ target }) => {
            if (!(target instanceof HTMLElement)) return;

            const { scrollLeft, offsetWidth } = target;

            if (scrollLeft === 0) {
              outerDiv.classList.add('is-scrolled-left');
            } else {
              outerDiv.classList.remove('is-scrolled-left');
            }

            if (scrollLeft + offsetWidth >= table.offsetWidth - 1) {
              outerDiv.classList.add('is-scrolled-right');
            } else {
              outerDiv.classList.remove('is-scrolled-right');
            }
          },
          250,
          { trailing: true }
        )
      );
    });
  };

  setUpTableObservingAndScrolling();

  // and observe <pre> tags
  document.querySelectorAll('pre').forEach((pre) => {
    if (isProseEl(pre)) resizeObserver.observe(pre);
  });

  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(resizeObserver);
  }

  // account for dynamically added tables

  const { MutationObserver } = window;
  if (!MutationObserver) return;

  const mutationObserver = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      for (const node of mutationRecord.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node instanceof HTMLTableElement) {
          setUpTableWrappers(node);
          setUpTableObservingAndScrolling();
        } else {
          node.querySelectorAll('table').forEach(setUpTableWrappers);
          setUpTableObservingAndScrolling();
        }
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(mutationObserver);
  }
};

if (!window.IS_STORYBOOK) setUpKeyboardAccessibleTableAndPre();

export default setUpKeyboardAccessibleTableAndPre;

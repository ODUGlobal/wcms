const setUpLinkify = () => {
  const linkifySelector = '[data-linkify-url]';

  // delegate linkify click-handling
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const linkifiedEl = event.target.closest(linkifySelector);
    if (!(linkifiedEl instanceof HTMLElement)) return;

    // clicking link or button within linkified el should not trigger linkified el's click-action
    if (
      event.target.closest(`${linkifySelector} a`) ||
      event.target.closest(`${linkifySelector} button`)
    ) {
      // do we also need to stop propagation?
      return;
    }

    // allow user to highlight text within area without navigating away
    const selection = window.getSelection();
    if (selection && selection.toString()) return;

    // otherwise, navigate to url
    const { linkifyUrl } = linkifiedEl.dataset;
    if (typeof linkifyUrl === 'string') {
      window.location.assign(linkifyUrl);
    }
  });

  /** Adds all the `data-interactive-classes` classes to the element's actual `classList`. */
  const applyInteractiveClasses = (el: HTMLElement) => {
    const { interactiveClasses: rawInteractiveClasses } = el.dataset;
    if (rawInteractiveClasses) {
      const interactiveClasses = rawInteractiveClasses.trim().split(/\s+/);
      el.classList.add(...interactiveClasses);
    }
  };

  for (const el of document.querySelectorAll(linkifySelector)) {
    if (el instanceof HTMLElement) {
      applyInteractiveClasses(el);
    }
  }

  /* Account for dynamically added elements (they need their interactive classes applied). */

  const { MutationObserver } = window;
  if (!MutationObserver) return;

  const mutationObserver = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      for (const node of mutationRecord.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        node.querySelectorAll(linkifySelector).forEach((el) => {
          if (el instanceof HTMLElement) {
            applyInteractiveClasses(el);
          }
        });
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // In Storybook, add observer to global store so we can disconnect it in script-runner on story-change
  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(mutationObserver);
  }
};

if (!window.IS_STORYBOOK) setUpLinkify();

export default setUpLinkify;

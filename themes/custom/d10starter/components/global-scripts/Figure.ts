const setUpFigure = () => {
  /*
    Chrome/VoiceOver combo doesn't automatically turn `figcaption` text into
    the accessible name for the parent-`figure`. To remedy this, we must
    repeat the `figcaption` text as the figure's `aria-label`.
  */

  type HTMLFigureElement = Omit<Element, 'tagName'> & {
    tagName: 'FIGURE';
  };

  const isHTMLFigureElement = (el: Element): el is HTMLFigureElement =>
    el.tagName === 'FIGURE';

  type HTMLFigCaptionElement = Omit<Element, 'tagName'> & {
    tagName: 'FIGCAPTION';
  };

  const isHTMLFigCaptionElement = (el: Element): el is HTMLFigCaptionElement =>
    el.tagName === 'FIGCAPTION';

  const makeFigCaptionAriaLabel = (figure: HTMLFigureElement) => {
    if (figure.hasAttribute('aria-label')) return;

    const { firstElementChild, lastElementChild } = figure;
    if (!firstElementChild || !lastElementChild) return;

    const figcaption = [firstElementChild, lastElementChild].find(
      isHTMLFigCaptionElement
    );
    if (!figcaption) return;

    const label = figcaption.textContent;
    if (!label) return;

    figure.removeAttribute('aria-labelledby');
    figure.setAttribute('aria-label', label.replace(/\s+/g, ' ').trim());
  };

  document
    .querySelectorAll<HTMLFigureElement>('figure')
    .forEach(makeFigCaptionAriaLabel);

  /* Account for dynamically added elements. */

  const { MutationObserver } = window;
  if (!MutationObserver) return;

  const mutationObserver = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      for (const node of mutationRecord.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (isHTMLFigureElement(node)) {
          makeFigCaptionAriaLabel(node);
        }
        node
          .querySelectorAll<HTMLFigureElement>('figure')
          .forEach(makeFigCaptionAriaLabel);
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // In Storybook, add observer to global store so we can disconnect it in script-runner on story-change
  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(mutationObserver);
  }
};

if (!window.IS_STORYBOOK) setUpFigure();

export default setUpFigure;

/*
  The fancy-link uses `will-change` on its before/after. Since apparently
  this property can cause poor performance if used on too many elements,
  we use an IntersectionObserver to only enable it when the link in
  question is actually in the viewport. (Not sure if this helps, honestly.)
*/
const setUpFancyLink = () => {
  const { IntersectionObserver } = window;
  if (!IntersectionObserver) return;

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('in-viewport');
      } else {
        target.classList.remove('in-viewport');
      }
    });
  });

  document.querySelectorAll('.fancy-link').forEach((el) => {
    intersectionObserver.observe(el);
  });

  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(intersectionObserver);
  }

  /* Account for dynamically added elements (they need their interactive classes applied). */

  const { MutationObserver } = window;
  if (!MutationObserver) return;

  const mutationObserver = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      for (const node of mutationRecord.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        node.querySelectorAll('.fancy-link').forEach((el) => {
          intersectionObserver.observe(el);
        });
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  if (window.IS_STORYBOOK && window.observers) {
    window.observers.add(mutationObserver);
  }
};

if (!window.IS_STORYBOOK) setUpFancyLink();

export default setUpFancyLink;

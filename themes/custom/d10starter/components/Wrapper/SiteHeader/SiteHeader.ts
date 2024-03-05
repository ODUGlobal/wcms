const setUpSiteHeader = () => {
  const SCREENS = preval`
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('/app/full-tailwind-config.json'));
    module.exports = config.theme.screens;
  ` as Partial<Record<string, string | { min?: string }>>;

  const { 'sidebar-up': sidebarUpScreen } = SCREENS;
  if (!sidebarUpScreen) {
    console.error(
      "No `sidebar-up` property found in the Tailwind config's `screens`."
    );
    return;
  }

  const sidebarUpMinWidth =
    typeof sidebarUpScreen === 'string' ? sidebarUpScreen : sidebarUpScreen.min;
  if (!sidebarUpMinWidth) {
    console.error(
      "No min-width string could be extracted from the Tailwind config's `screens['sidebar-up']`."
    );
    return;
  }

  const { debounce, throttle } = window;
  if (!debounce || !throttle) {
    console.error(
      'Make sure that the `debounceAndThrottle` script runs before the `SiteHeader` script.'
    );
    return;
  }

  const header = document.getElementById('site-header');
  if (!header) {
    console.error('No `#site-header` found in the DOM.');
    return;
  }

  const sidebarUpBreakpoint = window.matchMedia(
    `(min-width: ${sidebarUpMinWidth})`
  );

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const isButtonArray = (els: Element[]): els is HTMLButtonElement[] =>
    els.every((el) => el instanceof HTMLButtonElement);

  /**
   * For a "pushdown" menu (i.e., `height` is animated on open/close). Includes autofocus
   * behavior on open/close and creates a focus-trap. (TODO: make focus-trap and autofocus
   * optional.) Note that the focus-trap likely won't work correctly in macOS Safari unless
   * the user has enabled the "Press Tab to highlight each item on a webpage" setting in the
   * browser's Preferences (under the Advanced tab); as far as I know there's no way around
   * this limitation.
   *
   * For now, this is really only for "above-the-fold" pushdowns, so to avoid FOUC, this isn't
   * set up for progressive enhancement. Rather, do graceful degradation for non-JS users:
   * i.e., use `noscript style` tags to hide the toggle buttons altogether when JS is
   * disabled, and put the pushdown's contents in a `noscript details/summary` to make
   * the content accessible in that case.
   *
   * A few notes about setting this up in the HTML and CSS:
   *
   * - The menu-element itself (`menuDivSelector`) must have a CSS rule that gives it
   *   `visibility: hidden` or `display: none` when it has the `aria-hidden="true"` attribute,
   *   and it must HAVE that attribute to begin with. This is to ensure that the menu can't
   *   be tabbed to while it's closed. An argument in favor of `visibility` is that
   *   some versions of VoiceOver/iOS have a bug where focus can't be placed in an
   *   element that previously had `display: none`. But with `visibility` there's a risk
   *   of the heights of elements inside the menu causing the page's height to
   *   grow beyond what its height should be on pages that have very little content
   *   (when the menu is closed, I mean), so be careful if you go this route (might
   *   try combining with `sr-only` mechanism to "correct" that).
   *
   * - For the open/close transition to work smoothly, the menu-element must not have
   *   any y-padding on it, and it also must have its (y-)overflow set to `hidden`,
   *   at least during the transitions. (If you'd like, you can use the presence
   *   of the `data-is-transitioning` attribute on the menu-element as a styling hook.)
   *
   * - The menu-element should start with `style="transition: height 300ms; height: 0;"`
   *   in the HTML. (TODO: Make this unnecessary [without opening door to FOUC!], and
   *   perhaps provide method of customizing the transition-duration from the HTML.)
   *
   * - The toggle-button(s) should start with `aria-expanded="false"` in the markup. To
   *   style the button based on the open/closed state of the menu, you should use
   *   `[aria-expanded="true"]` as a hook in your selectors.
   */
  const setUpPushdownMenu = ({
    menuDivSelector,
    menuToggleButtonSelector,
    minWidthMediaQuery,
    closeButtonSelector,
    autofocusTargetSelector,
    preventScrollForAutofocusTarget,
    focusTrapRecalcBreakpoints,
    focusTrapRecalcAttributes,
  }: {
    /** Only one `HTMLDivElement` should match this selector. */
    menuDivSelector: string;
    /**
     * There may be more than one toggle-button
     * (but only one should be visible/not-hidden at a given viewport-width).
     */
    menuToggleButtonSelector: string;
    /** Above this breakpoint (if one is supplied), the menu and toggler-button(s) are hidden. */
    minWidthMediaQuery?: MediaQueryList;
    /**
     * In case there's a dedicated close-button inside the menu.
     * At most, one `HTMLButtonElement` should match this selector.
     * If supplied, toggler-button(s) will be omitted from focus-trap.
     */
    closeButtonSelector?: string;
    /**
     * If supplied, will focus on this element when menu opens
     * (otherwise, will focus on first focusable).
     * Should match at most one `HTMLElement`.
     */
    autofocusTargetSelector?: string;
    /**
     * If `true`, will use the `.focus({ preventScroll: true })` option
     * when automatically applying focus after the menu opens. Good to use
     * if the autofocus target is something tall (like a `nav` element
     * with `tabindex="-1"`), and the top of the autofocus target is already
     * going to be visible when the menu opens, because otherwise we'll get
     * a "jump" of the scroll-position if the ENTIRE tall element doesn't
     * fit in the viewport. Note that browser support for `preventScroll` is
     * new-ish, so you might want to include a polyfill if you use this option
     * (there may already be one in the `@components/global-scripts/` directory).
     */
    preventScrollForAutofocusTarget?: boolean;
    /**
     * In case there are breakpoints at which the focus-trap must be
     * recalculated (because the first or last focusable element
     * has its visibility toggled, say), provide an array of those
     * breakpoints here.
     */
    focusTrapRecalcBreakpoints?: MediaQueryList[];
    /**
     * If it's necessary to recalculate the focus-trap whenever some
     * specific attributes change on elements within the menu, then specify
     * them here.
     */
    focusTrapRecalcAttributes?: string[];
  }) => {
    const menu = header.querySelector(menuDivSelector);

    if (!(menu instanceof HTMLDivElement)) {
      console.error(
        `The ${menuDivSelector} pushdown-menu wasn't found in the DOM (or is not a div).`
      );
      return;
    }

    // could do a more fine-grained check here, but I'm worried about possible browser-differences, so just check existence
    if (!menu.style.height || !menu.style.transition) {
      console.error(
        `The \`${menuDivSelector}\` element must start out with an inline \`style\` attribute that has \`height: 0;\` and \`transition: height 300ms;\`.`
      );
      return;
    }

    if (menu.getAttribute('aria-hidden') !== 'true') {
      console.error(
        `The \`${menuDivSelector}\` element must start out with \`aria-hidden="true"\`.`
      );
      return;
    }

    const { display: menuDisplay, visibility: menuVisibilitity } =
      window.getComputedStyle(menu);
    if (!(menuDisplay === 'none' || menuVisibilitity === 'hidden')) {
      console.error(
        `The \`${menuDivSelector}\` element must start out with \`display: none\` or \`visibility: hidden\` (and that CSS property should be dependent on the element's \`aria-hidden="true"\` state).`
      );
      return;
    }

    const togglers = [...header.querySelectorAll(menuToggleButtonSelector)];

    if (togglers.length === 0) {
      console.error(
        `No toggle-button found for the ${menuDivSelector} pushdown-menu.`
      );
      return;
    }

    if (!isButtonArray(togglers)) {
      console.error(
        `A toggler for the ${menuDivSelector} pushdown-menu isn't a button.`
      );
      return;
    }

    /**
     * Because there might be more than one toggler-button in the DOM,
     * this function cycles through them attempting focus, stopping
     * when one works (and scrolling it into view if necessary).
     */
    const focusOnToggler = () => {
      for (const toggler of togglers) {
        toggler.focus();
        if (toggler === document.activeElement) {
          const { IntersectionObserver } = window;
          if (!IntersectionObserver) return;

          new IntersectionObserver(([entry], observer) => {
            // use 0.9 instead of 1 because of some Safari weirdness
            if (entry && entry.intersectionRatio < 0.9) {
              toggler.scrollIntoView();
            }
            observer.disconnect();
          }).observe(toggler);

          return;
        }
      }
    };

    const closeButton =
      !!closeButtonSelector && menu.querySelector(closeButtonSelector);

    if (closeButtonSelector && !closeButton) {
      console.error(`No close-button found matching ${closeButtonSelector}.`);
      return;
    }

    if (closeButton && !(closeButton instanceof HTMLButtonElement)) {
      console.error(`The ${closeButtonSelector} element isn't a button.`);
      return;
    }

    const includeTogglersInFocusTrap = !closeButton;

    const candidateAutofocusTarget =
      !!autofocusTargetSelector && menu.querySelector(autofocusTargetSelector);

    if (autofocusTargetSelector && !candidateAutofocusTarget) {
      console.error(`No element found matching ${autofocusTargetSelector}`);
      return;
    }

    if (
      candidateAutofocusTarget &&
      !(candidateAutofocusTarget instanceof HTMLElement)
    ) {
      console.error(
        `The ${autofocusTargetSelector} element isn't an HTMLElement.`
      );
      return;
    }

    /**
     * Will be `true` if menu is in its closed state.
     * Will be `false` if menu is open or transitioning (opening/closing).
     */
    const isConcealed = () => menu.getAttribute('aria-hidden') === 'true';

    /**
     * Will be `true` only while the menu is opening or closing.
     * Used to prevent button-clicks from doing anything during animations,
     * and the data-attribute itself can be used as a styling hook if desired.
     */
    const isTransitioning = () => !!menu.dataset.isTransitioning;

    // These two re-assignable variables get set every time `makeFocusTrap` runs.
    let autofocusTarget: typeof candidateAutofocusTarget = null;
    let handleKeydown: ((event: KeyboardEvent) => void) | undefined = undefined;

    /** Creates focus-trap, and sets `autofocusTarget` and `keydownHandler`. */
    const makeFocusTrap = () => {
      /**
       * Cache to help make hidden-checking less expensive;
       * `true` means it's hidden, `false` means it's visible.
       */
      const elHiddenCache = new Map<HTMLElement, boolean>();

      const treeWalker = document.createTreeWalker(
        menu,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;

            /*
              Must use `node.getAttribute('tabindex')` to distinguish the
              "actually set to -1 in the markup" case from the "just a normal
              non-interactive element whose `tabindex` attribute hasn't been
              explicitly set" case (because `node.tabIndex` returns `-1` for
              BOTH of those). Then for all other cases we need `node.tabIndex`
              to get the effective tab-index (because `node.getAttribute('tabindex')`
              returns `null` if the `tabindex` attribute hasn't been explicitly set,
              and we're looking for effective values of `0` and above).
            */
            const tabIndexIsNegativeOne =
              node.getAttribute('tabindex') === '-1';

            // rule out if tabindex isn't >= 0 AND isn't EXPLICITLY -1
            if (!tabIndexIsNegativeOne && node.tabIndex < 0) {
              return NodeFilter.FILTER_SKIP;
            }

            // if there's no need for breakpoint or attribute-based recalculations, just accept the node
            if (
              (!focusTrapRecalcBreakpoints ||
                !focusTrapRecalcBreakpoints.length) &&
              (!focusTrapRecalcAttributes || !focusTrapRecalcAttributes.length)
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }

            /*
              If there's need for breakpoint or attribute-based recalculations,
              we now do an expensive check to find out if the element is currently
              "hidden". To test this, we check for `display: none` on the element
              and, if necessary, each of its parents, all the way up to the `menu`
              itself (which we of course don't check). Note: we don't test
              `visibility: hidden`, because that's an inherited property, and
              if the whole `menu` is hidden using that method (as opposed to
              using `display: none`), then EVERYTHING inside the menu will
              have `visibility: hidden`, and there won't be a way to distinguish
              the "hidden because the menu is hidden" case from the "would be
              hidden even if the menu were open" case.

              So if something focusable inside the menu needs to be hidden at some
              breakpoints (or when some specified attribute-mutation occurs),
              use `display: none` instead of `visibility: hidden`!
              (Really this only matters for the very-first or very-last focusable
              things, since they're the key elements of the focus-trap.)
            */

            let el: HTMLElement | null = node;

            while (el && el !== menu && menu.contains(el)) {
              const cachedValue = elHiddenCache.get(el);

              // if cached value is `true` (hidden), then `node` is hidden and we can skip.
              if (cachedValue) {
                return NodeFilter.FILTER_SKIP;
              }

              // if cached value is `false`, we can move to parentElement without computing style
              if (cachedValue === false) {
                el = el.parentElement;
                continue;
              }

              // if there was no cached value, then we have to compute style (expensive but we have to)
              const { display } = window.getComputedStyle(el);

              // is hidden, so add el to cache as `true` and skip node
              if (display === 'none') {
                elHiddenCache.set(el, true);
                return NodeFilter.FILTER_SKIP;
              }

              // is visible, so add el to cache as `false` and move to parentElement
              elHiddenCache.set(el, false);
              el = el.parentElement;
            }

            // if it's survived, then accept it
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      const focusableElements: HTMLElement[] = [];

      let currentNode: Node | null = null;
      while ((currentNode = treeWalker.nextNode())) {
        if (currentNode instanceof HTMLElement) {
          focusableElements.push(currentNode);
        }
      }

      // Note that its `tabindex` may be `'-1'` (i.e., doesn't have to be KEYBOARD-tabbable).
      autofocusTarget =
        candidateAutofocusTarget || focusableElements.find(Boolean) || null;

      /** Should be first element of focus-trap (may be the same as `autofocusTarget). */
      const firstFocusable = focusableElements.find((e) => e.tabIndex >= 0);

      /** Should be last element of focus-trap. */
      const lastFocusable = focusableElements.pop();

      // remove old focus-trap (if there is one)
      if (handleKeydown) {
        document.removeEventListener('keydown', handleKeydown);
      }

      // set up new focus-trap (if applicable)
      if (firstFocusable && firstFocusable !== lastFocusable) {
        handleKeydown = (event) => {
          if (isConcealed() || event.key !== 'Tab') return;

          const { activeElement } = document;

          if (!activeElement || !menu.contains(activeElement)) return;

          if (event.shiftKey) {
            if (activeElement === firstFocusable) {
              if (includeTogglersInFocusTrap) {
                event.preventDefault();
                focusOnToggler();
              } else if (lastFocusable) {
                event.preventDefault();
                lastFocusable.focus();
              }
            } else if (
              /*
                Account for case where something w/ -1 tabindex BEFORE `firstFocusable` has received programmatic focus.
                Note: leave the `&` (it's NOT a typo for `&&`).
              */
              activeElement.compareDocumentPosition(firstFocusable) &
              Node.DOCUMENT_POSITION_FOLLOWING
            ) {
              if (includeTogglersInFocusTrap) {
                event.preventDefault();
                focusOnToggler();
              } else if (lastFocusable) {
                event.preventDefault();
                lastFocusable.focus();
              }
            } else if (
              includeTogglersInFocusTrap &&
              togglers.some((toggler) => toggler === activeElement)
            ) {
              if (lastFocusable) {
                event.preventDefault();
                lastFocusable.focus();
              }
            }
          } else if (activeElement === lastFocusable) {
            if (includeTogglersInFocusTrap) {
              event.preventDefault();
              focusOnToggler();
            } else if (firstFocusable) {
              event.preventDefault();
              firstFocusable.focus();
            }
          } else if (
            /*
              Account for case where something w/ -1 tabindex AFTER `lastFocusable` has received programmatic focus.
              Note: leave the `&` (it's NOT a typo for `&&`).
            */
            lastFocusable &&
            activeElement.compareDocumentPosition(lastFocusable) &
              Node.DOCUMENT_POSITION_PRECEDING
          ) {
            if (includeTogglersInFocusTrap) {
              event.preventDefault();
              focusOnToggler();
            } else if (firstFocusable) {
              event.preventDefault();
              firstFocusable.focus();
            }
          } else if (
            includeTogglersInFocusTrap &&
            togglers.some((toggler) => toggler === activeElement)
          ) {
            if (firstFocusable) {
              event.preventDefault();
              firstFocusable.focus();
            }
          }
        };

        document.addEventListener('keydown', handleKeydown);
      }
    };

    // make focus-trap once on page-load...
    makeFocusTrap();

    // ... then (if applicable) whenever specified breakpoints are crossed...
    if (focusTrapRecalcBreakpoints) {
      focusTrapRecalcBreakpoints.forEach((breakpoint) => {
        if (breakpoint.addEventListener) {
          breakpoint.addEventListener('change', makeFocusTrap);
        } else {
          // (legacy fallback)
          breakpoint.addListener(makeFocusTrap);
        }
      });
    }

    /*
      ... and finally whenever nodes are added to or removed from the menu,
      or (if applicable) whenever specified attribute-mutations occur in the menu.
      The node-thing is to accommodate pieces like Accordions that have focusable
      elements that only come into existence after some JS executes. If the Accordion script
      runs after the initial focus-trap is set up, then the focus-trap will not have properly
      accounted for the Accordion's buttons and may consequently be wrong! So we re-make
      the focus-trap when nodes are added or removed inside the menu.
    */
    const mutationObserver = new MutationObserver(
      debounce(makeFocusTrap, 250, { trailing: true })
    );
    mutationObserver.observe(menu, {
      childList: true,
      subtree: true,
      ...(focusTrapRecalcAttributes
        ? { attributeFilter: focusTrapRecalcAttributes }
        : {}),
    });

    if (window.IS_STORYBOOK && window.observers) {
      window.observers.add(mutationObserver);
    }

    /**
     * We want this to be `true` unless the user hit "Escape" to close the menu,
     * in which case it should only be `true` if keyboard-focus was in the menu
     * at the time the "Escape" key was pressed.
     */
    let focusOnTogglerOnClose = true;

    /**
     * Resets state of menu and toggler(s) to "closed but ready to open (if not hidden)."
     * To be used when `minWidthMediaQuery` breakpoint is crossed (if applicable).
     * Note: we do NOT run this on page-load, because doing so would "cover up" the fact
     * that the menu is missing the required in-line height/transition `style` settings
     * in its initial markup (which would risk flash of unstyled content on slow connections).
     */
    const resetState = () => {
      delete menu.dataset.isTransitioning;
      menu.setAttribute('aria-hidden', 'true');
      menu.style.height = '0';
      menu.style.transition = 'height 300ms';
      togglers.forEach((toggler) => {
        toggler.setAttribute('aria-expanded', 'false');
      });
      focusOnTogglerOnClose = true;
    };

    if (minWidthMediaQuery) {
      // when breakpoint is crossed, reset menu state (and use `addListener` backup for old browsers)
      if (minWidthMediaQuery.addEventListener) {
        minWidthMediaQuery.addEventListener('change', resetState);
      } else {
        // (legacy fallback)
        minWidthMediaQuery.addListener(resetState);
      }
    }

    // basic idea from https://css-tricks.com/using-css-transitions-auto-dimensions/

    /**
     * When close-transition ends:
     *  - remove self as listener from menu,
     *  - delete menu's `data-is-transitioning` attribute,
     *  - set the menu's `aria-hidden` attribute to `'true'`,
     *  - apply focus to available `toggler` (if `focusOnTogglerOnClose` is `true`),
     *  - reset `focusOnTogglerOnClose` to `true`.
     */
    const closeTransitionEnd: EventListener = ({ target, currentTarget }) => {
      if (target !== currentTarget) return;
      menu.removeEventListener('transitionend', closeTransitionEnd);
      delete menu.dataset.isTransitioning;
      menu.setAttribute('aria-hidden', 'true');
      if (focusOnTogglerOnClose) {
        focusOnToggler();
      }
      focusOnTogglerOnClose = true;
    };

    /**
     * When open-transition ends:
     *  - remove self as listener from menu,
     *  - unset the menu's `height`,
     *  - delete menu's `is-transitioning` attribute,
     *  - apply focus to `autofocusTarget`.
     */
    const openTransitionEnd: EventListener = ({ target, currentTarget }) => {
      if (target !== currentTarget) return;
      menu.removeEventListener('transitionend', openTransitionEnd);
      menu.style.removeProperty('height');
      delete menu.dataset.isTransitioning;
      if (autofocusTarget) {
        if (preventScrollForAutofocusTarget) {
          autofocusTarget.focus({ preventScroll: true });
        } else {
          autofocusTarget.focus();
        }
      }
    };

    // Just in case: if transition is canceled, remove menu's `transitionend` listeners and reset state
    menu.addEventListener('transitioncancel', ({ target, currentTarget }) => {
      if (target !== currentTarget) return;
      menu.removeEventListener('transitionend', closeTransitionEnd);
      menu.removeEventListener('transitionend', openTransitionEnd);
      resetState();
    });

    /**
     * Handles the close-transition for menu, and sets `aria-expanded` to `'false'` on the toggler(s).
     */
    const close = () => {
      const height = menu.scrollHeight;
      const { transition } = menu.style;
      togglers.forEach((toggler) => {
        toggler.setAttribute('aria-expanded', 'false');
      });
      menu.style.removeProperty('transition');

      requestAnimationFrame(() => {
        menu.addEventListener('transitionend', closeTransitionEnd);

        if (prefersReducedMotion.matches) {
          // looks to be working in all browsers, but in case of problems maybe experiment w/ `requestAnimationFrame()`?
          menu.style.transition = transition;
          menu.style.height = '0';
          menu.dispatchEvent(new Event('transitionend'));
        } else {
          menu.style.height = `${height}px`;
          menu.style.transition = transition;
          requestAnimationFrame(() => {
            menu.style.height = '0';
          });
        }
      });
    };

    /**
     * Scrolls (hidden) menu into view if it's above the viewport (so that open-transition will be visible),
     * sets the menu's `aria-hidden` attribute to `'false'`, handles menu's open-transition,
     * and sets `aria-expanded` to `'true'` on toggler(s).
     */
    const open = () => {
      if (menu.getBoundingClientRect().top < 0) {
        menu.scrollIntoView();
      }
      menu.setAttribute('aria-hidden', 'false');
      menu.addEventListener('transitionend', openTransitionEnd);
      menu.style.height = `${menu.scrollHeight}px`;
      if (prefersReducedMotion.matches) {
        menu.dispatchEvent(new Event('transitionend'));
      }
      togglers.forEach((toggler) => {
        toggler.setAttribute('aria-expanded', 'true');
      });
    };

    // click-handler for toggler(s)
    togglers.forEach((toggler) => {
      toggler.addEventListener('click', () => {
        if (isTransitioning()) return;
        menu.dataset.isTransitioning = 'true';

        if (isConcealed()) open();
        else close();
      });
    });

    document.addEventListener('keydown', ({ key }) => {
      /*
        `isTransitioning()` will also get checked as a result of `toggler.click()` below, but
        we need to check here too to prevent wrongly setting `focusOnTogglerOnClose`.
      */
      if (isTransitioning()) return;

      if (key !== 'Escape' || isConcealed()) return;

      const activeEl = document.activeElement;
      if (!menu.contains(activeEl)) {
        focusOnTogglerOnClose = false;
      }

      togglers.forEach((toggler) => {
        toggler.click();
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        if (isConcealed()) return;

        togglers.forEach((toggler) => {
          toggler.click();
        });
      });
    }
  };

  const setUpMobileNav = () => {
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav) {
      console.error('No `nav#mobile-nav` found.');
      return;
    }

    /**
     * Its `--translate-x` and `--height` CSS variables determine which list
     * is showing and how tall the visible region here is.
     */
    const mobileNavFrame = mobileNav.querySelector('#mobile-nav-frame');
    if (!(mobileNavFrame instanceof HTMLDivElement)) {
      console.error('No `#mobile-nav-frame` div found in `nav#mobile-nav`.');
      return;
    }

    const lists = Array.from(mobileNavFrame.querySelectorAll('ul'));
    if (!lists[0]) {
      console.error('No `ul` lists in `#mobile-nav-frame`.');
      return;
    }

    for (const list of lists) {
      if (
        !(list.parentElement instanceof HTMLDivElement) ||
        list.parentElement.dataset.mobileNavUlWrapper === undefined
      ) {
        console.error(
          'All `ul` elements in `#mobile-nav-frame` must have a `div[data-mobile-nav-ul-wrapper]` parent.'
        );
        return;
      }

      const { depth, label } = list.dataset;
      if (depth === undefined) {
        console.error(
          'All `ul` elements in `#mobile-nav-frame` must have a `data-depth` attribute.'
        );
        return;
      }
      if (label === undefined) {
        console.error(
          'All `ul` elements in `#mobile-nav-frame` must have a `data-level` attribute.'
        );
        return;
      }
    }

    const buttons = mobileNavFrame.querySelectorAll('button');
    if (!buttons.length) {
      console.error('No buttons in `#mobile-nav-frame`.');
      return;
    }

    // set up button/target relationships (to be used in event-handler later)

    const buttonsAndTargets = new Map<
      (typeof buttons)[number],
      (typeof lists)[number]
    >();

    for (const button of buttons) {
      const { mobileNavBack, mobileNavNext } = button.dataset;

      if (mobileNavBack === undefined && mobileNavNext === undefined) {
        console.error(
          'All buttons in `#mobile-nav-frame` must either have a `data-mobile-nav-back` or a `data-mobile-nav-next` attribute.'
        );
        return;
      }

      if (mobileNavBack !== undefined) {
        const ownList = button.closest('ul');
        if (!ownList) {
          console.error(
            'A `[data-mobile-nav-back]` button has no `ul` ancestor.'
          );
          return;
        }

        const target = ownList.parentElement!.closest('ul');
        if (!target) {
          console.error(
            'A `[data-mobile-nav-back]` button has no `ul` target.'
          );
          return;
        }

        buttonsAndTargets.set(button, target);
      } else if (mobileNavNext !== undefined) {
        const sibling = button.nextElementSibling;
        if (!sibling) {
          console.error(
            'A `[data-mobile-nav-next]` button has no next-sibling.'
          );
          return;
        }

        const target = sibling.querySelector('ul');
        if (!target) {
          console.error(
            'A `[data-mobile-nav-next]` button has no `ul` target.'
          );
          return;
        }

        buttonsAndTargets.set(button, target);
      }
    }

    /*
      This ResizeObserver will be responsible for maintaining height of `mobileNavFrame`
      (necessary b/c the lists that come into view will have absolute-positioning).
      If ResizeObserver isn't available, will just set the height statically (but it should
      be available anyway b/c of our polyfill.io fetch).
    */
    const resizeObserver = window.ResizeObserver
      ? new ResizeObserver((entries) => {
          entries.forEach(({ target, contentBoxSize, contentRect }) => {
            if (!(target instanceof HTMLElement)) return;

            let height: number | undefined = undefined;

            /*
              We should probably use `borderBoxSize` instead, but Safari < 15.4 only has
              `contentRect` (not even `contentBoxSize`!), so to avoid having to do any
              calculations here for Safari (where bugs might ONLY be detectable in that
              browser), we'll just use `contentBoxSize` for non-Safari.
            */
            if (contentBoxSize) {
              height =
                contentBoxSize instanceof ResizeObserverSize
                  ? contentBoxSize.blockSize
                  : contentBoxSize[0]!.blockSize;
            } else {
              height = contentRect.height;
            }

            mobileNavFrame.style.setProperty('--height', `${height}px`);
          });
        })
      : undefined;

    if (window.IS_STORYBOOK && window.observers && resizeObserver) {
      window.observers.add(resizeObserver);
    }

    /**
     * This function handles all necessary JS for setting a new "active" list
     * (including replacing the previous one, if applicable). Note that
     * we use the `data-active-list` attribute to mark the "active" list in
     * the DOM; we can use this as a styling hook, but also it's important to
     * know that we have the menu's focus-trap set to recalculate when that
     * attribute changes on an element in the menu, so be sure to leave that
     * in place.
     */
    const setActiveList = (newActiveList: (typeof lists)[number]) => {
      // handle the non-active lists first
      for (const otherList of lists) {
        if (otherList === newActiveList) continue;

        // make sure it's not marked as "active"
        delete otherList.dataset.activeList;

        // if it is NOT an ancestor of the about-to-be-active list, just hide it
        if (!otherList.contains(newActiveList)) {
          otherList.hidden = true;
          continue;
        }

        /*
          If it IS an ancestor of the about-to-be-active list, we have to be more granular,
          because hiding it would cause the about-to-be-active list to be hidden too.
        */

        // make sure it is NOT hidden
        otherList.hidden = false;

        // make screen-readers ignore it (but not its descendants)
        otherList.setAttribute('role', 'none');
        otherList.removeAttribute('aria-label');
        otherList.removeAttribute('tabindex');

        // hide or do the "granular" thing for the `li`-children
        for (const li of otherList.children) {
          if (!(li instanceof HTMLElement)) continue;

          // if it's NOT an ancestor of the about-to-be-active list, just hide it
          if (!li.contains(newActiveList)) {
            li.hidden = true;
            continue;
          }

          // if it IS an ancestor of the about-to-be-active list, we have to be more granular again...

          // make sure it is NOT hidden
          li.hidden = false;

          // make screen-readers ignore it (but not its descendants)
          li.setAttribute('role', 'none');

          // hide each child that is NOT an ancestor of the about-to-be-active list
          for (const el of li.children) {
            if (!(el instanceof HTMLElement)) continue;
            if (!el.contains(newActiveList)) el.hidden = true;
          }
        }
      }

      /*
        For the about-to-be-active list, mark it "active," ready it for programmatic focus,
        and "undo" everything above that we do for the non-active lists.
      */

      newActiveList.dataset.activeList = 'true';
      newActiveList.hidden = false;
      newActiveList.setAttribute('role', 'list'); // set it explicitly for benefit of VoiceOver users
      newActiveList.setAttribute('aria-label', newActiveList.dataset.label!);
      newActiveList.tabIndex = -1;

      for (const li of newActiveList.children) {
        if (!(li instanceof HTMLElement)) continue;

        li.hidden = false;
        li.removeAttribute('role');

        for (const el of li.children) {
          if (!(el instanceof HTMLElement)) continue;
          el.hidden = false;
        }
      }

      // configure the menu's height to match the height of this list's parent-div
      const listWrapper = newActiveList.parentElement!;
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver.observe(listWrapper);
      } else {
        // if no ResizeObserver, just SET the height (won't be responsive, but better than nothing)
        mobileNavFrame.style.setProperty(
          '--height',
          `${listWrapper.getBoundingClientRect().height}px`
        );
      }

      // finally, bring this list into view...
      mobileNavFrame.style.setProperty(
        '--translate-x',
        `calc(-100% * ${Number(newActiveList.dataset.depth)})`
      );

      // ...and focus on it (note: WILL run on page-load when menu is hidden, but this is harmless b/c it won't succeed)
      newActiveList.focus({ preventScroll: true });

      // help VoiceOver/iOS achieve the focus if needed (b/c of its occasional `display: none` bug)
      if (document.activeElement !== newActiveList) {
        requestAnimationFrame(() => {
          newActiveList.focus({ preventScroll: true });
          if (document.activeElement !== newActiveList) {
            requestAnimationFrame(() => {
              newActiveList.focus({ preventScroll: true });
            });
          }
        });
      }
    };

    /*
      Set initial `activeList` to the one with the `aria-current="page"` link, if there is one.
      If there isn't one, find the deepest button with `aria-current="true"`, and use its
      list-"target" as the initial `activeList`. If there's no `aria-current="true"` button,
      then make the top-level list the initial `activeList` (as if we're on the Homepage). 
    */
    const currentLink = mobileNavFrame.querySelector('a[aria-current="page"]');
    if (currentLink) {
      const closestUl = currentLink.closest('ul');
      if (!closestUl || !lists.includes(closestUl)) {
        console.error(
          'The `a[aria-current="page"]` in `#mobile-nav-frame` does not have a `ul` ancestor.'
        );
        return;
      }
      setActiveList(closestUl);
    } else {
      const currentButtons = mobileNavFrame.querySelectorAll<HTMLButtonElement>(
        'button[aria-current="true"]'
      );
      if (currentButtons.length > 0) {
        // last one found should be the "deepest"
        const currentButton = currentButtons[currentButtons.length - 1]!;
        const targetList = buttonsAndTargets.get(currentButton);
        if (!targetList) {
          console.error(
            'A `button[aria-current="true"` does not have a corresponding target-list`.'
          );
          return;
        }
        setActiveList(targetList);
      } else {
        setActiveList(lists[0]);
      }
    }

    // make each back/next button set the appropriate active-list
    mobileNavFrame.addEventListener('click', (event) => {
      const { target } = event;
      if (!(target instanceof Element)) return;

      const button = target.closest('button');
      if (!button) return;

      const targetList = buttonsAndTargets.get(button);
      if (targetList) setActiveList(targetList);
    });
  };

  const setUpInfoForSelects = () => {
    const mobileSelect = document.getElementById('mobile-info-for-select');
    if (!(mobileSelect instanceof HTMLSelectElement)) {
      console.error('No `select#mobile-info-for-select` element found.');
      return;
    }

    const desktopSelect = document.getElementById('info-for-select');
    if (!(desktopSelect instanceof HTMLSelectElement)) {
      console.error('No `select#info-for-select` element found.');
      return;
    }

    [mobileSelect, desktopSelect].forEach((select) => {
      /*
        I hate this, but selecting an option in these `<select>` elements
        should trigger navigation to the corresponding page. Not good
        for accessibility, but we do at least include a visually-hidden
        note about this in the markup for the benefit of people using
        screen-readers.
      */
      select.addEventListener('change', (event) => {
        if (!(event.target instanceof HTMLSelectElement)) return;

        const value = event.target.value;
        if (!value) return;

        event.preventDefault();
        window.location.assign(value);
      });

      /*
        In Firefox (at least), when a `<select>` has focus, the right/left arrow-keys
        change which `<option>` is selected. Here, that would cause page-navigation,
        so we suppress it. I don't like messing with the browser's native controls
        like this, but I think in this case it's better than allowing accidental
        navigation.
      */
      select.addEventListener('keydown', (event) => {
        if (['Left', 'Right', 'ArrowLeft', 'ArrowRight'].includes(event.key))
          event.preventDefault();
      });
    });
  };

  const setUpDesktopSectionNav = () => {
    const sectionNav = document.getElementById('section-nav');
    if (!sectionNav) return;

    const sectionNavToggler = document.getElementById('section-nav-toggler');
    if (!sectionNavToggler) return;

    sectionNavToggler.addEventListener('click', () => {
      const wasOpen =
        sectionNavToggler.getAttribute('aria-expanded') === 'true';
      sectionNavToggler.setAttribute(
        'aria-expanded',
        wasOpen ? 'false' : 'true'
      );
      sectionNav.setAttribute('aria-hidden', wasOpen ? 'true' : 'false');
    });

    [sectionNav, sectionNavToggler].forEach((el) =>
      el.addEventListener('keydown', ({ key }) => {
        if (key !== 'Escape') return;
        if (sectionNavToggler.getAttribute('aria-expanded') !== 'true') return;

        sectionNavToggler.click();
        sectionNavToggler.focus();
      })
    );
  };

  setUpPushdownMenu({
    menuDivSelector: '#mobile-menu',
    menuToggleButtonSelector: '#mobile-menu-toggler',
    minWidthMediaQuery: sidebarUpBreakpoint,
    focusTrapRecalcAttributes: ['data-active-list'],
    closeButtonSelector: '#mobile-menu-closer',
    preventScrollForAutofocusTarget: true,
  });

  setUpMobileNav();

  setUpInfoForSelects();

  setUpDesktopSectionNav();
};

if (!window.IS_STORYBOOK) setUpSiteHeader();

export default setUpSiteHeader;

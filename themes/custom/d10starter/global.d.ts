/* eslint-disable init-declarations */
/* eslint-disable max-classes-per-file */
/*
  Use this mainly for declaring global types that affect pattern-level scripts.

  Also use this for SOME things needed in `.stories.ts` files (things that we
  don't want to make the front-end developer import, like stuff that needs to
  be available on `window` in Storybook).

  For types that SHOULD have to be imported into `.stories.ts` files,
  use `./_ts-helpers/types`.
*/

/*
  We can't actually import jQuery et al. into the pattern-level scripts
  (they will just be included as dependencies in <head> both in SB and CMS),
  so we import them here and make their *types* available globally (on `window`).
*/
import jQuery from 'jquery';
import MicroModal from '@types/micromodal';
import lodash from '@types/lodash';
import {
  Child,
  Parent,
  ParentOptions,
  autoInit,
  autoInitInstances,
} from '@types/pym.js';
import VimeoPlayer from '@types/vimeo__player';

class Tabby {
  constructor(
    selector: string,
    options?: {
      /** The prefix to add to tab element IDs if they don't already have one */
      idPrefix?: string;
      /** The selector to use for the default tab */
      default?: string;
    }
  );
  /**
   * Sets up the DOM with the required roles and attributes.
   * If you dynamically add navigation items to the DOM after Tabby is instantiated,
   * you can run this method to set them up.
   */
  setup(): void;
  /** Activate a tab. Accepts the ID of the content to activate, or a tab element, as an argument. */
  toggle(id: string): void;
  /** Destroy the current initialization. */
  destory(): void;
}

declare global {
  declare const COMPONENTS: string;

  declare module '*.twig' {
    const value: (twigContext: Record<string, unknown>) => Promise<string>;
    export default value;
  }

  /**
   * For injected components that require the Twig `|inject_template` filter.
   * Always provide `T` if possible! For "generic" injected-component (i.e.,
   * one that could be anything), can omit `T`, and it will be fine on the
   * Twig side, but then TypeScript might yell at you if you try to do things with
   * a variable/property that's supposed to have that type. Haven't yet found a
   * robust solution for this, but the problem has never come up for me in
   * practice and likely never will, so not worrying about it for now.
   */
  type InjectedComponent<
    T = (
      args?: Record<string, unknown>,
      options?: { usePureComponent?: boolean }
    ) => (extraContext?: Record<string, unknown>) => Promise<string>
  > = ReturnType<T>;

  /** The `$()` / `jQuery()` function. */
  type JQueryStatic = typeof jQuery;

  /** What the `$()` / `jQuery()` function returns (a jQuery-object collection of matched elements). */
  type JQuery = ReturnType<JQueryStatic>;

  /*
    No TypeScript package available for `accessible-slick`. There's one for
    the original "slick slider", but I had trouble making it work, so
    just manually building this from the docs: https://accessible360.github.io/accessible-slick/
  */

  type SlickSettings = {
    /** Default: `false`. Adapts slider height to the current slide */
    adaptiveHeight?: boolean;
    /** Default: `$(element)`. Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object) */
    appendArrows?: string;
    /** Default: `$(element)`. Change where the navigation dots are attached (Selector, htmlString, Array, Element, jQuery object) */
    appendDots?: string;
    /** Default: `true`. Enable Next/Prev arrows */
    arrows?: boolean;
    /** Default: `null`. Determines where the previous and next arrows are placed in the slider DOM, which determines their tabbing order. Arrows can be placed together before the slides or after the slides, or split so that the previous arrow is before the slides and the next arrow is after (this is the default). Use this setting to ensure the tabbing order is logical based on your visual design to fulfill WCAG 1.3.2 and 2.4.3 */
    arrowsPlacement?: 'beforeSlides' | 'afterSlides' | 'split' | null;
    /** Default: `$(element)`. Enables syncing of multiple sliders */
    asNavFor?: string;
    /** Default: `false`. Enables auto play of slides */
    autoplay?: boolean;
    /** Default: `3000`. Auto play change interval */
    autoplaySpeed?: number;
    /** Default: `false`. Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts. */
    centerMode?: boolean;
    /** Default: `'50px'`. Side padding when in center mode. (px or %) */
    centerPadding?: string;
    /** Default: `'ease'`. CSS3 easing */
    cssEase?: string;
    /** Default: n/a. Custom paging templates. See source for use example. */
    customPaging?: () => unknown;
    /** Default: `false`. Current slide indicator dots */
    dots?: boolean;
    /** Default: `'slick-dots'`. Class for slide indicator dots container */
    dotsClass?: string;
    /** Default: `true`. Enables desktop dragging */
    draggable?: boolean;
    /** Default: `'linear'`. animate() fallback easing */
    easing?: string;
    /** Default: `0.15`. Resistance when swiping edges of non-infinite carousels */
    edgeFriction?: number;
    /** Default: `false`. Enables fade */
    fade?: boolean;
    /** Default: `true`. Infinite looping */
    infinite?: boolean;
    /** Default: `0`. Slide to start on */
    initialSlide?: number;
    /** Default: `null`. Instructions for screen reader users placed at the very beginning of the slider markup. **If you are using `asNavFor` or adding custom functionality with API methods/events, you probably need to supply instructions!** */
    instructionsText?: string | null;
    /** Default: `'ondemand'`. Accepts 'ondemand' or 'progressive' for lazy load technique. 'ondemand' will load the image as soon as you slide to it, 'progressive' loads one image after the other when the page loads. */
    lazyLoad?: string;
    /** Default: `false`. Responsive settings use mobile first calculation */
    mobileFirst?: boolean;
    /** Default: `'<button type="button" class="slick-next">Next</button>'`. Allows you to select a node or customize the HTML for the "Next" arrow. */
    nextArrow?: string | Node | JQuery;
    /** Default: `'<span class="slick-pause-icon" aria-hidden="true"></span>'`. Custom element to use as the "pause" icon inside the autoplay pause/play toggle button, when `autoplay` is enabled. */
    pauseIcon?: string | Node | JQuery;
    /** Default: `false`. Pauses autoplay when a dot is hovered */
    pauseOnDotsHover?: boolean;
    /** Default: `true`. Pauses autoplay when slider is focussed */
    pauseOnFocus?: boolean;
    /** Default: `true`. Pauses autoplay on hover */
    pauseOnHover?: boolean;
    /** Default: `'<span class="slick-play-icon" aria-hidden="true"></span>'`. Custom element to use as the "play" icon inside the autoplay pause/play toggle button, when `autoplay` is enabled. */
    playIcon?: string | Node | JQuery;
    /** Default: `'<button type="button" class="slick-prev">Previous</button>'`. Allows you to select a node or customize the HTML for the "Previous" arrow. */
    prevArrow?: string | Node | JQuery;
    /** Default: `'carousel'`. Text to use for the `aria-label` that is placed on the wrapper. */
    regionLabel?: string;
    /** Default: `'window'`. Width that responsive object responds to. Can be 'window', 'slider' or 'min' (the smaller of the two). */
    respondTo?: string;
    /** Default: `null`. Array of objects containing breakpoints and settings objects (see example). Enables settings at given breakpoint. Set settings to "unslick" instead of an object to disable slick at a given breakpoint. */
    responsive?:
      | null
      | { breakpoint: number; settings?: Parameters<Slick>[0] | 'unslick' }[];
    /** Default: `1`. Setting this to more than 1 initializes grid mode. Use slidesPerRow to set how many slides should be in each row. */
    rows?: number;
    /** Default: `false`. Change the slider's direction to become right-to-left */
    rtl?: boolean;
    /** Default: `''`. Slide element query */
    slide?: string;
    /** Default: `1`. With grid mode initialized via the rows option, this sets how many slides are in each grid row. */
    slidesPerRow?: number;
    /** Default: `1`. # of slides to scroll at a time */
    slidesToScroll?: number;
    /** Default: `1`. # of slides to show at a time */
    slidesToShow?: number;
    /** Default: `300`. Transition speed */
    speed?: number;
    /** Default: `true`. Enables touch swipe */
    swipe?: boolean;
    /** Default: `false`. Swipe to slide irrespective of `slidesToScroll` */
    swipeToSlide?: boolean;
    /** Default: `true`. Enables slide moving with touch */
    touchMove?: boolean;
    /** Default: `5`. To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider. */
    touchThreshold?: number;
    /** Default: `true`. Controls whether a pause/play icon button is added when autoplay is enabled. Setting this to `false` without providing an alternative control would likely violate WCAG 2.2.2, so be careful! */
    useAutoplayToggleButton?: boolean;
    /** Default: `true`. Enable/Disable CSS Transitions */
    useCSS?: boolean;
    /** Default: `true`. Controls whether `role="group"` and an `aria-label` are applied to each slide. */
    useGroupRole?: boolean;
    /** Default: `true`. Enable/Disable CSS Transforms */
    useTransform?: boolean;
    /** Default: `false`. Disables automatic slide width calculation */
    variableWidth?: boolean;
    /** Default: `false`. Vertical slide direction */
    vertical?: boolean;
    /** Default: `false`. Changes swipe direction to vertical */
    verticalSwiping?: boolean;
    /** Default: `true`. Ignores requests to advance the slide while animating */
    waitForAnimate?: boolean;
    /** Default: `1000`. Set the zIndex values for slides, useful for IE9 and lower */
    zIndex?: number;
  };

  /** Initializes Slick. */
  function Slick(methodName: 'slick', settings?: SlickSettings): void;
  /** Destroys Slick. */
  function Slick(methodName: 'unslick'): void;
  /** Triggers next slide */
  function Slick(methodName: 'slickNext'): void;
  /** Triggers previous slide */
  function Slick(methodName: 'slickPrev'): void;
  /** Pause Autoplay */
  function Slick(methodName: 'slickPause'): void;
  /** Start Autoplay (will also set `autoplay` option to `true`) */
  function Slick(methodName: 'slickPlay'): void;
  /** Goes to slide by index, skipping animation if `dontAnimate` is set to `true`. */
  function Slick(
    methodName: 'slickGoTo',
    index: number,
    dontAnimate?: boolean
  ): void;
  /** Returns the current slide index. */
  function Slick(methodName: 'slickCurrentSlide'): number;
  /** Add a slide. If an index is provided, will add at that index, or before if addBefore is set. If no index is provided, add to the end or to the beginning if addBefore is set. Accepts HTML String */
  function Slick(
    methodName: 'slickAdd',
    element: string | Node,
    index?: number,
    addBefore?: boolean
  ): void;
  /** Remove slide by index. If removeBefore is set true, remove slide preceding index, or the first slide if no index is specified. If removeBefore is set to false, remove the slide following index, or the last slide if no index is set. */
  function Slick(
    methodName: 'slickRemove',
    index?: number,
    removeBefore?: boolean
  ): void;
  /** Filters slides using jQuery .filter syntax */
  function Slick(
    methodName: 'slickFilter',
    filter: Parameters<JQueryStatic['fn']['filter']>[0]
  ): void;
  /** Removes applied filter */
  function Slick(methodName: 'slickUnfilter'): void;
  /** Gets an option value */
  function Slick<T extends keyof SlickSettings>(
    methodName: 'slickGetOption',
    option: T
  ): SlickSettings[T];
  /** Change a single option to a given value. */
  function Slick<T extends keyof SlickSettings>(
    methodName: 'slickSetOption',
    option: T,
    value: SlickSettings[T],
    /** Updates UI changes */
    refresh?: boolean
  ): void;
  /** Change multiple options at once. */
  function Slick(
    methodName: 'slickSetOption',
    settings: SlickSettings,
    refresh?: boolean
  ): void;
  /** Initialize */
  function Slick(settings?: SlickSettings): JQueryWithSlick;

  /** After slide change callback */
  function SlickOn(
    eventName: 'afterChange',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      currentSlide: number
    ) => void
  ): void;
  /** Before slide change callback */
  function SlickOn(
    eventName: 'beforeChange',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      currentSlide: number,
      nextSlide: number
    ) => void
  ): void;
  /** Fires after a breakpoint is hit */
  function SlickOn(
    eventName: 'breakpoint',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      breakpoint: number
    ) => void
  ): void;
  /** When slider is destroyed, or unslicked. */
  function SlickOn(
    eventName: 'destroy',
    handler: (event: JQuery.Event, slick: JQueryWithSlick) => void
  ): void;
  /** Fires when an edge is overscrolled in non-infinite mode. */
  function SlickOn(
    eventName: 'edge',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      direction: string
    ) => void
  ): void;
  /** When Slick initializes for the first time callback. Note that this event should be defined before initializing the slider. */
  function SlickOn(
    eventName: 'init',
    handler: (event: JQuery.Event, slick: JQueryWithSlick) => void
  ): void;
  /** Every time Slick (re-)initializes callback */
  function SlickOn(
    eventName: 'reInit',
    handler: (event: JQuery.Event, slick: JQueryWithSlick) => void
  ): void;
  /** Every time Slick recalculates position */
  function SlickOn(
    eventName: 'setPosition',
    handler: (event: JQuery.Event, slick: JQueryWithSlick) => void
  ): void;
  /** Fires after swip/drag */
  function SlickOn(
    eventName: 'swipe',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      direction: string
    ) => void
  ): void;
  /** Fires after image loads lazily */
  function SlickOn(
    eventName: 'lazyLoaded',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      image: JQuery,
      imageSource: string
    ) => void
  ): void;
  /** Fires after image fails to load */
  function SlickOn(
    eventName: 'lazyLoadError',
    handler: (
      event: JQuery.Event,
      slick: JQueryWithSlick,
      image: JQuery,
      imageSource: string
    ) => void
  ): void;

  /** Just type-cast to this when using Accessible Slick. */
  type JQueryWithSlick = JQuery & {
    slick: typeof Slick;
    on: JQuery['on'] & typeof SlickOn;
  };

  /*
    Just to override the namespace exported from '@types/pym.js'. We'll add
    a modified version of it to the `Window` interface below.
  */
  namespace pym {}

  /** For BBC's fork of Pym.js */
  class ParentWithSrcdoc extends Parent {
    constructor(
      id: string,
      url: string | null,
      config?: ParentOptions & { srcdoc?: boolean }
    );
  }

  interface Window {
    jQuery: JQueryStatic & {
      magnificPopup?: ((options: Record<string, unknown>) => unknown) &
        Record<string, unknown>;
    };
    IMAGES: string;
    IS_STORYBOOK: boolean;
    STORYBOOK_RENDERED_STORY: string;
    __STORYBOOK_PREVIEW__?: {
      currentRender?: {
        story?: {
          id?: string;
        };
      };
      storyRenders?: {
        store?: {
          args?: {
            argsByStoryId?: Record<
              string,
              {
                simulateNoJs?: boolean;
              }
            >;
          };
        };
      }[];
    };
    frontback: {
      repo: string;
      postUrl: string;
    };
    YT?: unknown;
    Vimeo?: {
      Player: typeof VimeoPlayer;
    };
    VimeoPlayers?: Set<InstanceType<typeof VimeoPlayer>>;
    SlickSliders?: Set<JQueryWithSlick>;
    observers?: Set<ResizeObserver | MutationObserver | IntersectionObserver>;
    MicroModal?: typeof MicroModal;
    /** BBC's fork of Pym.js. */
    pym?: {
      /** Store auto initialized Pym instances for further reference */
      autoInitInstances: typeof autoInitInstances;
      /**
       * Initialize Pym for elements on page that have data-pym attributes.
       * Expose autoinit in case we need to call it from the outside
       * @param {Boolean} doNotRaiseEvents flag to avoid sending custom events
       */
      autoInit: typeof autoInit;
      /** The Child half of a responsive iframe. */
      Child: typeof Child;
      /** The Parent half of a responsive iframe. */
      Parent: typeof ParentWithSrcdoc;
    };
    Tabby?: typeof Tabby;
    // lodash debounce/throttle
    debounce?: typeof lodash.debounce;
    throttle?: typeof lodash.throttle;
  }

  // ensures compatibility w/ Firefox < 92 (and Safari < 15.4)
  interface ResizeObserverCallback {
    (
      entries: (Omit<
        ResizeObserverEntry,
        'borderBoxSize' | 'contentBoxSize'
      > & {
        /** Array in spec; object in Firefox < 92; undefined in Safari < 15.4 */
        readonly borderBoxSize?: ResizeObserverSize;
        /** Array in spec; object in Firefox < 92; undefined in Safari < 15.4 */
        readonly contentBoxSize?: ResizeObserverSize;
      })[],
      observer: ResizeObserver
    ): void;
  }

  /**
   * `babel-plugin-preval` should pre-evaluate this code at build-time and
   * replace the entire `preval()` expression with what the code exports.
   */
  declare const preval: (arg: TemplateStringsArray) => unknown;
}

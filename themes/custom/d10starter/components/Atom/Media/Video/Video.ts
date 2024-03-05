type JQueryWithMfp = JQuery & {
  magnificPopup: typeof window.jQuery.magnificPopup;
};

const setUpVideo = () => {
  const initVideos = () => {
    window.jQuery(document).ready(() => {
      const videoLinks = window.jQuery(
        '[data-mfp-video-popup]'
      ) as JQueryWithMfp;

      const supportsInert = 'inert' in HTMLElement.prototype;
      const inertCache = new Set<HTMLElement>();

      videoLinks.magnificPopup!({
        // disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade mfp-video',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        closeMarkup: /* html */ `
          <button
            type="button"
            class="mfp-close"
            aria-label="Close modal"
          ><span aria-hidden="true" class="pointer-events-none">&#215;</span></button>
        `,
        callbacks: {
          beforeOpen() {
            jQuery('body').addClass('mfp-active');
          },
          beforeClose() {
            jQuery('body').removeClass('mfp-active');
          },
          open(this: { wrap: JQuery }) {
            const [el] = this.wrap;
            if (!el) return;

            el.setAttribute('role', 'dialog');
            el.setAttribute('aria-modal', 'true');
            el.setAttribute('aria-label', 'Video lightbox');

            // set everything else to `inert` and/or `aria-hidden` to prevent VoiceOver/Safari (at least) from leaving modal
            for (const child of document.body.children) {
              if (child === el) continue;
              if (!(child instanceof HTMLElement)) continue;

              if (child.hasAttribute('aria-hidden')) {
                child.dataset.tempAriaHidden =
                  child.getAttribute('aria-hidden') || '';
              }

              if (supportsInert && child.inert) {
                child.dataset.tempInert = 'true';
              }

              child.setAttribute('aria-hidden', 'true');
              if (supportsInert) {
                child.inert = true;
              }

              inertCache.add(child);
            }
          },
          close() {
            // undo `inert` and/or `aria-hidden` on everything else from `open()` method above
            for (const el of inertCache) {
              const { tempAriaHidden, tempInert } = el.dataset;

              if (tempAriaHidden) {
                el.setAttribute('aria-hidden', tempAriaHidden);
                delete el.dataset.tempAriaHidden;
              } else {
                el.removeAttribute('aria-hidden');
              }

              if (supportsInert) {
                if (tempInert) {
                  delete el.dataset.tempInert;
                } else {
                  el.inert = false;
                }
              }
            }

            inertCache.clear();
          },
        },
      });

      // now add `role="button"` to all the open-video anchors
      videoLinks.each((_, el) => {
        el.setAttribute('role', 'button');
      });
    });
  };

  /*
    Because of how mfp works, we actually delete it in SB
    on story-change (see `script-runner`), so we have to
    re-grab it as needed (browser should get it from cache).
    jQuery should already be there in both CMS and SB, though.
  */
  if (window.jQuery.magnificPopup) {
    initVideos();
  } else {
    const script = document.createElement('script');
    script.src =
      '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js';
    script.onload = initVideos;
    document.head.appendChild(script);
  }
};

if (!window.IS_STORYBOOK) setUpVideo();

export default setUpVideo;

type JQueryWithMfp = JQuery & {
  magnificPopup: typeof window.jQuery.magnificPopup;
};

const setUpGallery = () => {
  const initGallery = () => {
    window.jQuery(document).ready(() => {
      const galleries = window.jQuery(
        '[data-mfp-image-gallery]'
      ) as JQueryWithMfp;

      const supportsInert = 'inert' in HTMLElement.prototype;
      const inertCache = new Set<HTMLElement>();

      // use `each` syntax to support multiple galleries: https://dimsemenov.com/plugins/magnific-popup/documentation.html#gallery
      galleries.each(function configureMfp() {
        (window.jQuery(this) as JQueryWithMfp).magnificPopup!({
          delegate: 'a',
          type: 'image',
          mainClass: 'mfp-fade',
          tLoading: 'Loading image #%curr%...',
          gallery: {
            enabled: true,
            navigateByImgClick: false,
            preload: false,
          },
          image: {
            tError: /* html */ `<a href="%url%">The image #%curr%</a> could not be loaded.`,
            verticalFit: false,
            titleSrc: ({ el }: { el: HTMLElement }) => {
              return jQuery(el).attr('data-caption');
            },
            markup: /* html */ `
              <div class="mfp-figure">
                <div class="mfp-close"></div>
                <h2 class="mfp-heading sr-only" tabindex="-1">Viewing item <span class="mfp-counter"></span></h2>
                <div class="mfp-img"></div>
                <div class="mfp-bottom-bar">
                  <div class="mfp-title"></div>
                  <div class="mfp-counter" aria-hidden="true"></div>
                </div>
              </div>
            `,
          },
          closeMarkup: /* html */ `
            <button
              type="button"
              class="mfp-close"
              aria-label="Close modal"
            ><span aria-hidden="true" class="pointer-events-none">&#215;</span></button>
          `,
          arrowMarkup: /* html */ `
            <button
              type="button"
              class="mfp-arrow mfp-arrow-%dir%"
              aria-label="%title%"
            ></button>
          `,
          callbacks: {
            elementParse(item: {
              type?: string;
              tLoading?: string;
              mainClass?: string;
              image?: { tError?: string };
            }) {
              item.type = 'image';
              item.tLoading = 'Loading image #%curr%...';
              item.mainClass = 'image-gallery__popup-launcher';
              item.image = {
                tError: /* html */ `<a href="%url%">The image #%curr%</a> could not be loaded.`,
              };
            },
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
              el.setAttribute('aria-label', 'Gallery lightbox');

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
            imageLoadComplete() {
              const h2 = document.querySelector('.mfp-heading');
              if (h2 instanceof HTMLHeadingElement) {
                h2.focus();
              }
            },
          },
        });
      });

      // set up `aria-describedby` targets
      const galleryDescription = document.querySelector(
        '[data-gallery-description]'
      );
      if (galleryDescription) {
        galleryDescription.id = 'mfp-gallery-description';
      }

      const galleryItemDescription = document.querySelector(
        '[data-gallery-item-description]'
      );
      if (galleryItemDescription) {
        galleryItemDescription.id = 'mfp-gallery-item-description';
      }

      // now set up the `aria-describedby` attributes and add `role="button"` to all the gallery-opening links
      galleries.each((_, gallery) => {
        if (galleryDescription && galleryDescription.id) {
          gallery.setAttribute('aria-describedby', galleryDescription.id);
        }

        const links = gallery.querySelectorAll(
          '[data-mfp-image-gallery-delegate]'
        );
        links.forEach((link) => {
          if (!(link instanceof HTMLAnchorElement)) {
            console.error(
              'A `[data-mfp-image-gallery-delegate]` is not an anchor element but must be.'
            );
            return;
          }
          link.setAttribute('role', 'button');

          if (galleryItemDescription && galleryItemDescription.id) {
            link.setAttribute('aria-describedby', galleryItemDescription.id);
          }
        });
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
    initGallery();
  } else {
    const script = document.createElement('script');
    script.src =
      '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js';
    script.onload = initGallery;
    document.head.appendChild(script);
  }
};

if (!window.IS_STORYBOOK) setUpGallery();

export default setUpGallery;

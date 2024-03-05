/*
  Note: at the time of writing, the functionality here is exactly the same as that in
  `../HomepagePageHeader/HomepagePageHeader.ts` (EXCEPT for the values of `VIDEO_WRAPPER_ID`,
  `VIDEO_BUTTON_ID`, `HERO_OVERLAY_ID`, and `VIDEO_WRAPPER_CONTAINER_ID`), but it's easiest to
  just "duplicate" the code in separate files, given how we have pattern-level scripts set up
  to "accompany" their corresponding Twig files. Also, by keeping them separate, we can
  make changes to one if needed without having to worry about the other.
*/
const setUpHeroPageHeader = () => {
  const VIDEO_WRAPPER_ID = 'hero-header-ambient-video';
  const videoWrapper = document.getElementById(VIDEO_WRAPPER_ID);
  if (!videoWrapper) return;

  const { vimeoVideoId: vimeoId } = videoWrapper.dataset;

  if (!vimeoId) {
    console.error(
      `The #${VIDEO_WRAPPER_ID} element must have a \`data-video-vimeo-id\` but doesn't.`
    );
    return;
  }

  const setUpVideo = () => {
    const VIDEO_BUTTON_ID = 'hero-header-video-button';
    const HERO_OVERLAY_ID = 'hero-header-overlay';

    const videoButton = document.getElementById(VIDEO_BUTTON_ID);
    if (!(videoButton instanceof HTMLButtonElement)) {
      console.error(`No #${VIDEO_BUTTON_ID} element found.`);
      return;
    }

    const heroOverlay = document.getElementById(HERO_OVERLAY_ID);
    if (!heroOverlay) {
      console.error(`No #${HERO_OVERLAY_ID} element found.`);
      return;
    }

    const { Vimeo } = window;
    if (!Vimeo) {
      console.error(`Vimeo player SDK should be loaded but it isn't.`);
      return;
    }

    const player = new Vimeo.Player(videoWrapper, {
      id: Number(vimeoId),
      controls: false,
      keyboard: false,
      loop: true,
      muted: true,
      title: false,
      autoplay: true,
    });

    if (window.IS_STORYBOOK && window.VimeoPlayers) {
      window.VimeoPlayers.add(player);
    }

    /**
     * We keep track of whether the video has started playing
     * at least once yet, so that we can fade out the overlay-picture
     * when the first-play begins, and also so that we can show a
     * loading-spinner between the first ATTEMPT to play and when the
     * first-play actually starts.
     */
    let isFirstPlay = true;

    // As soon as `iframe` is created: disallow tabbing into it, and reveal the toggle-button.
    player
      .ready()
      .then(() => {
        const iframe = videoWrapper.querySelector('iframe');
        if (!iframe) {
          console.error(`No iframe found inside #${VIDEO_WRAPPER_ID} element.`);
          return;
        }
        iframe.tabIndex = -1;
        videoButton.dataset.videoReady = 'true';
      })
      .catch(console.error);

    player.on('play', () => {
      videoButton.setAttribute('aria-pressed', 'true');
      if (isFirstPlay) {
        isFirstPlay = false;
        delete videoButton.dataset.videoLoading;
        heroOverlay.dataset.videoStarted = 'true';
      }
    });

    player.on('pause', () => {
      videoButton.setAttribute('aria-pressed', 'false');
    });

    videoButton.addEventListener('click', () => {
      player
        .getPaused()
        .then((paused) => {
          if (paused) {
            if (isFirstPlay) {
              videoButton.dataset.videoLoading = 'true';
            }
            player.play().catch(console.error);
          } else {
            player.pause().catch(console.error);
          }
        })
        .catch(console.error);
    });

    // now set up aspect-ratio stuff if possible
    const { ResizeObserver } = window;
    if (!ResizeObserver) return;

    const VIDEO_WRAPPER_CONTAINER_ID = 'hero-header-ambient-video-container';
    const videoWrapperContainer = document.getElementById(
      VIDEO_WRAPPER_CONTAINER_ID
    );
    if (!videoWrapperContainer) {
      console.error(`No \`#${VIDEO_WRAPPER_CONTAINER_ID}\` element found.`);
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target, contentBoxSize, contentRect }) => {
        if (!(target instanceof HTMLElement)) return;

        let width: number | undefined = undefined;
        let height: number | undefined = undefined;

        /*
          We should probably use `borderBoxSize` instead, but Safari < 15.4 only has
          `contentRect` (not even `contentBoxSize`!), so to avoid having to do any
          calculations here for Safari (where bugs might ONLY be detectable in that
          browser), we'll just use `contentBoxSize` for non-Safari.
        */
        if (contentBoxSize) {
          [width, height] =
            contentBoxSize instanceof ResizeObserverSize
              ? [contentBoxSize.inlineSize, contentBoxSize.blockSize]
              : [contentBoxSize[0]!.inlineSize, contentBoxSize[0]!.blockSize];
        } else {
          [width, height] = [contentRect.width, contentRect.height];
        }

        if (width && height) {
          if (width / height >= 16 / 9) {
            videoWrapper.classList.add('stretch-video');
          } else {
            videoWrapper.classList.remove('stretch-video');
          }
        }
      });
    });

    resizeObserver.observe(videoWrapperContainer);

    if (window.IS_STORYBOOK && window.observers) {
      window.observers.add(resizeObserver);
    }
  };

  if (window.Vimeo) {
    setUpVideo();
  } else {
    const script = document.createElement('script');
    script.src = '//player.vimeo.com/api/player.js';
    script.onload = setUpVideo;
    document.head.appendChild(script);
  }
};

if (!window.IS_STORYBOOK) setUpHeroPageHeader();

export default setUpHeroPageHeader;

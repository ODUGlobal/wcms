import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import HomepagePageHeaderTemplate from './HomepagePageHeader.twig';
import { ButtonLinkTwigContext } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import { FancyLinkTwigContext } from '@components/Atom/Link/FancyLink/FancyLink.stories';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';

const HomepagePageHeaderPureComponent = (
  twigContext: HomepagePageHeaderTwigContext
) => HomepagePageHeaderTemplate(twigContext);

export type HomepagePageHeaderTwigContext = {
  /** For actual homepage h1 (presumably something like "ODU Global"). */
  visuallyHiddenH1Text: string;
  /**
   * Big visible headline text ("tagline").
   * Each array-entry gets its own line (so that we can optionally try to customize where line-breaks occur).
   */
  headline: string[];
  /**
   * WYSIWYG markup, but note that everything will get the same font-size here, so avoid h-tags.
   * Probably just stick with p-tags if possible. Lists are okay too.
   */
  wysiwyg?: string;
  buttonLink?: ButtonLinkTwigContext;
  fancyLink?: FancyLinkTwigContext;
  /**
   * Something like 16:9. Required even if there is a video.
   * Will stretch/crop to fill space, so the image should be
   * quite wide in order to avoid losing image-quality on
   * larger monitors. Maybe minimum width of 2000px or so?
   */
  picture: InjectedComponent<typeof Picture>;
  /**
   * If supplied, ambient-video mechanism will kick in.
   * Video will always be muted and will never autoplay. Attempts to loop, also.
   * NOTE: the Vimeo video should be LANDSCAPE (16/9).
   */
  vimeoId?: string;
};

const meta: Meta = {
  title: 'Organism/Page Header/Homepage Page Header',
  excludeStories: ['HomepagePageHeader', 'defaultHomepagePageHeader'],
};

export default meta;

const defaultH1Text = 'ODU Global';

const defaultHeadline = ['Right Where', 'You Are'];

export const defaultHomepagePageHeader = ({
  visuallyHiddenH1Text,
  headline,
  wysiwyg,
  withEditorial,
  buttonLink,
  withButtonLink,
  fancyLink,
  withFancyLink,
  picture,
  vimeoId,
  withVideo,
}: HomepagePageHeaderArgs): HomepagePageHeaderTwigContext => {
  visuallyHiddenH1Text = visuallyHiddenH1Text || defaultH1Text;

  headline = headline || defaultHeadline;

  wysiwyg =
    wysiwyg ||
    (withEditorial
      ? /* html */ `<p>ODUGlobal’s programs will help you fit education into your busy life. Whatever the time, wherever the place, we make it work for you.</p>`
      : undefined);

  buttonLink =
    buttonLink ||
    (withButtonLink
      ? { link: { title: 'Request Information', url: '#' } }
      : undefined);

  fancyLink =
    fancyLink ||
    (withFancyLink
      ? { withAfterIcon: true, link: { title: `I'm ready to apply`, url: '#' } }
      : undefined);

  picture =
    picture ||
    Picture({
      ...Picture.args,
      src: `${window.IMAGES}/sample-home-hero.jpg`,
    });

  vimeoId = vimeoId || (withVideo ? '776314365' : undefined);

  return {
    visuallyHiddenH1Text,
    headline,
    wysiwyg,
    buttonLink,
    fancyLink,
    picture,
    vimeoId,
  };
};

export const HomepagePageHeaderStory: Story<HomepagePageHeaderArgs> = {
  name: 'Homepage Page Header',

  parameters: {
    render: (args) =>
      HomepagePageHeaderPureComponent(defaultHomepagePageHeader(args)),
  },

  args: {
    withVideo: true,
    headline: defaultHeadline,
    withEditorial: true,
    withButtonLink: true,
    withFancyLink: true,
  },

  argTypes: {
    headline: {
      name: 'headline (each entry gets its own line if possible, so we can try to control where line-breaks occur)',
    },
  },
};

type HomepagePageHeaderArgs = Partial<HomepagePageHeaderTwigContext> & {
  withVideo?: boolean;
  withEditorial?: boolean;
  withButtonLink?: boolean;
  withFancyLink?: boolean;
};

export const HomepagePageHeader = makeComponentInjector({
  pureComponent: HomepagePageHeaderPureComponent,
  storyRenderFn: HomepagePageHeaderStory.parameters.render,
  defaultArgs: HomepagePageHeaderStory.args,
});

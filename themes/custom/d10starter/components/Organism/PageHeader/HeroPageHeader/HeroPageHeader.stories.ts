import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import HeroPageHeaderTemplate from './HeroPageHeader.twig';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import { EditorialTwigContext } from '@components/Organism/Editorial/Editorial.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';

const HeroPageHeaderPureComponent = (twigContext: HeroPageHeaderTwigContext) =>
  HeroPageHeaderTemplate(twigContext);

export type HeroPageHeaderTwigContext = {
  /** for page h1 */
  headline: string;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
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
  title: 'Organism/Page Header/Hero Page Header',
  excludeStories: ['HeroPageHeader', 'defaultHeroPageHeader'],
};

export default meta;

const defaultHeadline = 'Landing Page Hero with Optional Ambient Video.';

export const defaultHeroPageHeader = ({
  headline,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  buttonLinkList,
  withButtonLinks,
  picture,
  vimeoId,
  withVideo,
}: HeroPageHeaderArgs): HeroPageHeaderTwigContext => {
  headline = headline || defaultHeadline;

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `
            <p>ODUGlobal will help you fit education into your busy life. Whatever the time, wherever the place, we make it work for you.</p>
          `,
        }
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  buttonLinkList =
    buttonLinkList || (withButtonLinks ? defaultButtonLinkList : undefined);

  picture =
    picture ||
    Picture({ ...Picture.args, src: `${window.IMAGES}/sample-hero.jpg` });

  vimeoId = vimeoId || (withVideo ? '776314365' : undefined);

  return {
    headline,
    editorial,
    fancyLinkList,
    buttonLinkList,
    picture,
    vimeoId,
  };
};

export const HeroPageHeaderStory: Story<HeroPageHeaderArgs> = {
  name: 'Hero Page Header',

  parameters: {
    render: (args) => HeroPageHeaderPureComponent(defaultHeroPageHeader(args)),
  },

  args: {
    withVideo: true,
    headline: defaultHeadline,
    withEditorial: true,
    withFancyLinks: true,
    withButtonLinks: true,
  },
};

type HeroPageHeaderArgs = Partial<HeroPageHeaderTwigContext> & {
  withVideo?: boolean;
  headline?: string;
  withEditorial?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const HeroPageHeader = makeComponentInjector({
  pureComponent: HeroPageHeaderPureComponent,
  storyRenderFn: HeroPageHeaderStory.parameters.render,
  defaultArgs: HeroPageHeaderStory.args,
});

import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import StandardTeaserTemplate from './StandardTeaser.twig';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '@components/Organism/Editorial/Editorial.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import {
  IconDescriptionListTwigContext,
  defaultIconDescriptionList,
} from '@components/Molecule/IconDescriptionList/IconDescriptionList.stories';

const StandardTeaserPureComponent = (twigContext: StandardTeaserTwigContext) =>
  StandardTeaserTemplate(twigContext);

export type StandardTeaserTwigContext = {
  link: { url: string; title: string };
  /** Defaults to 3 (b/c usually it's part of a collection with an h2), but adjust as needed based on context. */
  hLevel?: 2 | 3 | 4 | 5;
  /**
   * Defaults to 3, but use 4 if smaller text is needed (e.g., in 4-up collection),
   * and use 2 if bigger text is desired (for some kind of "featured" teaser, say).
   */
  hStyleLevel?: 2 | 3 | 4;
  superhead?: string;
  subhead?: string;
  /**
   * All teaser-pictures in a teaser-collection should have the same dimensions.
   * In the comps, the aspect-ratio is about 3:2.
   * Minimum width: 720px.
   */
  picture?: InjectedComponent<typeof Picture>;
  editorial?: EditorialTwigContext;
  iconDescriptionList?: IconDescriptionListTwigContext;
  /** If `true`, `iconDescriptionList` will come before `editorial` if both are present. */
  iconDescriptionListFirst?: boolean;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
};

const injectHelper: {
  [K in keyof Required<StandardTeaserTwigContext>]: K;
} = {
  link: 'link',
  hLevel: 'hLevel',
  hStyleLevel: 'hStyleLevel',
  superhead: 'superhead',
  subhead: 'subhead',
  picture: 'picture',
  editorial: 'editorial',
  fancyLinkList: 'fancyLinkList',
  buttonLinkList: 'buttonLinkList',
  iconDescriptionList: 'iconDescriptionList',
  iconDescriptionListFirst: 'iconDescriptionListFirst',
};

const meta: Meta = {
  title: 'Molecule/Teaser/Standard Teaser',
  excludeStories: [
    'StandardTeaser',
    'defaultStandardTeaserPicture',
    'defaultStandardTeaser',
  ],
};

export default meta;

const defaultLinkTitle =
  'This is a standard teaser with a long link-title so that we can see wrapping behavior';

export const defaultStandardTeaserPicture = Picture({
  ...Picture.args,
  w: 300 * 5,
  h: 200 * 5,
});

export const defaultStandardTeaser = ({
  hLevel,
  hStyleLevel,
  link,
  linkTitle,
  superhead,
  withSuperhead,
  subhead,
  withSubhead,
  picture,
  withPicture,
  editorial,
  withEditorial,
  iconDescriptionList,
  withIconDescriptionList,
  iconDescriptionListFirst,
  fancyLinkList,
  withFancyLinks,
  buttonLinkList,
  withButtonLinks,
}: StandardTeaserArgs): StandardTeaserTwigContext => {
  link = link || {
    url: '#',
    title: linkTitle || defaultLinkTitle,
  };

  superhead = superhead || (withSuperhead ? 'Superhead' : undefined);

  subhead = subhead || (withSubhead ? 'Subhead' : undefined);

  picture = picture || (withPicture ? defaultStandardTeaserPicture : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  iconDescriptionList =
    iconDescriptionList ||
    (withIconDescriptionList ? defaultIconDescriptionList : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  buttonLinkList =
    buttonLinkList || (withButtonLinks ? defaultButtonLinkList : undefined);

  return {
    hLevel,
    hStyleLevel,
    link,
    superhead,
    subhead,
    picture,
    editorial,
    iconDescriptionList,
    iconDescriptionListFirst,
    fancyLinkList,
    buttonLinkList,
  };
};

export const StandardTeaserStory: Story<StandardTeaserArgs> = {
  name: 'Standard Teaser',

  parameters: {
    render: ({
      hLevel,
      hStyleLevel,
      link,
      linkTitle,
      superhead,
      withSuperhead,
      subhead,
      withSubhead,
      picture,
      withPicture,
      editorial,
      withEditorial,
      iconDescriptionList,
      withIconDescriptionList,
      iconDescriptionListFirst,
      fancyLinkList,
      withFancyLinks,
      buttonLinkList,
      withButtonLinks,
    }) => {
      const standardTeaserTwigContext = defaultStandardTeaser({
        hLevel,
        hStyleLevel,
        link,
        linkTitle,
        superhead,
        withSuperhead,
        subhead,
        withSubhead,
        picture,
        withPicture,
        editorial,
        withEditorial,
        iconDescriptionList,
        withIconDescriptionList,
        iconDescriptionListFirst,
        fancyLinkList,
        withFancyLinks,
        buttonLinkList,
        withButtonLinks,
      });

      return StandardTeaserPureComponent(standardTeaserTwigContext);
    },
  },

  args: {
    withPicture: true,
    withSuperhead: true,
    withSubhead: true,
    withEditorial: true,
    withIconDescriptionList: false,
    iconDescriptionListFirst: false,
    withFancyLinks: true,
    withButtonLinks: true,
    linkTitle: defaultLinkTitle,
  },

  argTypes: {
    iconDescriptionListFirst: {
      name: 'iconDescriptionListFirst (if `true`, `iconDescriptionList` will come before `editorial` if both are present)',
    },
  },

  decorators: [
    (story) => /* html */ `
      <div class="vertical-rhythm-standard">
        <div class="container">
          <div class="max-w-xl">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
};

type StandardTeaserArgs = Partial<StandardTeaserTwigContext> & {
  withPicture?: boolean;
  linkTitle?: string;
  withSuperhead?: boolean;
  withSubhead?: boolean;
  withEditorial?: boolean;
  withIconDescriptionList?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const StandardTeaser = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: StandardTeaserPureComponent,
  storyRenderFn: StandardTeaserStory.parameters.render,
  defaultArgs: StandardTeaserStory.args,
});

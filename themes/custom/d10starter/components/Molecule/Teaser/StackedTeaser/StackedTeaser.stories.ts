import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import StackedTeaserTemplate from './StackedTeaser.twig';
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

const StackedTeaserPureComponent = (twigContext: StackedTeaserTwigContext) =>
  StackedTeaserTemplate(twigContext);

export type StackedTeaserTwigContext = {
  /** To accommodate non-links, the `url` can be omitted. */
  link: { url?: string; title: string };
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
   * All teaser-pictures in a teaser-collection should probably have the same dimensions
   * (though that's not as important for these "stacked" teasers as it is for the "standard" ones).
   * In the comps, the aspect-ratio is about 3:2, or a square if it's a portrait of a person.
   * At least 576px width.
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
  [K in keyof Required<StackedTeaserTwigContext>]: K;
} = {
  link: 'link',
  hLevel: 'hLevel',
  hStyleLevel: 'hStyleLevel',
  superhead: 'superhead',
  subhead: 'subhead',
  picture: 'picture',
  editorial: 'editorial',
  iconDescriptionList: 'iconDescriptionList',
  fancyLinkList: 'fancyLinkList',
  buttonLinkList: 'buttonLinkList',
  iconDescriptionListFirst: 'iconDescriptionListFirst',
};

const meta: Meta = {
  title: 'Molecule/Teaser/Stacked Teaser',
  excludeStories: [
    'StackedTeaser',
    'defaultStackedTeaserPicture',
    'defaultStackedTeaser',
  ],
};

export default meta;

const defaultLinkTitle =
  'This is a standard teaser with a long link-title so that we can see wrapping behavior';

export const defaultStackedTeaserPicture = Picture({
  ...Picture.args,
  w: 300 * 5,
  h: 200 * 5,
});

export const defaultStackedTeaser = ({
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
}: StackedTeaserArgs): StackedTeaserTwigContext => {
  link = link || {
    url: '#',
    title: linkTitle || defaultLinkTitle,
  };

  superhead = superhead || (withSuperhead ? 'Superhead' : undefined);

  subhead = subhead || (withSubhead ? 'Subhead' : undefined);

  picture = picture || (withPicture ? defaultStackedTeaserPicture : undefined);

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

export const StackedTeaserStory: Story<StackedTeaserArgs> = {
  name: 'Stacked Teaser',

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
      const stackedTeaserTwigContext = defaultStackedTeaser({
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

      return StackedTeaserPureComponent(stackedTeaserTwigContext);
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
          <div class="max-w-3xl">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
};

type StackedTeaserArgs = Partial<StackedTeaserTwigContext> & {
  withPicture?: boolean;
  linkTitle?: string;
  withSuperhead?: boolean;
  withSubhead?: boolean;
  withEditorial?: boolean;
  withIconDescriptionList?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const StackedTeaser = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: StackedTeaserPureComponent,
  storyRenderFn: StackedTeaserStory.parameters.render,
  defaultArgs: StackedTeaserStory.args,
});

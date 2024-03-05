import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import CardTemplate from './Card.twig';
import {
  Picture,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '@components/Organism/Editorial/Editorial.stories';
import {
  IconDescriptionListTwigContext,
  defaultIconDescriptionList,
} from '../IconDescriptionList/IconDescriptionList.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '../LinkList/FancyLinkList/FancyLinkList.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '../LinkList/ButtonLinkList/ButtonLinkList.stories';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [Theme.Neutral50, Theme.Default] as const;

const CardPureComponent = (twigContext: CardTwigContext) =>
  CardTemplate(twigContext);

export type CardTwigContext = {
  /**
   * Defaults to `'neutral-50'` (b/c collection defaults to no-theme).
   * Note: `null` (no theme) is not an option here.
   */
  theme?: (typeof themeOptions)[number];
  headline?: string;
  /** Defaults to 3 (b/c usually it's part of a collection with an h2), but adjust as needed based on context. */
  hLevel?: 2 | 3 | 4 | 5;
  superhead?: string;
  subhead?: string;
  /**
   * All card-pictures in a card-collection should probably have the same dimensions.
   * In the comps, they're all squares.
   * Minimum width of 96px.
   */
  picture?: InjectedComponent<typeof Picture>;
  /**
   * If `true`, the `picture` (if present) will NOT get `aria-hidden="true"`.
   * Use if the image in question isn't decorative (e.g., if it's a photograph
   * of a person instead of just a decorative icon).
   */
  pictureIsNotDecorative?: boolean;
  editorial?: EditorialTwigContext;
  iconDescriptionList?: IconDescriptionListTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
};

const injectHelper: {
  [K in keyof Required<CardTwigContext>]: K;
} = {
  theme: 'theme',
  headline: 'headline',
  hLevel: 'hLevel',
  superhead: 'superhead',
  subhead: 'subhead',
  picture: 'picture',
  pictureIsNotDecorative: 'pictureIsNotDecorative',
  editorial: 'editorial',
  iconDescriptionList: 'iconDescriptionList',
  fancyLinkList: 'fancyLinkList',
  buttonLinkList: 'buttonLinkList',
};

const meta: Meta = {
  title: 'Molecule/Card',
  excludeStories: ['Card', 'defaultCardPicture', 'defaultCard'],
};

export default meta;

export const defaultCardPicture: CardTwigContext['picture'] = Picture({
  ...Picture.args,
  w: 900,
  h: 900,
});

export const defaultCard = ({
  theme,
  headline,
  hLevel,
  superhead,
  withSuperhead,
  subhead,
  withSubhead,
  picture,
  pictureIsNotDecorative,
  withPicture,
  editorial,
  iconDescriptionList,
  withIconDescriptionList,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  buttonLinkList,
  withButtonLinks,
}: CardArgs): CardTwigContext => {
  superhead = superhead || (withSuperhead ? 'Superhead' : undefined);

  subhead = subhead || (withSubhead ? 'Subhead' : undefined);

  picture = picture || (withPicture ? defaultCardPicture : undefined);

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
    theme,
    headline,
    hLevel,
    superhead,
    subhead,
    picture,
    pictureIsNotDecorative,
    editorial,
    iconDescriptionList,
    fancyLinkList,
    buttonLinkList,
  };
};

export const CardStory: Story<CardArgs> = {
  name: 'Card',

  parameters: {
    render: (args) => CardPureComponent(defaultCard(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: 'This is the Title of a Card (Maybe the Name of a Person)',
    withPicture: true,
    withSuperhead: true,
    withSubhead: true,
    withEditorial: true,
    withIconDescriptionList: false,
    withFancyLinks: true,
    withButtonLinks: true,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },

  decorators: [
    (story, { args: { theme } }) => /* html */ `
      <div ${
        theme === Theme.Default ? /* html */ `data-tw-theme="neutral-50"` : ''
      }>
        <div class="py-vertical-space bg-theme-bg-color text-theme-text-color">
          <div class="container">
            <div class="max-w-sm">
              ${story()}
            </div>
          </div>
        </div>
      </div>
    `,
  ],
};

type CardArgs = Partial<CardTwigContext> & {
  withPicture?: boolean;
  withSuperhead?: boolean;
  withSubhead?: boolean;
  withEditorial?: boolean;
  withIconDescriptionList?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const Card = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: CardPureComponent,
  storyRenderFn: CardStory.parameters.render,
  defaultArgs: CardStory.args,
});

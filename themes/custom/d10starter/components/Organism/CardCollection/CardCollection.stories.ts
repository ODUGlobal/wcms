import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import CardCollectionTemplate from './CardCollection.twig';
import Theme from '@components/_ts-helpers/theme';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  Editorial,
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import {
  Card,
  CardTwigContext,
  defaultCardPicture,
} from '@components/Molecule/Card/Card.stories';
import { defaultIconDescriptionList } from '@components/Molecule/IconDescriptionList/IconDescriptionList.stories';
import { defaultButtonLinkList } from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';

const themeOptions = [null, Theme.Default, Theme.Neutral50] as const;
const maxColsOptions = [2, 3] as const;

const CardCollectionPureComponent = (twigContext: CardCollectionTwigContext) =>
  CardCollectionTemplate(twigContext);

export type CardCollectionTwigContext = {
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  cards: InjectedComponent<typeof Card>[];
  /** Defaults to 3 if the collection has a `heading` and 2 otherwise, but override if needed. */
  cardHLevel?: 2 | 3 | 4;
  /**
   * If `true`, will suppress `aria-hidden="true"` on the `picture` of each card (if it has one).
   * Use if the pictures are not decorative (e.g., photographs of people instead of icons).
   */
  cardPicturesAreNotDecorative?: boolean;
  maxCols?: (typeof maxColsOptions)[number];
  id?: string;
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
};

const meta: Meta = {
  title: 'Organism/Card Collection',
  excludeStories: ['CardCollection', 'defaultCards', 'defaultCardCollection'],
};

export default meta;

const defaultCardData: (typeof Card.args)[] = [
  {
    headline: 'Lorem ipsum dolor sit amet',
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
    picture: defaultCardPicture,
  },
  {
    headline:
      'This title is a bit longer than the others, because we need to see various lengths and wrapping behavior. No picture this time.',
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.  In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
  },
  {
    headline: 'Short one',
    superhead: 'A longer superhead on this one for the sake of variety',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante.</p>`,
    },
    picture: defaultCardPicture,
  },
  {
    headline: 'Another card here, no picture',
    superhead: 'Superhead',
    subhead:
      'This subhead is longer than the others because variety is the spice of life',
    editorial: {
      ...Editorial.args,
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. </p>`,
    },
  },
];

export const defaultCards = ({
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  withFancyLinkList,
  withButtonLinks,
}: {
  withSuperheads?: boolean;
  withSubheads?: boolean;
  withDescriptions?: boolean;
  withIconDescriptionLists?: boolean;
  withFancyLinkList?: boolean;
  withButtonLinks?: boolean;
}): CardCollectionTwigContext['cards'] =>
  defaultCardData.map((cardProps) =>
    Card({
      ...cardProps,
      ...(!withSuperheads ? { superhead: undefined } : {}),
      ...(!withSubheads ? { subhead: undefined } : {}),
      ...(!withDescriptions ? { editorial: undefined } : {}),
      ...(withIconDescriptionLists
        ? { iconDescriptionList: defaultIconDescriptionList }
        : {}),
      ...(withFancyLinkList
        ? {
            fancyLinkList: {
              fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }),
            },
          }
        : {}),
      ...(withButtonLinks
        ? {
            buttonLinkList: defaultButtonLinkList,
          }
        : {}),
    })
  );

export const defaultCardCollection = ({
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  cards,
  cardHLevel,
  cardPicturesAreNotDecorative,
  maxCols,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  withButtonLinks,
  withItemFancyLinks,
  itemCount,
  id,
  verticalRhythm,
  theme,
}: CardCollectionArgs): CardCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  cards =
    cards ||
    itemsFromCount(
      defaultCards({
        withSuperheads,
        withSubheads,
        withDescriptions,
        withIconDescriptionLists,
        withFancyLinkList: withItemFancyLinks,
        withButtonLinks,
      }),
      itemCount
    );

  return {
    heading,
    fancyLinkList,
    editorial,
    cards,
    cardHLevel,
    cardPicturesAreNotDecorative,
    maxCols,
    id,
    verticalRhythm,
    theme,
  };
};

export const CardCollectionStory: Story<CardCollectionArgs> = {
  name: 'Card Collection',

  parameters: {
    render: (args) => CardCollectionPureComponent(defaultCardCollection(args)),
  },

  args: {
    theme: themeOptions[0],
    maxCols: 3,
    itemCount: 4,
    headline: 'This Is a Card Collection',
    withFancyLinks: true,
    withEditorial: true,
    withSuperheads: true,
    withSubheads: true,
    withDescriptions: true,
    withIconDescriptionLists: false,
    withItemFancyLinks: true,
    withButtonLinks: true,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    maxCols: {
      options: maxColsOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },
};

type CardCollectionArgs = Partial<CardCollectionTwigContext> & {
  itemCount?: number;
  headline?: string;
  withFancyLinks?: boolean;
  withEditorial?: boolean;
  withSuperheads?: boolean;
  withSubheads?: boolean;
  withDescriptions?: boolean;
  withIconDescriptionLists?: boolean;
  withItemFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const CardCollection = makeComponentInjector({
  pureComponent: CardCollectionPureComponent,
  storyRenderFn: CardCollectionStory.parameters.render,
  defaultArgs: CardCollectionStory.args,
});

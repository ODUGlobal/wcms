import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import StackedTeaserCollectionTemplate from './StackedTeaserCollection.twig';
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
import { EditorialTwigContext } from '@components/Organism/Editorial/Editorial.stories';
import {
  defaultStackedTeaserPicture,
  StackedTeaser,
} from '@components/Molecule/Teaser/StackedTeaser/StackedTeaser.stories';
import { defaultButtonLinkList } from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import { defaultIconDescriptionList } from '@components/Molecule/IconDescriptionList/IconDescriptionList.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.MidBlue500,
] as const;

const StackedTeaserCollectionPureComponent = (
  twigContext: StackedTeaserCollectionTwigContext
) => StackedTeaserCollectionTemplate(twigContext);

export type StackedTeaserCollectionTwigContext = {
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  teasers: InjectedComponent<typeof StackedTeaser>[];
  /** Defaults to 3 if the collection has a `heading` and 2 otherwise, but override if needed. */
  teaserHLevel?: 2 | 3 | 4;
  /** Defaults to 3. */
  teaserHStyleLevel?: 3 | 4;
  id?: string;
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
  /**
   * If `true`, won't be wrapped in `GenericSlab`.
   * Mutually exclusive with: `heading`, `fancyLinkList`, `editorial`, `id`, `verticalRhythm`, and `theme`.
   */
  noGenericSlab?: boolean;
};

const meta: Meta = {
  title: 'Organism/Teaser Collection/Stacked Teaser Collection',
  excludeStories: [
    'StackedTeaserCollection',
    'defaultStackedTeasers',
    'defaultStackedTeaserCollection',
  ],
};

export default meta;

const defaultStackedTeaserData: (typeof StackedTeaser.args)[] = [
  {
    link: { url: '#', title: 'Lorem ipsum dolor sit amet' },
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
    picture: defaultStackedTeaserPicture,
  },
  {
    link: {
      url: '#',
      title:
        'This link is a bit longer than the others, because we need to see various lengths and wrapping behavior. No picture this time.',
    },
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.  In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
  },
  {
    link: { url: '#', title: 'Short one' },
    superhead: 'A longer superhead on this one for the sake of variety',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante.</p>`,
    },
    picture: defaultStackedTeaserPicture,
  },
  {
    link: { url: '#', title: 'Another stacked teaser here, no picture' },
    superhead: 'Superhead',
    subhead:
      'This subhead is longer than the others because variety is the spice of life',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. </p>`,
    },
  },
];

export const defaultStackedTeasers = ({
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  iconDescriptionListFirst,
  withFancyLinkList,
  withButtonLinks,
}: {
  withSuperheads?: boolean;
  withSubheads?: boolean;
  withDescriptions?: boolean;
  withIconDescriptionLists?: boolean;
  iconDescriptionListFirst?: boolean;
  withFancyLinkList?: boolean;
  withButtonLinks?: boolean;
}): StackedTeaserCollectionTwigContext['teasers'] =>
  defaultStackedTeaserData.map((teaserProps) =>
    StackedTeaser({
      ...teaserProps,
      ...(!withSuperheads ? { superhead: undefined } : {}),
      ...(!withSubheads ? { subhead: undefined } : {}),
      ...(!withDescriptions ? { editorial: undefined } : {}),
      ...(withIconDescriptionLists
        ? { iconDescriptionList: defaultIconDescriptionList }
        : {}),
      iconDescriptionListFirst,
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

export const defaultStackedTeaserCollection = ({
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  teasers,
  teaserHLevel,
  teaserHStyleLevel,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  iconDescriptionListFirst,
  withButtonLinks,
  withItemFancyLinks,
  itemCount,
  id,
  verticalRhythm,
  theme,
  noGenericSlab,
}: StackedTeaserCollectionArgs): StackedTeaserCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna. Nullam ac sapien magna.</p>`,
        }
      : undefined);

  teasers =
    teasers ||
    itemsFromCount(
      defaultStackedTeasers({
        withSuperheads,
        withSubheads,
        withDescriptions,
        withIconDescriptionLists,
        iconDescriptionListFirst,
        withFancyLinkList: withItemFancyLinks,
        withButtonLinks,
      }),
      itemCount
    );

  return {
    heading,
    fancyLinkList,
    editorial,
    teasers,
    teaserHLevel,
    teaserHStyleLevel,
    id,
    verticalRhythm,
    theme,
    noGenericSlab,
  };
};

export const StackedTeaserCollectionStory: Story<StackedTeaserCollectionArgs> =
  {
    name: 'Stacked Teaser Collection',

    parameters: {
      render: (args) =>
        StackedTeaserCollectionPureComponent(
          defaultStackedTeaserCollection(args)
        ),
    },

    args: {
      itemCount: 4,
      theme: themeOptions[0],
      headline: 'Stacked Teaser Collection',
      withFancyLinks: true,
      withEditorial: true,
      withSuperheads: true,
      withSubheads: true,
      withDescriptions: true,
      withIconDescriptionLists: false,
      iconDescriptionListFirst: false,
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
      iconDescriptionListFirst: {
        name: 'iconDescriptionListFirst (if `true`, `iconDescriptionList` will come before `editorial` if both are present in the individual teasers)',
      },
    },
  };

type StackedTeaserCollectionArgs =
  Partial<StackedTeaserCollectionTwigContext> & {
    itemCount?: number;
    headline?: string;
    withFancyLinks?: boolean;
    withEditorial?: boolean;
    withSuperheads?: boolean;
    withSubheads?: boolean;
    withDescriptions?: boolean;
    withIconDescriptionLists?: boolean;
    iconDescriptionListFirst?: boolean;
    withItemFancyLinks?: boolean;
    withButtonLinks?: boolean;
  };

export const StackedTeaserCollection = makeComponentInjector({
  pureComponent: StackedTeaserCollectionPureComponent,
  storyRenderFn: StackedTeaserCollectionStory.parameters.render,
  defaultArgs: StackedTeaserCollectionStory.args,
});

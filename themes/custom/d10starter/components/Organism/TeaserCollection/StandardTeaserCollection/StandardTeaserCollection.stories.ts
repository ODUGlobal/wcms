import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import StandardTeaserCollectionTemplate from './StandardTeaserCollection.twig';
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
  defaultStandardTeaserPicture,
  StandardTeaser,
} from '@components/Molecule/Teaser/StandardTeaser/StandardTeaser.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import { defaultButtonLinkList } from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import { defaultIconDescriptionList } from '@components/Molecule/IconDescriptionList/IconDescriptionList.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.MidBlue500,
] as const;
const maxColsOptions = [2, 3, 4] as const;

const StandardTeaserCollectionPureComponent = (
  twigContext: StandardTeaserCollectionTwigContext
) => StandardTeaserCollectionTemplate(twigContext);

export type StandardTeaserCollectionTwigContext = {
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  teasers: InjectedComponent<typeof StandardTeaser>[];
  /** Defaults to 3 if the collection has a `heading` and 2 otherwise, but override if needed. */
  teaserHLevel?: 2 | 3 | 4;
  /**
   *  Defaults to 3.
   *  If using 4, individual teasers get `hStyleLevel: 4` (instead of `3`).
   */
  maxCols?: (typeof maxColsOptions)[number];
  id?: string;
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
};

const meta: Meta = {
  title: 'Organism/Teaser Collection/Standard Teaser Collection',
  excludeStories: [
    'StandardTeaserCollection',
    'defaultStandardTeasers',
    'defaultStandardTeaserCollection',
  ],
};

export default meta;

const defaultStandardTeaserData: (typeof StandardTeaser.args)[] = [
  {
    link: { url: '#', title: 'Lorem ipsum dolor sit amet' },
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
  },
  {
    link: {
      url: '#',
      title:
        'This link is a bit longer than the others, because we need to see various lengths and wrapping behavior',
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
  },
  {
    link: { url: '#', title: 'Another standard teaser here' },
    superhead: 'Superhead',
    subhead:
      'This subhead is longer than the others because variety is the spice of life',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. </p>`,
    },
  },
];

export const defaultStandardTeasers = ({
  withPictures,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  iconDescriptionListFirst,
  withFancyLinks,
  withButtonLinks,
}: {
  withPictures?: boolean;
  withSuperheads?: boolean;
  withSubheads?: boolean;
  withDescriptions?: boolean;
  withIconDescriptionLists?: boolean;
  iconDescriptionListFirst?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
}): StandardTeaserCollectionTwigContext['teasers'] =>
  defaultStandardTeaserData.map((teaserProps) =>
    StandardTeaser({
      ...teaserProps,
      ...(withPictures ? { picture: defaultStandardTeaserPicture } : {}),
      ...(!withSuperheads ? { superhead: undefined } : {}),
      ...(!withSubheads ? { subhead: undefined } : {}),
      ...(!withDescriptions ? { editorial: undefined } : {}),
      ...(withIconDescriptionLists
        ? { iconDescriptionList: defaultIconDescriptionList }
        : {}),
      iconDescriptionListFirst,
      ...(withFancyLinks
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

export const defaultStandardTeaserCollection = ({
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  teasers,
  teaserHLevel,
  withPictures,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withIconDescriptionLists,
  iconDescriptionListFirst,
  withItemFancyLinks,
  withButtonLinks,
  itemCount,
  maxCols,
  id,
  verticalRhythm,
  theme,
}: StandardTeaserCollectionArgs): StandardTeaserCollectionTwigContext => {
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
      defaultStandardTeasers({
        withPictures,
        withSuperheads,
        withSubheads,
        withDescriptions,
        withIconDescriptionLists,
        iconDescriptionListFirst,
        withFancyLinks: withItemFancyLinks,
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
    maxCols,
    id,
    verticalRhythm,
    theme,
  };
};

export const StandardTeaserCollectionStory: Story<StandardTeaserCollectionArgs> =
  {
    name: 'Standard Teaser Collection',

    parameters: {
      render: (args) =>
        StandardTeaserCollectionPureComponent(
          defaultStandardTeaserCollection(args)
        ),
    },

    args: {
      itemCount: 3,
      maxCols: 3,
      theme: themeOptions[0],
      headline: 'Standard Teaser Collection',
      withFancyLinks: true,
      withEditorial: true,
      withPictures: true,
      withSuperheads: true,
      withSubheads: true,
      withDescriptions: true,
      withIconDescriptionLists: false,
      iconDescriptionListFirst: false,
      withItemFancyLinks: true,
      withButtonLinks: true,
    },

    argTypes: {
      maxCols: {
        options: maxColsOptions,
        control: {
          type: 'inline-radio',
        },
      },
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

type StandardTeaserCollectionArgs =
  Partial<StandardTeaserCollectionTwigContext> & {
    itemCount?: number;
    headline?: string;
    withFancyLinks?: boolean;
    withEditorial?: boolean;
    withPictures?: boolean;
    withSuperheads?: boolean;
    withSubheads?: boolean;
    withDescriptions?: boolean;
    withIconDescriptionLists?: boolean;
    iconDescriptionListFirst?: boolean;
    withItemFancyLinks?: boolean;
    withButtonLinks?: boolean;
  };

export const StandardTeaserCollection = makeComponentInjector({
  pureComponent: StandardTeaserCollectionPureComponent,
  storyRenderFn: StandardTeaserCollectionStory.parameters.render,
  defaultArgs: StandardTeaserCollectionStory.args,
});
